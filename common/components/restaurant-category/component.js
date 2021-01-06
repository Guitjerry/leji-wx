const API = require('../../../common/utils/api.js')
const Promise = require('../../../libs/promise.js')

module.exports = {
  data: {
    //筛选方式标志位
    showCategory: false,
    //分类数据
    categoryList: [],
    categoryNow: {
      selectParent: '美食'
    },
    categoryData: {
      show_name: '',
      flavor_ids: []
    }
  },

  //是否显示分类
  toggleCategory() {
    this.setData({
      showFilter: false,
      showSort: false,
      showCategory: !this.data.showCategory
    })
  },

  //渲染子级分类
  renderCategory(index = 0, name = '美食') {
    this.setData({
      categoryNow: Object.assign(this.data.categoryNow, {
        parent: this.data.categoryList,
        children: this.data.categoryList[index] ? this.data.categoryList[index].sub_categories : {},
        selectParent: this.data.categoryList[index] ? this.data.categoryList[index].name : ''
      }),
      categoryData: Object.assign(this.data.categoryData, {
        show_name: name
      })
    })
  },

  //选择父级分类
  chooseParentCategory(e) {
    let index = Number(e.currentTarget.dataset.index)
    //if (!this.data.categoryList[index].sub_categories || this.data.categoryList[index].sub_categories.length === 0) {
    // TODO: why use split before
    //  let query = e.currentTarget.dataset.id.split(',').map(item => Number(item))
    //  this.searchByCategory(query, e.currentTarget.dataset.name)
    //}
    if (!this.data.categoryList[index].sub_categories || this.data.categoryList[index].sub_categories.length === 0) {
      this.searchByCategory(null, e.currentTarget.dataset.name)
    }
    this.renderCategory(index)
  },

  chooseChildCategory(e){
    this.searchByCategory(Number(e.currentTarget.dataset.id), e.currentTarget.dataset.name)
  },

  //根据分类ID重新查询餐厅
  searchByCategory(id, name = '美食') {
    this.data.query.restaurant_category_ids = id ? (id instanceof Array ? id : [id]) : []
    this.data.offset = 0
    this.setData({
      categoryNow: Object.assign(this.data.categoryNow, {
        selectChild: id
      }),
      categoryData: Object.assign(this.data.categoryData, {
        show_name: name
      })
    })
    this.toggleCategory()
    this.filterShops()
  },

  initCategoryNow() {
    let str = this.data.categoryData.show_name
    let arr = this.data.categoryList
    for(let i = 0,length = arr.length; i < length; i++) {
      if (arr[i].name === str) {
        this.setData({
          categoryNow: {
            parent: this.data.categoryList,
            children: this.data.categoryList[i] ? this.data.categoryList[i].sub_categories : {},
            selectParent: this.data.categoryList[i] ? this.data.categoryList[i].name : '',
            selectChild: arr[i].sub_categories[0].id
          }
        })
        return
      }
    }
    this.renderCategory(1, str)
  },

  //获取餐厅分类
  getCategory() {
    return API.getShopCategories({
      latitude: this.data.query.latitude,
      longitude: this.data.query.longitude,
      flavor_ids: this.data.categoryData.flavor_ids,
      show_name: this.data.categoryData.show_name
    })
    .then(({data}) => {
      this.data.categoryList = data
      return Promise.resolve()
    })
  },

  onLoad() {
    //获取分类
    this.setData({
      categoryData : {
        flavor_ids: this.data.options.category_schema ? this.data.options.category_schema.complex_category_ids : [207, 220, 233, 260],
        show_name: this.data.options.category_schema ? this.data.options.category_schema.category_name : '美食'
      }
    })
    this.getCategory().then(this.initCategoryNow)
  }
}
