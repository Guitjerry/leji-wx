// pages/user/index.js
import { request } from "../../request/index.js";
const App = getApp()
const { API } = App.services;
Page({
  data: {
    type: null,
    members:[],
    tabs: [
      {
        id: 0,
        value: "待审核",
        isActive: true
      },
      {
        id: 1,
        value: "已审核",
        isActive: false
      }
    ]
  },
  queryMembers () {
    const query = {pageSize: 100, pageNum: 1}
    request({url:"/member/list",data: query}).then(result => {
        this.setData({
          members: result.data
        })
    })
  },
  checkedUser(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '信息提示',
      content: '确认审核通过吗?通过后将可以看到产品价格',
      success(res) {
        if (res.cancel) {

        }else {
          const data = {id, status:1}
          API.updateMember(data).then(res=> {
            if(res.data) {
              wx.showToast({
                title:'审核通过',
                icon: "none"
              })
            }
          })
        }
      }
    })
  },
  call(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber:phone,
      success:function () {
        console.log("拨打电话成功！")
      },
      fail:function () {
        console.log("拨打电话失败！")
      }
    })
  },
  onShow(){
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的type参数
    const { type } = currentPage.options;
    // 4 激活选中页面标题 当 type=1 index=0
    this.changeTitleByIndex(type-1);
    this.setData({
      type: type-1
    })
    this.queryMembers()
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    this.setData({
      type: index
    })
    this.changeTitleByIndex(index);
  }
})