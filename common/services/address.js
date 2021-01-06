const Promise = require('../../libs/promise.js')
const API = require('../../common/utils/api.js')

var pending = false
var promise

class AddressService {
  constructor() {
    this.data = {}
  }

  reset() {
    this.data = {}
    pending = false
    promise = undefined
  }

  set(rawAddress) {
    this.select(rawAddress)
  }

  select(address) {
    this.data.address = address
  }

  edit(address) {
    this.data.editingAddress = address
  }

  add(userService, address) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (!this.validate(address)) {
        reject()
        return
      }

      // address.poi_type = 0

      API.createAddress(address)
      .then(res => {
        address.id = res.data.result;
        that.data.addresses.push(address)
        if (that.data.addresses.length === 1) {
          that.data.address = address
        }
        resolve()
      })
      .catch(res => {
        wx.showModal({ title: res.data.message, content: '', showCancel: false, confirmColor: '#0097ff' })
        reject()
      })
    })
  }

  remove(userService, address) {
    return new Promise((resolve, reject) => {
      API.deleteAddress(address.id)
      .then(res => {
        if (res.data.status === 'success') {
          resolve()
        } else {
          reject()
        }
      })
      .catch(res => {
        reject()
      })
    })
  }

  update(userService, editingAddress) {
    // 更新的时候会报错缺少geohash
    // editingAddress.geohash = editingAddress.st_geohash

    return new Promise((resolve, reject) => {
      if (!this.validate(editingAddress)) {
        reject()
        return
      }

      // editingAddress.poi_type = 0

      API.updateAddress(editingAddress)
      .then(res => {
        if (res.data.status === 'success') {
          resolve()
        } else {
          wx.showModal({ title: '温馨提示', content: res.data.errorMsg, showCancel: false, confirmColor: '#0097ff' })
          reject()
        }
      })
      .catch(err => {
        reject()
      })
    })
  }

  validate(address) {
    var result = address.name && address.mobile && address.address && address.houseNumber && /^1[2-9]\d{9}$/.test(address.mobile)
    if (!result) this.validateMsg(address)
    return result
  }

  validateMsg(address) {
    if (!address.name) wx.showModal({ title: '请填写联系人', content: '', showCancel: false, confirmColor: '#d8110a' })
    else if (!address.mobile) wx.showModal({ title: '请填写联系电话', content: '', showCancel: false, confirmColor: '#d8110a' })
    else if (!/^1[2-9]\d{9}$/.test(address.mobile)) wx.showModal({ title: '请检查手机号码格式是否有误', content: '', showCancel: false, confirmColor: '#d8110a' })
    else if (!address.address || !address.houseNumber) wx.showModal({ title: '请填写详细地址', content: '', showCancel: false, confirmColor: '#d8110a' })
  }

  equal(one, another) {
    return one && another && one.id === another.id
  }

  load({token} = {}) {
    if (pending) return promise
    pending = true
    promise = new Promise((resolve, reject) => {
      if (token) {
        API.getAddressList()
        .then(res => {
          if (res.data.status === 'success') {
            this.data.addresses = res.data.result
            resolve(this.data)
          } else {
            wx.showModal({
              content: res.data.errorMsg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
            reject()
          }
          pending = false
        })
        .catch((res) => {
          if (+res.statusCode === 404 || +res.statusCode === 401) {
             API.reLogin();
          }
          pending = false
          reject()
        })
      } else {
        pending = false
        reject()
      }
    })

    return promise
  }

  load4Checkout({shopId} = {}) {
    if (pending) return promise
    pending = true

    promise = new Promise((resolve, reject) => {
      if (shopId) {
        API.getAddressesForCart(shopId)
        .then(res => {

          if (+res.statusCode === 200) {
            this.data.addresses = res.data.result
            this.data.availableAddresses = []
            this.data.unavailableAddresses = []
            this.data.addresses.forEach(address => {
              if (address._deliverable) this.data.availableAddresses.push(address)
              else this.data.unavailableAddresses.push(address)
            })
            if (this.data.address) {
              this.data.address = this.data.addresses.find(address => this.data.address.id === address.id && address.is_deliverable)
            } else {
              this.data.address = this.data.addresses.find(address => address._deliverable)
            }
            if (this.data.availableAddresses.length === 1) this.data.address = this.data.availableAddresses[0]
            resolve(this.data)
          } else {
            if (+res.statusCode === 404 || +res.statusCode === 401) {
              API.reLogin();
            }
            reject()
          }
          pending = false
        })
        .catch(res => {
          if (+res.statusCode === 404 || +res.statusCode === 401) {
            API.reLogin();
          }
          pending = false
          reject()
        })
      } else {
        pending = false
        reject()
      }
    })

    return promise
  }

  loadSync() {

    return this.data
  }
}

module.exports = AddressService
