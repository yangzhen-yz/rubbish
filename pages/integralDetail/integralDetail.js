const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integralDetail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectDeliveryDetail';
    let params = {
      deliveryId: options.data1,
      year: options.data2
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          integralDetail: app.netWorkData.result.data
        })
      } else {
        network.codeResolve(app.netWorkData.result)
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