const app = getApp();
const network = require('../../utils/api')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    feedbackList: ''
  },

  // 反馈详情
  detail: function (e) {
    let id = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../feedbackDetail/feedbackDetail?data1=' + id,
    })
  },

  // 去提意见
  toAdvise: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectFeedbackList';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          feedbackList: app.netWorkData.result.data
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
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