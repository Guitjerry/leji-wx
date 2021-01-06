const imageHash = require('../../../common/utils/image-hash.js')

const app = getApp()
const { Ubt, Promise, API, User } = getApp().services
let redirectUrl

module.exports = {
  data: {
    imageHash,
    tags: [
      '无',
      '家',
      '学校',
      '公司'
    ],
    schoolName:'',
    hotelName:''
  },
  onLoad({ redirect_url }) {
    redirectUrl = redirect_url
    wx.removeStorage({
      key: 'TEMPORARY_SELECTED_DELIVER_ADDRESS'
    })
  },
  onShow() {
    if(!this.data.address.address){
      wx.getStorage({
        key: 'TEMPORARY_SELECTED_DELIVER_ADDRESS',
        success: (res) => {
          let newAddress = res.data
          this.setData({
            address: app.extend([newAddress, this.data.address])
          })
        }
      })
    }

    API.listSchool().then(res=>{
      if(res.data.result){
        this.setData({
          schools: res.data.result
        })
      }
    })


  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  goToSelectAddress() {
    API.listSchool().then(res=>{
      if(res.data.result){
        this.setData({
          schools: res.data.result
        })
      }
    })
    this.setData({
      showModalStatus:true
    })
    this.showModal()
    // wx.navigateTo({
    //   url: '/pages/location/location'
    // })
  },
  
  selectTag(e) {
    if (e.detail.value === 'null') return
    this.setData({
      address: app.extend([{
        tag_type: +e.detail.value,
        tag: this.data.tags[+e.detail.value]
      }, this.data.address])
    })
  },
  setGenderMale() {
    this.setData(app.extend([{
      address: {
        gender: 1
      }
    }, this.data]))
  },
  setGenderFemale() {
    this.setData(app.extend([{
      address: {
        gender: 2
      }
    }, this.data]))
  },
  onNameInput(e) {
    this.data.address.name = e.detail.value
  },
  onPhoneInput(e) {
    this.data.address.mobile = e.detail.value
  },
  onIsDefaultInput(e) {
    debugger
    var defVal = 0;
    if (e.detail.value){
       defVal = 1
    }
    this.data.address.isDefault = defVal
  },
  onAddressDetailChange({ detail }) {
    this.data.address.houseNumber = detail.value
  },
  redirect() {
    if (redirectUrl) {
      wx.redirectTo({
        url: redirectUrl
      })
      return true
    }
  }
}
