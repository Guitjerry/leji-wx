/**
 * @param piecewiseAgentFee { Object } - 配送费详细规则
 * @param total { Int } - 当前购物车总价
 * @return { Object } deliveryText: 当前价格对应的配送费文案, deliveryFee: 当前配送费
 * minimumOrderAmount 起送价
 */

export default function(piecewiseAgentFee, total) {
  if (Object.keys(piecewiseAgentFee).length === 0) {
    return {}
  }

  // 分段配送费逻辑
  const deliveryRules = piecewiseAgentFee.rules
  const isSectionPiecewise = deliveryRules.length > 1
  const totalInt = parseInt(total, 10)

  let deliveryText = ''
  let deliveryFee
  let minimumOrderAmount

  // 多段配送费的起送价为 0 ，配送费根据购物车价格来计算
  // 非多段配送费的起送价和配送费为数组的第一个 object 的值
  if (isSectionPiecewise) {
    minimumOrderAmount = 0
    deliveryFee = deliveryRules[0].fee
  } else {
    minimumOrderAmount = deliveryRules[0].price
    deliveryFee = deliveryRules[0].fee
    deliveryText = deliveryFee === 0 ? '免配送费' : `配送费&yen;${deliveryFee}`
  }

  // 购物车没东西时不做事情
  if (totalInt !== 0 && isSectionPiecewise) {
    // 购物车总价处于多段配送费中的当前阶段
    const currentPiecewise = deliveryRules.filter(rule => totalInt >= rule.price).pop()
    // 下一个阶段
    const nextPiecewise = deliveryRules.filter(rule => totalInt < rule.price).shift()
    // 是否到了最后一档,这个用来作为显示最终的配送费的根据
    const isLastPiecewise = deliveryRules.indexOf(nextPiecewise) === deliveryRules.length - 1
    deliveryFee = currentPiecewise.fee
    // 已经过了最后一档。显示最终配送费
    if (!nextPiecewise) {
      deliveryText = currentPiecewise.fee === 0 ? '免配送费' : `配送费&yen;${currentPiecewise.fee}`
    } else {
      const diffPrice = nextPiecewise.price - total
      const diffFee = currentPiecewise.fee - nextPiecewise.fee
      let diffFeedeliveryText = `减配送费&yen;${diffFee.toFixed(2)}`
      if (isLastPiecewise) {
        diffFeedeliveryText = nextPiecewise.fee === 0 ? '免配送费' : `配送费&yen;${nextPiecewise.fee}`
      }
      deliveryText = `再买&yen;${+diffPrice.toFixed(2)}${diffFeedeliveryText}`
    }
  }

  return {
    deliveryText,
    deliveryFee,
    minimumOrderAmount,
  }
}
