import {request} from "../../../request/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTab:0,
    tabItem: ["未使用", "已使用", "已失效"],
    //过期
    expireCoupons: [],
    //未使用
    unUseCoupons:[],
    //已使用
    usedCoupons:[],
    coupons:[],
    sNoData: {
      url: "https://s1.miniso.cn/bsimg/ec/public/images/f3/b7/f3b7dc5a8fddab547ab73ba53f5ffd55.png",
      text: "暂无优惠券"
    }
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
            this.setData({
              unUseCoupons: result.data.unUseCoupons,
              usedCoupons: result.data.usedCoupons,
              expireCoupons: result.data.expireCoupons
            })
            this.getData(0)
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
  getData(tab) {
    if(tab === 0) {
      //未使用
      this.setData({
        coupons:this.data.unUseCoupons
      })
    }else if(tab===1){
      this.setData({
        coupons:this.data.usedCoupons
      })
    }else if(tab===2){
      this.setData({
        coupons:this.data.expireCoupons
      })
    }
  },
  /**
   * tab点击
   */
  isTabfun: function (e) {
    if (this.data.isTab == e.target.dataset.number) return;
    this.setData({
      isTab: e.target.dataset.number,
    });
    this.getData(e.target.dataset.number);
  },
})