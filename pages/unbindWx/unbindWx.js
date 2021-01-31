const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 解绑微信
  unbindWx: function () {
    wx.showModal({
      title: '提示',
      content: '确认解绑微信吗',
      cancelColor: '#47AED3',//取消文字的颜色
      confirmColor: '#47AED3',//确定文字的颜色
      success(res) {
        if (res.confirm) {
          
          let url = '/gc-tenant-api/userApplet/unbindWx';
          let params = {};
          network.networkget(url, params, app).then(() => {
            if (app.netWorkData.result.code == 1) {
              wx.showToast({
                title: '解绑成功',
                icon: 'none',
                duration: 2000
              })
              wx.navigateBack({
                url: '../selfInfo/selfInfo',
              })
              wx.removeStorageSync('openid')
            } else {
              network.codeResolve(app.netWorkData.result)
            }
          })
        }
      }
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