const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyDetail: '',
    steps: [
      {
        text: '提交成功',
        desc: '申请提交成功请到"我的" - "提现记录" 中查看',
      },
      {
        text: '处理中',
        desc: '请耐心等待',
      },
      {
        text: '提现成功',
        desc: '已成功提现，预计1-2个工作日到账',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    let url = '/gc-tenant-api/userApplet/selectCashoutDetail';
    let params = {
      cashoutId: options.data1
    }
    network.networkget(url, params, app).then(() => {
      wx.hideLoading();
      
      if (app.netWorkData.result.code == 1) {
        that.setData({
          moneyDetail: app.netWorkData.result.data
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 返回首页
  backIndex: function () {
    wx.reLaunch({
      url: '../index/index',
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