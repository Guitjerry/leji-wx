/*
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉
  1 定义全局的定时器id
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goods:[],
    // 取消 按钮 是否显示
    isFocus:false,
    hidderAuthPhone: true,
    // 输入框的值
    inpValue:"",
    checked: false
  },
  TimeId:-1,
  onShow() {

  },
  // 输入框的值改变 就会触发的事件
  handleInput(e){
    const  _this = this
    const user = wx.getStorageSync('USER')
    request({ url: "/member/" + user.id })
        .then(result => {
          if (result.data && result.data.status === 1) {
            _this.setData({
              checked: true
            })
            // 1 获取输入框的值
            const {value}=e.detail;
            // 2 检测合法性
            if(!value.trim()){
              this.setData({
                goods:[],
                isFocus:false
              })
              // 值不合法
              return;
            }
            // 3 准备发送请求获取数据
            this.setData({
              isFocus:true
            })
            clearTimeout(this.TimeId);
            this.TimeId=setTimeout(() => {
              this.qsearch(value);
            }, 1000);
          }else {
            if(result.data.phone && result.data.status === 0) {
              wx.showToast({
                title: '很抱歉，您还未审核通过哦',
                icon: 'none'
              })
              return false
            }
            this.setData({
              hidderAuthPhone: false
            })
          }
        })
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query){
    await request({url:"/product/listByCategoryId",data:{keyword:query}}) .then(result => {
      console.log(result);
      this.setData({
        goods:result.data.list
      })
    });

  },
  getPhoneNumber (e) {
    wx.showToast({
      title: '申请已提交，请耐心等待审核结果',
      icon: 'none'
    })
    const user = wx.getStorageSync('USER')
    this.setData({
      user: user
    })

  },
  // 点击 取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  },
  toDetail(e) {
    const user = wx.getStorageSync('USER')
    let checked = false
    if(user && user.id) {
      request({ url: "/member/" + user.id })
          .then(result => {
            if(!result.data.phone) {
              this.setData({
                hidderAuthPhone: false
              })
              return false
            }
            if(result.data && result.data.status===1) {
              checked = true
            }
            if(!checked) {
              wx.showToast({
                title: '很抱歉，您还未审核通过哦',
                icon: 'none'
              })
              return false
            }
            if(checked) {
              const goodId = e.currentTarget.dataset.id
              wx.navigateTo({
                url:'/pages/goods_detail/index?goods_id=' + goodId
              })
            }
          })
    }
  }
})
