module.exports = {
  data: {
    //筛选方式标志位
    showSort: false,
    //排序数据
    sortData: {
      selected: 0,
      selectedName: '智能排序',
      list: [
        {
          name: '智能排序',
          id: 0
        }, {
          name: '起送价最低',
          id: 1
        }, {
          name: '配送速度最快',
          id: 2
        }, {
          name: '评分最高',
          id: 4
        }, {
          name: '距离最近',
          id: 5
        }, {
          name: '销量最高',
          id: 6
        }, {
          name: '人气排序',
          id: 7
        }
      ]
    }
  },
  //是否显示排序
  toggleSort() {
    this.setData({
      showFilter: false,
      showSort: !this.data.showSort,
      showCategory: false
    })
  },

  //根据排序重新查询餐厅
  searchBySort({currentTarget:{dataset:{id}}}) {
    this.data.query.order_by = Number(id)
    this.data.sortData.selectedName = this.data.sortData.list.filter(item => item.id === Number(id))[0]['name']
    this.data.offset = 0
    this.setData({
      sortData: Object.assign(this.data.sortData, {
        selected: this.data.query.order_by,
        selectedName: this.data.sortData.selectedName
      })
    })
    wx.setNavigationBarTitle({
      title: this.data.sortData.selectedName
    })
    this.toggleSort()
    this.filterShops()
  }
}
