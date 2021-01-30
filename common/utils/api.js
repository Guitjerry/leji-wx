const { crayfish4weapp } = require('../services/hosts')
const { User, ApiCreater } = require('../../dave/dave.min.js')

let cookie = ''
const getCookieString = response => {
  let header = response.data['set-cookie']
  if (Array.isArray(header)) {
    header = header.join(' ')
  }
  return header
}

const setCookie = response => {
  let body = JSON.parse(response.data.body)
  let newCookie = (getCookieString(response).match(/eleme__ele_me=([^;]+)/) || [])[1] || ''
  if (newCookie) {
    cookie = newCookie
  }
  response.data = body
  return response
}


let APIS = {
  /**
   * 根据商品分类获取商品列表
   */
  listProductBycategoryId: (data) => {
    return ApiCreater({
      url: '/product/listByCategoryId',
      header: {
        'Authorization': "Bearer " + wx.getStorageSync("USER").token
      },
      method: 'GET',
      data
    })
  },

  /**
   * 加载商品分类列表
   * @param data
   * @returns {*}
   */
  listproductCategory: (data) => {
    return ApiCreater({
      url: '/productCategory/list/withChildren',
      header: {
        'Authorization': "Bearer " + wx.getStorageSync("USER").token
      },
      method: 'GET'
    })
  },

  /**
   * 生成订单
   */
  createOrder: (data) => {
    debugger
    return ApiCreater({
      url: '/Order/saveOrder',
      header: {
        'Authorization': "Bearer " + wx.getStorageSync("USER").token
      },
      method: 'POST',
      data
    })
  },
  /**
   * 生成订单
   */
  queryDiscount: (data) => {
    return ApiCreater({
      url: '/product/queryDiscount',
      header: {
        'Authorization': "Bearer " + wx.getStorageSync("USER").token
      },
      method: 'POST',
      data
    })
  },

};

module.exports = APIS;
