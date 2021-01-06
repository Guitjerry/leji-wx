const Promise = require('../../libs/promise.js')

/**
 * 改进微信的获取用户信息接口，返回 Promise
 */
const weixinUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        resolve(res.userInfo)
      },

      fail() {
        reject({ name: 'weixin_authorize_failed' })
      },
    })
  })
}

module.exports = weixinUserInfo
