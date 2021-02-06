// 0 引入 用来发送请求的 方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    hidderAuthPhone: true,
    // 导航 数组
    catesList:[],
    // 楼层数据
    floorList:[],
    //新品推荐
    newGoodList:[],
    //品牌
    newBrandList:[],
    RecommendProductList:[],
    user: {},
  },
  showMask: function () {
    this.setData({
      hidderAuthPhone: false,
    })
  },
  onShow() {
    this.getUserInfo();
  },
  // 页面开始加载 就会触发
  onLoad: function (options) {
    // 1 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });

    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
    this.getBrandList();
    this.getNewGoodList();
    this.getRecommendProduct();
    this.getUserInfo();

  },
  getUserInfo() {
    const  _this = this
    setTimeout(function () {
      const user = wx.getStorageSync('USER')
      _this.setData({
        user: user
      })
    },1000)
  },
  // 获取轮播图数据
  getSwiperList(){
    request({ url: "/home/advertise/list" })
    .then(result => {
      this.setData({
        swiperList: result.data
      })
    })
  },
  // 获取 分类导航数据
  getCateList(){
    request({ url: "/productCategory/list" })
    .then(result => {
      this.setData({
        catesList: result.data
      })
    })
  },
  // 获取 楼层数据
  getFloorList(){
    request({ url: "/home/floordata" })
    .then(result => {
      this.setData({
        floorList: result
      })
    })
  },
  //查询新品推荐
  getNewGoodList(){
    request({ url: "/home/newProduct/list" })
        .then(result => {
          this.setData({
            newGoodList: result.data
          })
        })
  },
  //查询新品推荐
  getRecommendProduct(){
    request({ url: "/home/recommendProduct/list" })
        .then(result => {
          this.setData({
            RecommendProductList: result.data
          })
        })
  },

  //查询品牌推荐
  getBrandList(){
    request({ url: "/home/brand/list" })
        .then(result => {
          this.setData({
            newBrandList: result.data
          })
        })
  },
  toGoodList(e) {
    const id = e.currentTarget.dataset.id
    let app = getApp();
    app.globalData.categoryId = id
    wx.switchTab({
      url: '/pages/category/index'
    });
  },
  listByBrandId(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/goods_list/index?brandId=' + id })
  },
  goToDetail(e) {
    const user =wx.getStorageSync('USER')
    if(!user.phone) {
      this.showMask()
      return
    }
    const type = e.currentTarget.dataset.type
    wx.navigateTo({ url: '/pages/goods_list/index?type=' + type})
  },
  getPhoneNumber (e) {
    const user = wx.getStorageSync('USER')
    this.setData({
      user: user
    })
  },
  goToGoodDetail(e) {
    const id = e.currentTarget.dataset.id
    const isShow = e.currentTarget.dataset.show
    if(this.data.user.phone || isShow ===1) {
      wx.redirectTo({ url: '/pages/goods_detail/index?goods_id=' + id})
    }else {
      this.showMask()
    }

  }
})
