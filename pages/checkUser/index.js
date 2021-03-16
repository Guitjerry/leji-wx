// pages/user/index.js
import { request } from "../../request/index.js";

Page({
  data: {
    type: null,
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
    request({url:"/member/list",query}).then(result => {

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