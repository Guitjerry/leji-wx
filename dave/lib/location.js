// import ApiCreater from './ApiCreater'

const wxLocation = () => new Promise((resolve, reject) => {
  wx.getLocation({
    type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
    success: resolve,
    fail: reject,
  })
})

export default () => {
  return wxLocation()
    .then(response => {
      const { latitude, longitude } = response
      wx.setStorageSync('PLACE', { latitude, longitude })
      // return ApiCreater({
      //   url: `/bgs/poi/reverse_geo_coding?latitude=${latitude}&longitude=${longitude}`
      // })
      return response
    })
    // .then(response => {
    //   let { latitude, longitude } = response.data
    //   // 修复经纬度可能不为Number导致的报错
    //   if ((typeof latitude !== 'number') || (typeof longitude !== 'number')) {
    //     return Promise.reject(response)
    //   }
    //   wx.setStorageSync('PLACE', response.data)
    //   return response.data
    // })
}
