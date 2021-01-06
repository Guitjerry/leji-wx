class DeliveryTime {
  constructor() {
    this.data = {}
  }

  reset() {
    this.data = {}
  }

  set(isFengniao, isOnTime, rawDeliveryTime, rawReachTime, rawDeliverTime) {
    /**
     * rawDeliveryTime: 指定送达时间
     * rawReachTime: 尽快送达时间
     * rawDeliverTime: 送达时间可选范围
     */
    this.data.isOnTime = isOnTime
    this.data.isFengniao = isFengniao
    this.data.deliveryTime = this.data.deliveryTime || rawDeliveryTime
    this.data.reachTime = rawReachTime
    this.select(this.data.deliveryTime)
    const timePoints = rawDeliverTime.length > 0 ? rawDeliverTime[0].time_points.map(deliveryTime => deliveryTime.time) : []
    this.data.deliveryTimesForPicker = ['尽快送达', ...timePoints]
  }

  select(deliveryTime) {
    if (deliveryTime) {
      this.data.deliveryTimeDescription = deliveryTime
      this.data.deliveryTime = deliveryTime
    } else {
      this.data.deliveryTimeDescription = `尽快送达 | 预计${this.data.reachTime}`
      this.data.deliveryTime = ''
    }
  }

  load() {
    return this.data
  }

  loadSync() {
    return this.data
  }
}

module.exports = DeliveryTime
