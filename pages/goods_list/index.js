/*
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 /  页容量  pagesize)
      总页数     = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数
      表示 没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果

 */
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    user: {},
    hidderAuthPhone: true,
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pageNum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info("数据" + JSON.stringify(options))
    this.QueryParams.productCategoryId=options.cid||"";
    this.QueryParams.brandId=options.brandId||"";
    this.QueryParams.query=options.query||"";
    this.QueryParams.type=options.type||"";
    this.getGoodsList();
  },
  onShow: function() {
    const user = wx.getStorageSync('USER')
    this.setData({
      user: user
    })
  },

  // 获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/product/list",data:this.QueryParams});
    // 获取 总条数
    const total=res.total;
    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接了数组
      goodsList:[...this.data.goodsList,...res.data.list]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();

  },


  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  // 页面上滑 滚动条触底事件
  onReachBottom(){
  //  1 判断还有没有下一页数据
    if(this.QueryParams.pageNum>=this.totalPages){
      // 没有下一页数据
      //  console.log('%c'+"没有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      wx.showToast({ title: '没有下一页数据' });

    }else{
      // 还有下一页数据
      //  console.log('%c'+"有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      this.QueryParams.pageNum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh(){
    // 1 重置数组
    this.setData({
      goodsList:[]
    })
    // 2 重置页码
    this.QueryParams.pageNum=this.QueryParams.pageNum+1;
    // 3 发送请求
    this.getGoodsList();
  },
  toGoodDetail (e) {
    const goodId = e.currentTarget.id
    const isShow = e.currentTarget.shows
    const user = wx.getStorageSync('USER')
    if(user.phone || isShow===1 ) {
     wx.redirectTo({
       url: '/pages/goods_detail/index?goods_id=' + goodId
     })
    }else {
      this.setData({
        hidderAuthPhone: false
      })
    }

  },
  getPhoneNumber () {
    const user = wx.getStorageSync('USER')
    this.setData({
      user
    })
  },
  sendCoupon (e) {
    const couponId = e.currentTarget.dataset.id
    const user =wx.getStorageSync('USER')
    if(user.phone) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      })
      request({ url: "/coupon/send?couponId=" + couponId + "&userId=" + user.uid })
      .then(result => {
        if(result.code === '200') {
          wx.showToast({ title: '领取成功' });
        }else {
          wx.showModal({
            title: '错误提示',
            content: result.message,
            showCancel:false
          })
        }
        wx.hideToast();
      })
    }else {
      this.setData({
        hidderAuthPhone: false
      })
    }

  }
})
