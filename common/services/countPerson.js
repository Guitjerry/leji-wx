class CountPersonService {
  constructor() {
    this.data = {
      countPersonRange: ['1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人', '10人以上']
    }
  }

  reset() {
    this.data = {
      countPersonRange: ['1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人', '10人以上']
    }
  }

  set(isCountPersonAvailable) {
    this.data.isCountPersonAvailable = isCountPersonAvailable
  }

  save(countIndex) {
    return this.data.countPerson = this.data.countPersonRange[countIndex]
  }

  load() {
    return this.data
  }

  loadSync() {
    return this.data
  }
}

module.exports = CountPersonService
