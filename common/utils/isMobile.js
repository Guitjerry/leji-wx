const isMobile = (mobilePhone) => {
  // const isMobile = /(^(13\d|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/
  const isMobile = /^1\d{10}$/
  return isMobile.test(mobilePhone)
}

module.exports.isMobile = isMobile
