const Promise = require('../../libs/promise.js')
const API = require('../utils/api.js')

const parseAmount = hongbao => {
  hongbao.amountBody = ('' + hongbao.amount).split('.')[0],
  hongbao.amountTail = ('' + hongbao.amount).split('.').length > 1 ? ('' + hongbao.amount).split('.')[1] : '0'
}

class HongbaoService {
  constructor() {
    this.data = {}
  }

  reset() {
    this.data = {}
  }

  set(rawData, cartExtra) {
    this.data.hongbao = cartExtra.hongbao ? cartExtra.hongbao : undefined
    this.data.sn = rawData.hongbao_sn ? rawData.hongbao_sn : undefined
    this.data.hongbaoStatus = rawData.status
    this.data.hongbaoStatusText = rawData.status_text
    this.data.validHongbaoCount = rawData.available_count
  }

  select(hongbaoSerialNumber) {
    if (hongbaoSerialNumber) {
      this.data.sn = hongbaoSerialNumber
      this.data.notUse = false
    } else {
      this.data.sn = ''
      this.data.notUse = true
    }
  }

  load({ userId, SID }) {
    return new Promise((resolve, reject) => {
      API.getHongbaos()
      .then(res => {
        if (+res.statusCode === 200) {
          res.data.forEach(hongbao => parseAmount(hongbao))
          this.data.hongbaos = res.data
          resolve(this.data)
        } else {
          reject()
        }
      })
      .catch(res => {
        reject()
      })
    })
  }

  load4Cart({ cartId, sig, SID }) {
    return new Promise((resolve, reject) => {
      API.getHongbaosForCart(cartId, {
        sig
      })
      .then(res => {
        if (+res.statusCode === 200) {
          res.data.valid_hongbao.forEach(hongbao => {
            parseAmount(hongbao)
            hongbao.isValid = true
            hongbao.selectable = true
          })
          res.data.unvalid_hongbao.forEach(hongbao => {
            parseAmount(hongbao)
            hongbao.isInvalid = true
          })
          this.data.hongbaos = [].concat(res.data.valid_hongbao).concat(res.data.unvalid_hongbao).filter(hongbao => hongbao.sn)
          resolve(this.data)
        } else {
          reject()
        }
      })
      .catch(res => {
        reject()
      })
    })
  }

  loadSync() {
    return this.data
  }
}

module.exports = HongbaoService
