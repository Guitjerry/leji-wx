// pages/demo1/demo1.js
import {request} from "../../request/index";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        availableCoupons: [],
        wHeight: 0,
        sNoData: {
            url: "https://s1.miniso.cn/bsimg/ec/public/images/f3/b7/f3b7dc5a8fddab547ab73ba53f5ffd55.png",
            text: "暂无优惠券"
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this
        wx.getSystemInfo({
            success:function (res) {
                that.setData({
                    wHeight: res.windowHeight
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    getCouponList: function () {
        request({url: "/coupon/listWx"})
            .then(result => {
                if (result.data.availableCoupons) {
                    this.setData({
                        availableCoupons: result.data.availableCoupons
                    })
                    const that = this;
                    var couponList =wx.createSelectorQuery();
                    couponList.selectAll('.all-coupon').boundingClientRect(function(rect){
                        that.setData({
                            myCouponTip: rect[0].height + 20
                        })
                    }).exec()
                }
            })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
       this.getCouponList()
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
        //请求接收优惠券
        request({url: "/coupon/receiveCoupon/" + id})
            .then(result => {
                if (result.data) {
                    wx.showToast({
                        'title': '领取成功',
                    })
                    this.getCouponList()
                }else {
                    wx.showToast({
                        'title':result.message,
                        icon: 'none'

                    })
                }
            })
    },
    toMyCoupon: function () {
        wx.navigateTo({
            url: '/pages/coupon/myCoupon/index'
        })
    }
})