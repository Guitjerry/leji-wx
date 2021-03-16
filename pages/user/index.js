// pages/user/index.js
import {request} from "../../request/index";

Page({
  data: {
    userinfo:{},
    isShopAdmin: false,
    // 被收藏的商品的数量
    collectNums:0
  },
  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
    const collect=wx.getStorageSync("collect")||[];
    const user=wx.getStorageSync("USER");

    this.setData({userinfo,collectNums:collect.length});
    const _this = this
    request({ url: "/member/" + user.id })
        .then(result => {
          if (result.data && result.data.position === 1) {
            _this.setData({
              isShopAdmin: true
            })
          }
        })
  },
  toCheckUser() {
    wx.navigateTo({'url':'/pages/checkUser/index?type=1'})
  }
})