// components/problemCenter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open: function (e) {

      let isShow = this.data.isShow
      isShow = isShow ? false : true;
      this.setData({
        isShow: isShow
      })
    },
  }
})
