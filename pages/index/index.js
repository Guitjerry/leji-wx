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
    member: null,
    //新品推荐
    newGoodList:[],
    //品牌
    newBrandList:[],
    checked: false,
    RecommendProductList:[],
    user: {},
  },
  showMask: function () {
    this.setData({
      hidderAuthPhone: false,
    })
  },
  onShow() {
    this.queryMember()
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
  queryMember() {
    const user = wx.getStorageSync('USER')
    let checked = false
    if(user && user.id) {
      request({ url: "/member/" + user.id })
          .then(result => {
            if(result.data && result.data.status===1) {
              checked = true
            }
      })
    }
    this.setData({
      checked
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
    if(!this.data.checked) {
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
    if(this.data.user.phone || isShow === 1) {
      if(!this.data.checked) {
        this.showMask()
        return
      }
      wx.redirectTo({ url: '/pages/goods_detail/index?goods_id=' + id})
    }else {
      this.showMask()
    }
  }
})
