const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recycleList: ''
  },

  // 申请成为商家
  toApply: function () {
    wx.navigateTo({
      url: '../applyBusiness/applyBusiness',
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

    let url = '/gc-tenant-api/userApplet/getReserveHomePrice';
    let params = {
      isMerch: 1
    }
    network.networkpost(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let recycleList = app.netWorkData.result.data;
        let length = 0;
        for (var i = 0; i < recycleList.length; i++) {
          length += recycleList[i].children.length
        }
        that.setData({
          recycleList: recycleList,
          length: length
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