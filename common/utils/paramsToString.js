module.exports = function (params) {
  let parts = []
  Object.keys(params).forEach(key => {
    let value = params[key]
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  })
  return parts.join('&')
}
