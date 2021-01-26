import { request } from "../../request/index.js";
const app = getApp();
const { API } = app.services;
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    goodList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
    categoryId: 0,
    cartCount:0,
    cartList:[],
    user:{},
    flag: true,
  },
  // 接口的返回数据
  Cates: [],
  onLoad: function (options) {
    /* 
    0 web中的本地存储和 小程序中的本地存储的区别
      1 写代码的方式不一样了 
        web: localStorage.setItem("key","value") localStorage.getItem("key")
    小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
      2:存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
      小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
    1 先判断一下本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2 没有旧数据 直接发送新请求 
    3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
     */
    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间  10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList =[]
        this.Cates.forEach(cate=> {
          leftMenuList.push({id:cate.id, name: cate.name})
        })
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  onShow() {
    const categoryId=getApp().globalData.categoryId||"";
    if(categoryId) {
      // this.setData({
      //   categoryId
      // })
    }
    if(this.data.categoryId) {
      this.listGoodByCategoryId(this.data.categoryId)
    }
    this.getUserInfo()
  },
  getUserInfo() {
    const user = wx.getStorageSync('USER')
    this.setData({
      user: user
    })
  },
  // 获取分类数据
  async getCates() {
    const res = await request({ url: "/productCategory/list/withChildren" });
    this.Cates = res.data;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList =[]
    this.Cates.forEach(cate=> {
      leftMenuList.push({id:cate.id, name: cate.name})
    })
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    console.info('点击的数据' + JSON.stringify(e))
    /*
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    3 根据不同的索引来渲染右侧的商品内容
     */
    const { index } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
    this.listGoodByCategoryId(this.Cates[index].children[0].id)

  },
  //根据分类加载缓存商品
  listGoodByCategoryId(categoryId) {
    this.setData({
      categoryId
    });
    //需要加载缓存数据
    const cart = wx.getStorageSync("cart");
    const goodList = this.data.goodList
    //购物车map
    let cartMap = new Map();
    let hasCach = false
    let cartCount =0
    for(const good of cart) {
      cartMap.set(good.id, good)
      //缓存存在分类，直接展示缓存
      if(good.productCategoryId === categoryId) {
        hasCach = true
      }
      cartCount+= good.count
    }
    console.info('是否存在缓存' + hasCach)
    console.info('类型id' + categoryId)
    this.setData({
      cartCount: cartCount
    })
    if(hasCach) {
      if(cart.length>0) {
        let cartCount = 0
        for(const good of goodList) {
          if(cartMap.has(good.id)) {
            good.count = cartMap.get(good.id).count
          }else {
            good.count=0
          }
        }

        console.info(goodList)
        this.setData({
          goodList: goodList
        })
      }else {
        for(const good of goodList) {
          good.count = 0
        }
        this.setData({
          goodList: goodList,
          cartCount: 0
        })
      }
    }else {
      API.listProductBycategoryId({productCategoryId: categoryId}).then(res => {
        if (res.data) {
          const goodList = res.data.data.list;
          this.setData({
            goodList: goodList
          })
        }
      })
    }
  },
  listGood(e) {
    var categoryId = e.currentTarget.dataset.id;
    var _this = this;
    _this.setData({
      categoryId
    });
    API.listProductBycategoryId({productCategoryId: categoryId}).then(res => {
      if (res.data) {
        const goodList = res.data.data.list;
        this.setData({
          goodList: goodList
        })
        _this.listGoodByCategoryId(categoryId)
      }
    })
  },
  goodSubtraction(e) {
    const user =wx.getStorageSync('USER')
    if(!user.phone) {
      this.showMask()
      return
    }
    //设置商品
    var index = e.currentTarget.dataset.index;
    var newGoodList = this.data.goodList;
    var good = newGoodList[index];

    //设置缓存
    const cartList = wx.getStorageSync("cart");
    const goodId = good.id

    let filterCartList = []
    if(cartList.length >0) {
      for(const cart of cartList) {
        if(cart.id === goodId && cart.count>0) {
          cart.count = good.count-1
        }
        filterCartList.push(cart)
      }
    }
    filterCartList = filterCartList.filter(cart=>cart.count>0)
    console.info('减掉更新后的购物车缓存' + JSON.stringify(filterCartList))
    wx.setStorageSync('cart', filterCartList)
    this.onShow()
  },
  showMask: function () {
    this.setData({ flag: false })
  },
  closeMask: function () {
    this.setData({ flag: true })
  },
  goodAdd(e) {
    const user =wx.getStorageSync('USER')
    if(!user.phone) {
      this.showMask()
      return
    }
    var index = e.currentTarget.dataset.index;
    var newGoodList = this.data.goodList;
    var good = newGoodList[index];

    //设置缓存
    const cartList = wx.getStorageSync("cart");
    const goodId = good.id

    const cartMap = new Map()
    const goodMap = new Map()
    //商品
    for(const good of newGoodList) {
      goodMap.set(good.id, good)
    }
    //购物车
    for(const cart of cartList) {
      cartMap.set(cart.id, cart)
    }

    let newGood = {}
    let filterCartList = []
    if(cartList) {
      filterCartList = cartList.filter(cart => cart.id!== goodId)
    }

    if(cartMap.has(goodId)) {
      newGood = cartMap.get(goodId)
      newGood.count = newGood.count + 1
      for(const cart of cartList) {
        if(cart.id === newGood.id) {
          filterCartList.push(newGood)
        }
      }
    }else {
      newGood = goodMap.get(goodId)
      newGood.count = 1
      filterCartList.push(newGood)
    }

    console.info('增加更新后的购物车缓存' + JSON.stringify(filterCartList))
    if(filterCartList.length > 0) {
      filterCartList =  filterCartList.filter(cart=> cart.count>0)
    }
    wx.setStorageSync('cart', filterCartList)
    this.onShow()
  },
  getPhoneNumber (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    //------执行Login---------
    wx.login({
      success: res => {
        console.log('code转换', res.code);

        //用code传给服务器调换session_key
        const  queryData = {
          code: res.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }
        if (e.detail.errMsg == 'getPhoneNumber:user deny') { //用户点击拒绝
          console.info('用户点击拒绝')
        } else { //允许授权执行跳转
          //获取用户信息
          request({url:"/session/wetchatGetPhone",data:queryData}).then(result => {
            wx.setStorageSync('USER', result.data)
            this.setData({
              user: result.data
            })
          })
          this.closeMask()
        }


      }
    });
  },

  toCart() {
    wx.switchTab({
      url: '/pages/cart/index'
    });
  }
});