const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    withdrawData: '',
  },

  // 切换顶部tab
  swichNav: function (e) {
    let cur = e.target.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
      this.withdrawStatus(cur);
    }
  },

  // 提现状态
  withdrawStatus: function (e) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    let url = '/gc-tenant-api/userApplet/selectCashoutList';
    let params = {
      checkState: e,
    }
    network.networkget(url, params, app).then(() => {
      wx.hideLoading();
      if (app.netWorkData.result.code == 1) {
        that.setData({
          withdrawData: app.netWorkData.result.data,
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 积分详情
  toDetail: function (e) {
    let value = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../withdrawSuccess/withdrawSuccess?data1=' + value,
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
    this.withdrawStatus(this.data.currentTab)
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