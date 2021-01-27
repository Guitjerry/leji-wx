import { request } from "../../request/index.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidderAuthPhone:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPhoneNumber (e) {
      console.log(e.detail.errMsg)
      console.log(e.detail.iv)
      console.log(e.detail.encryptedData)
      //------执行Login---------
      wx.login({
        success: res => {
          console.log('code转换', res.code);

          //用code传给服务器调换session_key
          const  queryData = {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }
          if (e.detail.errMsg == 'getPhoneNumber:user deny') { //用户点击拒绝
            console.info('用户点击拒绝')
          } else { //允许授权执行跳转
            //获取用户信息
            request({url:"/session/wetchatGetPhone",data:queryData}).then(result => {
              wx.setStorageSync('USER', result.data)
              this.setData({
                user: result.data
              })
              this.setData({
                hidderAuthPhone: true
              })
              // 2 触发 父组件中的事件 自定义
              this.triggerEvent("getPhoneNumber");
            })

          }


        }
      });
    },
    closeMask() {
      this.setData({
        hidderAuthPhone: true
      })
    }
  }
})
