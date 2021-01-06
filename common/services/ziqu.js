class ZiQuCouponService {
  constructor() {
    this.data = {
      ziquCoupon:0,
      ziquAmount:0
    }
  }

  reset() {
    this.data = {
      ziquCoupon:0,
      ziquAmount:0
    }
  }

  set(ziquCoupon,ziquAmount) {
    this.data.ziquCoupon = ziquCoupon
    this.data.ziquAmount = ziquAmount
  }



  load() {
    return this.data
  }

  loadSync() {
    return this.data
  }
}

module.exports = ZiQuCouponService
