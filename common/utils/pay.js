const { ApiCreater } = require('../../dave/dave.min.js')

let wxPay = (params) => new Promise((resolve, reject) => {
  // Api 设置简直智障 https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html
  let { timeStamp, nonceStr, signType, paySign, packageStr } = params
  wx.requestPayment({
    'timeStamp': timeStamp,
    'nonceStr': nonceStr,
    'package': packageStr,
    'signType': signType,
    'paySign': paySign,
    'success':resolve,
    'fail':reject,
    // 'success': function (rs) {
    //   console.log(rs.errMsg)
    // },
    // 'fail': function (rs) {
    //   wx.navigateTo({
    //     url: 'pages/checkout/index/index'
    //   })
    // }
  })
  // wx.requestPayment(Object.assign(params, {
  //   success: resolve,
  //   fail: reject
  // }))
})
// /order/orders
// /mine/wallet
export default (orderId, token, type, isMain, spellId,isCartEmpty,shopId) => {
  return ApiCreater({
    url: `/web_api/v1/landing${type}/wechat/preOrderByJS?tradeNo=${orderId}`,
    method: 'POST',
    header: {
      'HTTP-ACCESS-TOKEN': token,
    },
  })
    .then(response => {
      let transInfo = response.data.result
      // let params = decodeURIComponent(transInfo.payData.WEIXIN_PAY).split('&')
      //
      // let paramObj = {}
      // params.forEach(item => {
      //   let keyVal = item.split('=')
      //   let [ key, value, valueExtra ] = keyVal
      //   if (keyVal.length === 2) {
      //     paramObj[key] = value
      //   } else {
      //     paramObj[key] = `${value}=${valueExtra}`
      //   }
      // })

      // package is a reserved word in strict mode. so... no package
      let { timeStamp, nonceStr, signType, paySign, packageStr } = transInfo

      return wxPay({ timeStamp, nonceStr, packageStr, signType, paySign })
        .then(
          function (num) {
            console.log("支付成功结果:======>"+num.errMsg)

            //支付成功后， 初始化订单转发次数到缓存中
             var oData=wx.getStorageSync('orderForward')
             console.log("获取缓存数据:======>" + oData)
             if (oData){
              oData[oData.length] = { 'orderId': orderId, 'num': 0};
              console.log("判断:======>" + oData)
              wx.setStorage({
                key: 'orderForward',
                data:oData
              })
            }else{
               console.log("判断:======>" + orderId)
              wx.setStorage({
                key: 'orderForward',
                data: [{ 'orderId': orderId, 'num': 0 }]
              })
            }
            //标记是否支付
            wx.setStorageSync('hasPay', true)
            //reLaunch    redirectTo
            var orderchild = orderId + '&isPay=1&isMain=' + isMain + '&spellId=' + spellId + '&isCartEmpty=' + true+'&shopId='+shopId;
            if (spellId !== undefined && !isMain) {
              wx.setStorageSync('spellId',spellId)
              setTimeout(function () {
                wx.switchTab({url: '/pages/order/list/order-list?isList=false&spellId='+ spellId})
              },1000)

            } else if (spellId && isMain) {
              wx.redirectTo({url: '/pages/checkout/mainMerge/orderSure/merge?orderChildId=' + orderchild+"&noCloseSocket=1"})
            }else if(!spellId){
              setTimeout(function () {
                // wx.switchTab({url: '/pages/order/list/order-list?isList=false&spellId='+ spellId})
                //查询订单是否是平台配送

                wx.navigateTo({url:'/pages/order/market/index?orderId='+orderId})

              },1000)
            }

            //根据orderId修改 order 状态。  并且修改 微信支付表 的 支付状态
          },
          function(num){
            //标记是否支付
            wx.setStorageSync('hasPay', false)
            console.log("支付失败结果:======>" + num.errMsg)
            //wx.switchTab({url: '/pages/shop/shop/index?id='+shopId})
            // if (spellId !== undefined && !isMain) {
            //   // wx.navigateTo({url: '/pages/checkout/merge/merge?orderChildId=' + orderId + '&isPay=0&isMain=' + isMain + '&spellId=' + spellId + '&isCartEmpty=' + true})
            //   wx.switchTab({url: '/pages/home/index'})
            // } else if (spellId && isMain) {
            //   wx.navigateTo({url: '/pages/checkout/mainMerge/merge?orderChildId=' + orderId + '&isPay=0&isMain=' + isMain + '&spellId=' + spellId + '&isCartEmpty=' + true+'&shopId='+shopId})
            // }
          }
          )
    })
}
