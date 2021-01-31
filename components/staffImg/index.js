// components/staffImg/index.js
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
    // 展开和合并员工上传
    open: function (e) {
      this.setData({
        isShow: true
      })
    },
    close: function () {
      this.setData({
        isShow: false
      })
    },

    // 选择图片
    previewImg: function (info) {

      var url = info.currentTarget.dataset.url;
      console.log(JSON.stringify(url));

      wx.previewImage({
        current: url,
        urls: this.properties.list.staff_imgs,
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
      });
    },
  }
})
