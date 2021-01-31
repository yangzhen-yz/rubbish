const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    isbindPhone: false,
    isbindWx: false,
    phone: '',
    showModal: true
  },

  // 更换手机号
  editPhone: function () {
    let openid = wx.getStorageSync('openid')
    if (openid == '' || openid == null) {
      wx.showModal({
        title: '提示',
        content: '更换手机号前需绑定微信，否则不能更换',
        confirmColor: '#47AED3',
        cancelColor: '47AED3',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../bindWx/bindWx',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../editPhone/editPhone',
      })
    }
  },

  // 绑定手机号
  bindPhone: function () {
    wx.navigateTo({
      url: '../bindPhone/bindPhone',
    })
  },

  // 绑定微信号
  bindWx: function () {
    wx.navigateTo({
      url: '../bindWx/bindWx',
    })
  },

  // 解绑微信
  unbindWx: function () {
    wx.navigateTo({
      url: '../unbindWx/unbindWx',
    })
  },

  // 个人信息
  selfInfo: function () {
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectUserInfo';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          userInfo: app.netWorkData.result.data
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 查询手机号
  selectPhone: function () {
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectPhone';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          phone: app.netWorkData.result.data
        })
        wx.setStorageSync('phone', app.netWorkData.result.data)
        // } else {
        // network.codeResolve(app.netWorkData.result)
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
    let that = this;

    // 查询是否绑定手机号和微信号
    let url1 = '/gc-tenant-api/userApplet/checkMobileBind';
    let params1 = {};
    network.networkget(url1, params1, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          isbindPhone: app.netWorkData.result.data.isBindMobile,
          isbindWx: app.netWorkData.result.data.isBindWx,
          showModal: false
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })

    // 查询用户信息
    that.selfInfo();
    that.selectPhone();

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