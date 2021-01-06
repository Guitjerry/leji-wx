const { ApiCreater } = getApp().services

module.exports = {
  smsCode: (data) => ApiCreater({
    url: '/web_api/v1/session/mobileCode',
    method: 'GET',
    data,
  }),
  login(data) {
    return ApiCreater({
      url: '/web_api/v1/session/wetchatLogin',
      method: 'POST',
      data,
    })
  },
  listHouse(){
    return ApiCreater({
      url: '/web_api/v1/session/listHouse',
      method: 'GET'
    })
  }

}
