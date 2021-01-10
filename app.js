// services
import touch from "./common/services/touch";

const Host = require('common/services/hosts')
const Dave = require('dave/dave.min.js')

Dave.config({
  apiHost: Host.apiHost,
  fussHost: Host.fuss10,
})
const { User, Pay, ApiCreater, Ubt, HashToUrl } = Dave
const CartService = require('common/services/cart.js')
const setSceneAndQrcodeForUbt = (options) => {
  // 用来方便线上看到 log 信息
  console.log('------- Set scene and qrcode -----------')
  console.log(options)
  // 从报错中看到 options 可能为空，但不知道什么情况下会这样。所以这里判断一次
  if (!options) {
    return
  }
  // 存储场景值和二维码参数，Ubt 每次发送 PV 的时候都需要带上这两个参数
  let qrcode = options.query.qrcode
  if (qrcode) {
    wx.setStorageSync('qrcode', qrcode)
    Ubt.from = qrcode
  }
  let scene = options.scene
  wx.setStorageSync('scene', scene)
  Ubt.scene = scene
}

// 引入 polyfill
Object.assign = Object.assign || require('./libs/object-assign')

App({
  globalData:{},
  extend(objs, overwrite = false) {
    var newbee = {}
    objs.forEach(obj => {
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (newbee.hasOwnProperty(i) && !overwrite) {
            if ( typeof newbee[i] === 'object'
                && typeof obj[i] === 'object') {
              if (Object.prototype.toString.call(obj[i]) !== '[object Array]'
                  && Object.prototype.toString.call(newbee[i]) !== '[object Array]') {
                newbee[i] = this.extend([newbee[i], obj[i]])
              }
            } else if ( typeof newbee[i] === 'function'
                && typeof obj[i] === 'function'
                && ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom'].indexOf(i) > -1) {
              var last = newbee[i]
              newbee[i] = function (options) {
                last.call(this, options)
                obj[i].call(this, options)
              }
            }
          } else {
            newbee[i] = obj[i]
          }
        }
      }
    })
    return newbee
  },
  overwrite(target, objs) {
    objs.forEach(obj => {
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          target[i] = obj[i]
        }
      }
    })
    return target
  },

  checkSession() {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: resolve,
        fail: reject,
      })
    })
  },

  onLaunch(options) {
    var _this=this
    var user = wx.getStorageSync('USER')
    console.info('用户信息...'+user)
    let wechatCode="";
    wx.login({
      success: function (res) {
        if (res.code) {
          _this.userLogin(res.code);
          // wechatCode = res.code
        } else {
          wx.showToast({ title: '请允许打开您的微信授权，否则无法正常' })
        }
      }
    })
    // this.userLogin(wechatCode);
    setSceneAndQrcodeForUbt(options)
    // 没有用户信息。尝试登录
    // if (!User.id) User.login()
    // 在每次 launch 的时候 checkSession 来确保现在用户的登录状态始终是 ok 的
    this.checkSession()
    // .catch(User.login)
  },
  userLogin(wechatCode){
    var _this=this
    _this.loginApi({ wechatCode: wechatCode})
        .then(res => {
          if (res.data.code === 200) {
            wx.setStorageSync('USER', res.data.data)
            User.loadSync()
          }else {
            wx.showModal({
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          }
        })
        .catch(res => {
          wx.showModal({
            title: '出错了',
            content: '' + res.message,
          })
          // this.alertModal(res.data.message)
          // wx.hideToast()
          // this.setData({ authing: false })
        })
  },

  successRedirect(uid){

  },

  loginApi(data) {
    return ApiCreater({
      url: '/session/wetchatLogin',
      method: 'POST',
      data,
    })
  },

  onShow(options) {
    setSceneAndQrcodeForUbt(options)
  },

  services: {
    User, Ubt, Pay, ApiCreater, HashToUrl,
    Cart: new CartService(),
    // libs 和 utils 没区别？
    touch:new touch(),
    SOCKET: require('./libs/socket.js'),
    Geohash: require('./common/utils/geohash.js'),
    Promise: require('./libs/promise.js'),
    imageHash: require('./common/utils/image-hash.js'),
    paramsToString: require('./common/utils/paramsToString.js'),
    webCart: require('./libs/web-cart.js').default,
    Base64: require('./libs/base64.js'),
    API: require('./common/utils/api.js'),
    weixinUserInfo: require('./common/services/weixinUserInfo.js'),
  },
})
