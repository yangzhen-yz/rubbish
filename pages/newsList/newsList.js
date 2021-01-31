const app = getApp();
const network = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: ''
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
    
    wx.showLoading({
      title: '加载中',
    })
    let url = '/gc-tenant-api/userApplet/selectHomeData';
    let params = {
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude')
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        wx.hideLoading();
        that.setData({
          newsList: app.netWorkData.result.data.newArticles
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