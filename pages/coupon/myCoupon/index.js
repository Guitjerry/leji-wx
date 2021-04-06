import {request} from "../../../request/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTab:0,
    tabItem: ["未使用", "已使用", "已失效"],
    couponState:{},
    //过期
    expireCoupons: [],
    //未使用
    unUseCoupons:[],
    //已使用
    usedCoupons:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    request({url: "/coupon/myCoupon"})
        .then(result => {
          if(result.data) {
            let couponState = []
            couponState.push({coupon: result.data.unUseCoupons})
            couponState.push({coupon: result.data.usedCoupons})
            couponState.push({coupon: result.data.expireCoupons})
            this.setData({
              couponState
            })
          }
        })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  receiveCoupon: function (e) {
    const id = e.currentTarget.dataset.id
  }
})