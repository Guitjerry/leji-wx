const Promise = require('../../libs/promise.js')
const API = require('../utils/api.js')

class RemarkService {
  constructor() {
    this.data = {
      remark: '', // user input part
      flattenRemarks: []
    }
  }

  reset() {
    this.data = {
      remark: '', // user input part
      flattenRemarks: []
    }
  }

  flatten(remarks) {
    var flattenRemarks = []
    remarks.forEach(remarkGroup => {
      switch (remarkGroup.length) {
        case 1:
          remarkGroup.forEach(remark => {
            flattenRemarks.push({
              class: 'single',
              text: remark
            })
          })
          break
        case 2:
          remarkGroup.forEach((remark, i) => {
            flattenRemarks.push({
              class: i === 0 ? 'left' : 'right',
              text: remark
            })
          })
          break
        default:
          remarkGroup.forEach((remark, i, arr) => {
            flattenRemarks.push({
              class: i === 0 ? 'left' : (i === arr.length - 1 ? 'right' : 'middle'),
              text: remark
            })
          })
      }
    })
    return flattenRemarks
  }

  toggleRemark(remark) {
    if (!remark.selected) {
      var index = this.data.flattenRemarks.indexOf(remark)
      var left = index, right = index
      while(['left', 'single'].indexOf(this.data.flattenRemarks[left].class) === -1 && left) left--
      while(['right', 'single'].indexOf(this.data.flattenRemarks[right].class) === -1 && right < this.data.flattenRemarks.length) right++
      while(left <= right) this.data.flattenRemarks[left++].selected = false
    }
    remark.selected = !remark.selected
  }

  setRemarkDescription() {
    this.data.remarksDescription = this.data.flattenRemarks
      .filter(flattenRemark => flattenRemark.selected)
      .map(flattenRemark => flattenRemark.text)
      .concat(this.data.remark).join(',')
  }

  save(remarkContent) {
    this.data.remark = remarkContent
  }

  load({cartId, sig}) {
    return new Promise((resolve, reject) => {
      API.getRemarks(cartId, sig)
      .then(res => {
        if (+res.statusCode === 200) {
          if (JSON.stringify(this.data.remarks) !== JSON.stringify(res.data.remarks)) {
            this.data.remarks = res.data.remarks
            this.data.flattenRemarks = this.flatten(this.data.remarks)
            this.setRemarkDescription()
          }
          resolve(this.data)
        } else {
          reject()
        }
      })
      .catch(() => {
        reject()
      })
    })
  }

  loadSync() {
    this.setRemarkDescription()
    return this.data
  }
}

module.exports = RemarkService
