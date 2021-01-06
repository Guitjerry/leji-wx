const API = require('../../../common/utils/api.js')

module.exports = {
  data: {
    //筛选方式标志位
    showFilter: false,
    //筛选数据
    filterData: {
      activityAttribute: [],
      activityTypes: [],
      deliveryMode: []
    }
  },

  //获取筛选数据
  getFilter() {
    return API.getShopFilters({
      latitude: this.data.query.latitude,
      longitude: this.data.query.longitude
    })
    .then(({data}) => {
      this.setData({
        filterData: data
      })
    })
  },

  //是否显示分类
  toggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter,
      showSort: false,
      showCategory: false
    })
  },

  //选择筛选项
  chooseFilter(e) {
    let {index, tag} = e.currentTarget.dataset
    index = Number(index)
    let target = this.data.filterData[tag][index]
    if (tag !== 'activityAttribute' && !target.selected) {
      this.data.filterData[tag].forEach(item => item.selected = false)
    }
    target.selected = !target.selected
    this.setData({
      filterData: this.data.filterData
    })
  },

  //提取筛选项
  extractFilter(str) {
    return [].concat(this.data.filterData[str].filter(item => item.selected).map(item => item.id))
  },

  clearFilter() {
    for (let key in this.data.filterData) {
      this.data.filterData[key].forEach(item => item.selected = false)
    }
    this.setData({
      filterData: this.data.filterData
    })
  },

  //根据筛选项重新查询餐厅
  searchByFilter() {
    Object.assign(this.data.query, {
      delivery_mode: this.extractFilter('deliveryMode'),
      activity_types: this.extractFilter('activityTypes'),
      support_ids: this.extractFilter('activityAttribute')
    })
    this.toggleFilter()
    this.filterShops()
  },

  onLoad() {
    //获取分类
    this.getFilter()
  }
}
