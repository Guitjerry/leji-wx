const shopStatus = require('../../services/i18n.js').shopStatus
const HashToUrl = getApp().services.HashToUrl

module.exports = {
  handleRow (list) {
    // list = list.map(item => {
    //   let element = null;
    //   if (item.restaurant) {
    //     element = item.restaurant
    //     element.foods = item.foods
    //     element.searched = true
    //   } else {
    //     element = item
    //   }
    //   if (element.distance >= 1000) {
    //     element.distance = (element.distance/1000).toFixed(2) + 'km'
    //   } else {
    //     element.distance = element.distance + 'm'
    //   }
    //
    //   element.image_url = HashToUrl(element.image_path, 120, 120)
    //
    //   element.support_safe = element.supports.filter(i => i.id === 7).length > 0
    //   element.support_ticket = element.supports.filter(i => i.id === 4).length > 0
    //   element.support_ontime = element.supports.filter(i => i.id === 9).length > 0
    //   element.statusText = shopStatus[element.status]
    //   const rules = element.piecewise_agent_fee.rules
    //   element.deliveryFeeText = rules.length > 1 ? `配送费约¥${rules[1].fee}` : `配送费¥${rules[0].fee}`
    //   element.miniumFeeText = `¥${rules[0].price}起送`
    //   return element
    // })
    return list
  }
}
