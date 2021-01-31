const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    feedbackDetail: '',
    userInfo: {},
    defaultName: app.a.defaultName,
    defaultImg: app.a.defaultImg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 查询个人信息
    let url = '/gc-tenant-api/userApplet/selectUserInfo';
    let params = {}
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          userInfo: app.netWorkData.result.data
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })

    // 查询详情
    let url1 = '/gc-tenant-api/userApplet/selectFeedbackDetail';
    let params1 = {
      feedbackId: options.data1
    }
    network.networkget(url1, params1, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          feedbackDetail: app.netWorkData.result.data
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 去提意见
  toAdvise: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
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