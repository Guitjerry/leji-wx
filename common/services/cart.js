const Promise = require('../../libs/promise.js')
const Base64 = require('../../libs/base64.js')
const { Ubt, User } = require('../../dave/dave.min.js')
const Pay = require('../../common/utils/pay.js')
const API = require('../../common/utils/api.js')
const webCart = require('../../libs/web-cart.js').default

if (!wx.getStorageSync('NEW_CART_MAP')) {
  wx.removeStorageSync('CART_MAP')
  wx.setStorageSync('NEW_CART_MAP', true)
}
const AddressService = require('address.js')
const DeliveryTimeService = require('deliveryTime.js')
const PayMethodService = require('payMethod.js')
const CountPersonService = require('countPerson.js')
const InvoiceService = require('invoice.js')
const RemarkService = require('remark.js')
const HongbaoService = require('hongbao.js')

var pending = false
var promise

class CartService {
  constructor() {
    this.data = {}
    this.address = new AddressService()
    this.deliveryTime = new DeliveryTimeService()
    this.payMethod = new PayMethodService()
    this.hongbao = new HongbaoService()
    this.countPerson = new CountPersonService()
    this.invoice = new InvoiceService()
    this.remark = new RemarkService()
    // this.coupon = new CouponService()
  }

  reset() {
    this.data = {}
    this.address.reset()
    this.deliveryTime.reset()
    this.payMethod.reset()
    this.hongbao.reset()
    this.countPerson.reset()
    this.invoice.reset()
    this.remark.reset()
    // this.coupon.reset()
  }

  set(rawCart) {
    this.data = rawCart
  }

  pend() {
    if (pending) return promise
    return new Promise((resolve, reject) => resolve())
  }

  save(shopId, isMergingOrder, spellId) {
    wx.setStorage({
      key: 'CURRENT_RESTAURANT_ID',
      data: shopId
    })
    wx.setStorage({
      key: 'IS_MERGING_ORDER',
      data: isMergingOrder
    })
    wx.setStorage({
      key: 'CURRENT_MERGING_ORDER_ID',
      data: spellId
    })
  }
  getBasket() {
    // debugger
    return {
      // foods: this.data.result.entities[0],
      total:  this.data.total,
      type:this.data.type,//0折扣  1满减
      functionAllowance:this.data.functionAllowance,
      shopInfo:this.data.shopDto,
      foods: this.data.foods,
      paymentDeliveryAmount: this.data.paymentDeliveryAmount,
      additionalFee: this.data.additionalFee,
      additionalName: this.data.additionalName,
      myCoupon: this.data.myCoupon,
      bagAmount: this.data.bagAmount,
      shopAllowance: this.data.shopAllowance,
      platformAllowance: this.data.platformAllowance,
      totalAmount: this.data.totalAmount,
      totalWeight: this.data.totalWeight,
    }
  }

  getCheckoutForm() {
    let unionId = User.union_id
    let shopId = wx.getStorageSync('CURRENT_RESTAURANT_ID')
    let isMergingOrder = wx.getStorageSync('IS_MERGING_ORDER')
    let spellId = wx.getStorageSync('CURRENT_MERGING_ORDER_ID')
    let cart = new webCart(shopId)
    let foodEntities = [ cart.groups[0].entities ]
    foodEntities[0].forEach(entity => {
      // debugger
      entity.new_specs = entity.specs
      delete entity.specs
      delete entity.view_discount_price
      delete entity.view_original_price
    })
    console.log("validate foodEntities")
    // onShow每次都会触发checkout，包括已经下单成功后，已经下单成功后数据会被清空，不应该继续调用checkout
    if (!foodEntities || foodEntities.length === 0 || !foodEntities[0]) return null
    console.log("validate foodEntities valid")
    let place = wx.getStorageSync('PLACE')
    let deviceInfo = Base64.encode(`net_type:WIFI latitude:${place.latitude} longitude::${place.longitude}`)
    let selectGoods = []
    foodEntities[0].forEach(entity => {
      let attributes = new Array()
      if (Object.keys(entity.attrs).length>0) {
        for(var i in entity.attrs) {
          var a = {
            name: i,
            value: entity.attrs[i]
          }
          attributes.push(a)
        }
      }
      var specId
      if (!isNaN( entity.id)) {
        specId = entity.id
      } else {
        specId = parseInt(entity.id.split("-")[0])
      }
      var temp = {
        goodsId : entity.item_id,
        goodsSpecificationId : specId,
        goodsCount: entity.quantity,
        attributes: attributes
      }
      selectGoods.push(temp)
    })
    if (selectGoods.length === 0) {
      return null
    }
    let form = {
      shopId: shopId,
      userAddressId: this.address.loadSync().address ? this.address.loadSync().address.id : 0,
      remark: this.remark.loadSync().remarksDescription || '',
      entities: foodEntities,
      deliver_time: this.deliveryTime.loadSync().deliveryTime ? this.deliveryTime.loadSync().deliveryTime : '',
      paymethod_id: this.payMethod.loadSync().payMethod ? this.payMethod.loadSync().payMethod.id : 1,
      orderBookingType: 0,
      isNeedInvoices: Number(isMergingOrder),/* 拼单 是 1 否  0 */
      spellId: spellId,/* 拼单ID */
      selectGoods: selectGoods
    }
    // debugger
    return form
  }

  clearRestaurantCache() {
    let cartMap = wx.getStorageSync('CART_MAP')
    let cartMapSTR = JSON.parse(cartMap)
    let currentRestaurantID = wx.getStorageSync('CURRENT_RESTAURANT_ID')
    let isMergingOrder = wx.getStorageSync('IS_MERGING_ORDER')
    let spellId = wx.getStorageSync('CURRENT_MERGING_ORDER_ID')
    let currentRestaurantIDStr = currentRestaurantID+''
    if (cartMapSTR[currentRestaurantIDStr]) {
      delete cartMapSTR[currentRestaurantID]
    }
    wx.setStorage({
      key: 'CART_MAP',
      data: JSON.stringify(cartMapSTR)
    })

    let pages = getCurrentPages();
    let prevPage = pages[ pages.length - 2 ];
    prevPage.initCart();

  }

  setOrderValidationCache(rawData) {
    wx.setStorage({
      key: 'validation_token',
      data: rawData.validation_token
    })
    wx.setStorage({
      key: 'validation_type',
      data: rawData.validation_type
    })
    wx.setStorage({
      key: 'validation_phone',
      data: rawData.validation_phone
    })
  }

  loadOrderValidationCache() {
    return {
      validation_token: wx.getStorageSync('validation_token'),
      validation_type: wx.getStorageSync('validation_type'),
      validation_phone: wx.getStorageSync('validation_phone')
    }
  }

  clearOrderValidationCache() {
    wx.removeStorage({ key: 'validation_token' })
    wx.removeStorage({ key: 'validation_type' })
    wx.removeStorage({ key: 'validation_phone' })
  }

  // load entities from storage
  // request API for more info
  checkout({ SID,deliveryType,defaultAddress,shopType,navigateGoodId,isHotTime,isGoUpstairs,dayType,dinnerType,deliveryFee,isHotelOnline,platformCouponDataId,shopCouponDataId } = {}) {
    console.log("pending->"+pending);
    if (pending) return promise
    // wx.showToast({ icon: 'loading', title: '正在更新订单', duration: Infinity })
    pending = true
    promise = new Promise((resolve, reject) => {
      let checkoutData = {};
      if (shopType === "dorm") {
        checkoutData = wx.getStorageSync('checkoutData');
      } else {
        checkoutData = this.getCheckoutForm();
      }
      console.log('checkoutData->'+JSON.stringify(checkoutData))
      if (!checkoutData) {
        pending = false
        reject()
        return
      }
      // pending = false
      // this.set(checkoutData)
      // wx.hideToast()
      // resolve()
      if(deliveryType>=0){
        checkoutData.deliveryType = deliveryType
      }
      if(defaultAddress){
        checkoutData.userAddressId = defaultAddress.id
      }
      if(navigateGoodId){
        checkoutData.navigateGoodId=navigateGoodId
      }
      // debugger
      if(isHotTime){
        checkoutData.isHotTime=isHotTime
      }
      if(isGoUpstairs){
        checkoutData.isGoUpstairs=isGoUpstairs
      }
      if(dayType){
        checkoutData.dayType=dayType
      }
      if(dinnerType){
        checkoutData.dinnerType=dinnerType
      }
      //初始为0
      checkoutData.deliveryFee=deliveryFee
      //初始为0
      checkoutData.isHotelOnline=isHotelOnline
      checkoutData.shopCouponDataId = shopCouponDataId
      checkoutData.platformCouponDataId = platformCouponDataId
      API.checkout(checkoutData)
      .then(res => {
        console.log('checkout->'+JSON.stringify(res.data))
        if (res.data.status === 'success') {
          var rawData = res.data.result
          pending = false
          wx.hideToast()
          this.set(rawData)
          resolve()
          // this.deliveryTime.set(rawData.cart.is_deliver_by_fengniao, rawData.cart.is_ontime_available, rawData.cart.deliver_time, rawData.delivery_reach_time, rawData.deliver_times)
          // this.payMethod.set(1)
          // this.hongbao.set(rawData.hongbao_info, rawData.cart.extra)
          // this.coupon.set(rawData.is_support_coupon, rawData.merchant_coupon_info)
          // this.countPerson.set(rawData.number_of_meals)
          // this.invoice.set(rawData.invoice)
          // remark service do not need reset

        } else {

          if (res.data.errorMsg==="订单不够起送价"){
            wx.showModal({
              content: res.data.errorMsg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateBack(1);
                  //wx.redirectTo({ 'url': "/pages/shop/shop/index?id={{item.retailerId}}" })
                  //wx.redirectTo({'url':'/packageA/pages/address/address'})
                }
              }
            })
          } else if (res.data.errorMsg==="对不起， 您的订单已超出配送距离"){
            wx.showModal({
              content: res.data.errorMsg,
              cancelText:"返回店铺",
              confirmText:"修改地址",
              success: function (res) {
                console.log(res)
                if (res.confirm) {
                  wx.navigateTo({'url':'/packageA/pages/address/address'})
                }else{
                  wx.navigateBack(1);
                }
              }
            })
          } else if (
            res.data.errorMsg.indexOf("商品未上架")>-1
            || res.data.errorMsg.indexOf("商品刚已下架")>-1
            || res.data.errorMsg.indexOf("商品刚已售罄")>-1){
            wx.showModal({
              content: res.data.errorMsg,
              cancelText:"返回店铺",
              confirmText:"重新下单",
              success: function (res) {
                console.log(res)
                if (res.confirm) {
                  wx.navigateBack(1);
                }else{
                  wx.navigateBack(1);
                }
              }
            })
          }

          pending = false
          wx.hideToast()
          resolve()
        }
      }).catch(res=> {
        if (res.statusCode === 401) {
          API.reLogin();
        }
        pending = false
        wx.hideToast()
        reject()
      })
      // .catch(res => {
      //   if (res.data.name === 'SERVER_UNKNOWN_ERROR') {
      //     return
      //   }
      //   wx.showModal({
      //     title: res.data.message || '服务器饿晕了，请您稍后再试',
      //     content: '',
      //     showCancel: false,
      //     success: wx.navigateBack,
      //   })

      // })
    })
    return promise
  }
  // SID, code, token,
  makeOrder({ userId,isHotTime,isHotelManagerOK, token, mobile, deliverySelf, pickTime, addressId, shopType, isHotelOnline, dayType, dinnerType, deliveryFee } = {}) {
    // debugger
    if (pending) return promise
    pending = true
    wx.showToast({ icon: 'loading', title: '正在提交订单', duration: Infinity })

    let postData = {};
    if (shopType === "dorm") {
      postData = wx.getStorageSync('checkoutData');
    } else {
      postData = this.getCheckoutForm();
    }

    if (!postData) {
      pending = false
      reject()
      return
    }
    // if (code && token) {
    //   postData.validation_token = token
    //   postData.validation_code = code
    // }

    postData.cartId = this.data.id
    postData.deliverySelf = deliverySelf
    postData.mobile = mobile
    postData.pickTime = pickTime
    postData.userId = userId
    postData.isHotTime = isHotTime
    postData.isHotelManagerOK = isHotelManagerOK
    postData.isHotelOnline = isHotelOnline
    postData.dayType = dayType
    postData.dinnerType = dinnerType
    postData.deliveryFee = deliveryFee
    if(addressId){
      postData.userAddressId=addressId
    }
    return new Promise((resolve, reject) => {
      // 文档
      // https://github.com/eleme/zero/blob/a2912caaa9a3c781e0cb9408c91acb702a560fe4/docs/order.md
      postData.vaildSex=1
      API.makeOrder(postData)
        .then(res => {
          debugger
          if (+res.statusCode === 200) {
            if (res.data.status === 'success') {
              var rawData = res.data.result
              if (rawData === "0") {//送上楼的配送员繁忙
                wx.showModal({
                  title: '提示',
                  content: '人员紧张，当前无法立即配送上楼，请选择其它配送方式，敬请谅解！',
                  showCancel: false,
                  confirmColor: '#d8110a',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定');
                      return 0;
                    }
                  }
                });
                return;
              }


              wx.showToast({
                title: '唤起支付中',
                icon: 'loading',
                duration: 10000
              })
              let orderDetailRoute = `/pages/order/detail/order-detail?id=${rawData}`
              // with unique_id, the order is accepted

              Pay.default(rawData, User.data.token, '/order/orders')
                .then(() => {
                  this.reset()
                  this.clearRestaurantCache()
                  this.clearOrderValidationCache()
                  pending = false
                  wx.redirectTo({ url: orderDetailRoute })

                })
                .catch(() => wx.redirectTo({

                  url: orderDetailRoute
                }))

              wx.hideToast()
              resolve()
            } else {
              var showCancel = res.data.errorMsg.substr(0,2)=="当前"?true:false
              wx.showModal({
                content: res.data.errorMsg,
                showCancel: true,
                success: function (res) {
                  if (res.confirm) {
                    if(showCancel){
                      postData.vaildSex=0
                      API.makeOrder(postData)
                        .then(res => {
                          if (res.data.status === 'success') {
                            var rawData = res.data.result
                            wx.showToast({
                              title: '唤起支付中',
                              icon: 'loading',
                              duration: 10000
                            })
                            let orderDetailRoute = `/pages/order/detail/order-detail?id=${rawData}`
                            // with unique_id, the order is accepted

                            Pay.default(rawData, User.data.token, '/order/orders')
                              .then(() => {
                                this.reset()
                                this.clearRestaurantCache()
                                this.clearOrderValidationCache()
                                pending = false
                                wx.redirectTo({ url: orderDetailRoute })

                              })
                              .catch(() => wx.redirectTo({

                                url: orderDetailRoute
                              }))

                            wx.hideToast()
                            resolve()
                          }
                        })
                    }
                    console.log('用户点击确定')
                  }
                }
              })
              pending = false
              wx.hideToast()
              reject()
            }
          } else if (+res.statusCode === 401) {
            pending = false
            API.reLogin();
            wx.hideToast()
            reject()
            return
          }

          pending = false
          wx.hideToast()
          resolve()
        })
        .catch((res) => {
          var rawData = res.data
          if ((/INVALID_CART/).test(rawData.name)) {
            rawData.message = '购物车已失效，请到订单中心确认是否已经成功下单'
          }
          wx.showModal({
            title: '',
            content: rawData.message,
            showCancel: false,
            confirmColor: '#0097FF',
            success: () => {
              switch (rawData.name) {
                case 'INVALID_VALIDATE_CODE':
                  let { validation_token, validation_type, validation_phone } = this.loadOrderValidationCache()
                  wx.redirectTo({
                    url: `/pages/auth/perfect/index?cartId=${this.data.id}&sig=${this.data.sig}&phone=${validation_phone}&token=${validation_token}&type=${validation_type}&successUrl=/pages/checkout/index/index`
                  })
                  break
                case 'RESTAURANT_UNAVAILABLE':
                  wx.navigateBack({ delta: 2 })
                  break
                case 'EMPTY_CART':
                case 'LESS_THAN_DELIVER_AMOUNT':
                  wx.navigateBack({ delta: 1 })
                  break
                default:
                  wx.redirectTo({ 'url': '/pages/order/list/order-list' })
              }
            }
          })
          pending = false
          wx.hideToast()
          reject()
        }).finally(() => {
          pending = false
        })
    })
  }
  makeOrderTogether({ userId, token, mobile, deliverySelf, pickTime, spellId, isMain, isCartEmpty, shopId } = {}) {
    if (pending) return promise
    pending = true
    wx.showToast({ icon: 'loading', title: '正在提交订单', duration: Infinity })
    let postData = this.getCheckoutForm()
    if (!postData) {
      pending = false
      reject()
      return
    }
    // if (code && token) {
    //   postData.validation_token = token
    //   postData.validation_code = code
    // }

    postData.cartId = this.data.id
    postData.deliverySelf = deliverySelf
    postData.mobile = mobile
    postData.pickTime = pickTime
    postData.userId = userId

    return new Promise((resolve, reject) => {
      // 文档
      // https://github.com/eleme/zero/blob/a2912caaa9a3c781e0cb9408c91acb702a560fe4/docs/order.md
      API.makeOrderTogether(postData)
        .then(res => {
          if (+res.statusCode === 200) {
            if (res.data.status === 'success') {
              var rawData = res.data.result
              wx.showToast({
                title: '唤起支付中',
                icon: 'loading',
                duration: 10000
              })
              var orderDetailRoute = `/pages/checkout/merge/merge?orderChildId=${rawData}`
              console.info("ismain的值...."+isMain);

              if(isMain==true){
                orderDetailRoute =   `/pages/checkout/mainMerge/merge?orderChildId=${rawData}`
              }
              // with unique_id, the order is accepted
              Pay.default(rawData, User.data.token, '/spelluser/orders', isMain,spellId,isCartEmpty,shopId)
                .then((res) => {
                  var  hasPay = wx.getStorageSync("hasPay")
                  if(hasPay){
                    this.reset()
                    this.clearRestaurantCache()
                    this.clearOrderValidationCache()
                  }
                  wx.removeStorageSync("hasPay")
                  pending = false
                })
              wx.hideToast()
              resolve()
            } else {
              wx.showModal({
                content: res.data.errorMsg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
              pending = false
              wx.hideToast()
              reject()
            }
          } else if (+res.statusCode === 401) {
            pending = false
            API.reLogin();
            wx.hideToast()
            reject()
            return
          }

          pending = false
          wx.hideToast()
          resolve()
        })
        .catch((res) => {
          var rawData = res.data
          if ((/INVALID_CART/).test(rawData.name)) {
            rawData.message = '购物车已失效，请到订单中心确认是否已经成功下单'
          }
          wx.showModal({
            title: '',
            content: rawData.message,
            showCancel: false,
            confirmColor: '#0097FF',
            success: () => {
              switch (rawData.name) {
                case 'INVALID_VALIDATE_CODE':
                  let { validation_token, validation_type, validation_phone } = this.loadOrderValidationCache()
                  wx.redirectTo({
                    url: `/pages/auth/perfect/index?cartId=${this.data.id}&sig=${this.data.sig}&phone=${validation_phone}&token=${validation_token}&type=${validation_type}&successUrl=/pages/checkout/index/index`
                  })
                  break
                case 'RESTAURANT_UNAVAILABLE':
                  wx.navigateBack({ delta: 2 })
                  break
                case 'EMPTY_CART':
                case 'LESS_THAN_DELIVER_AMOUNT':
                  wx.navigateBack({ delta: 1 })
                  break
                default:
                  wx.redirectTo({ 'url': '/pages/order/list/order-list' })
              }
            }
          })
          pending = false
          wx.hideToast()
          reject()
        }).finally(() => {
          pending = false
        })
    })
  }


  loadAddress(token) {
    if (token) {
      return promise.then(() => {
        return this.address.load4Checkout({
          shopId: this.data.shopId,
          token
        })
      })
    } else {
      return promise.then(() => {
        return this.address.loadSync()
      })
    }
  }

  loadHongbao(SID) {
    return this.hongbao.load4Cart({
      cartId: this.data.id,
      sig: this.data.sig,
      SID
    })
  }

  loadRemarks() {
    return this.remark.load({
      sig: this.data.sig,
      cartId: this.data.id
    })
  }

  selectPayMethod(method) {
    if (method.select_state === 0) {
      // TODO: request API
      this.payMethod.select(method)
    }
  }
}

module.exports = CartService
