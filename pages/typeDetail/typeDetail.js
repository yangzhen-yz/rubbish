const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    title: "",
    imgUlr: '',
    url: app.a.Url,
    wasteDetail: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let rubbishType = options.data1;
    console.log("垃圾分类" + rubbishType)

    if (rubbishType == 1) {
      this.setData({
        title: '可回收垃圾',
        imgUrl: '/images/type/recycle1.png'
      })
    } else if (rubbishType == 2) {
      this.setData({
        title: '有害垃圾',
        imgUrl: '/images/type/bad1.png'
      })
    } else if (rubbishType == 3) {
      this.setData({
        title: '厨余垃圾',
        imgUrl: '/images/type/kitchen1.png'
      })
    } else if (rubbishType == 4) {
      this.setData({
        title: '其他垃圾',
        imgUrl: '/images/type/other1.png'
      })
    }

    // switch (rubbishType) {
    //   case 1: this.setData({ title: '可回收垃圾' });
    //   case 2: this.setData({ title: '有害垃圾' });
    //   case 3: this.setData({ title: '厨余垃圾' });
    //   case 4: this.setData({ title: '其他垃圾' })
    // }

    var that = this;
    wx.request({
      url: app.a.Url + '/gc-tenant-api/userApplet/selectRubbishTypeDetail',
      data: { rubbishType: rubbishType },
      success: function (res) {
        console.log("结果:" + JSON.stringify(res.data.data));
        that.setData({
          wasteDetail: res.data.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})