class PayMethod {
  constructor() {
    this.data = {}
  }

  reset() {
    this.data = {}
  }

  set(rawPayMethods) {
    this.data.payMethods = rawPayMethods
    this.data.payMethod = this.data.payMethods.find(payMethod => payMethod.select_state === 1)
  }

  select(payMethod) {
    this.data.payMethod = payMethod
  }

  load() {
    return this.data
  }

  loadSync() {
    return this.data
  }
}

module.exports = PayMethod
