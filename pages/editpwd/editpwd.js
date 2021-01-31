// pages/editpwd/editpwd.js
const app = getApp();
const network = require('../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: true,
    isShow1: true,
    isShow2: true
  },

  // 查看密码
  open: function (e) {
    let key = e.currentTarget.dataset.key;
    if (key == 0) {
      this.setData({
        isShow: false
      })
    } else if (key == 1) {
      this.setData({
        isShow1: false
      })
    } else if (key == 2) {
      this.setData({
        isShow2: false
      })
    }
  },

  // 隐藏密码
  close: function (e) {
    let key = e.currentTarget.dataset.key;
    if (key == 0) {
      this.setData({
        isShow: true
      })
    } else if (key == 1) {
      this.setData({
        isShow1: true
      })
    } else if (key == 2) {
      this.setData({
        isShow2: true
      })
    }
  },

  // 忘记旧密码
  forgetOld: function () {
    wx.navigateTo({
      url: '../forgetpwd/forgetpwd',
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

  // 提交
  formSubmit: function (e) {
    if (e.detail.value.password.length == 0) {
      wx.showToast({
        title: '请输入原密码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (e.detail.value.newPassword.length == 0) {
      wx.showToast({
        title: '请输入新密码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (e.detail.value.confirmPassword.length == 0) {
      wx.showToast({
        title: '请再次输入密码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (e.detail.value.newPassword !== e.detail.value.confirmPassword) {
      wx.showToast({
        title: '两次输入不一致',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else {

      let url = '/gc-tenant-api/userApplet/updatePassword';
      let params = {
        password: e.detail.value.password,
        newPassword: e.detail.value.newPassword,
        confirmPassword: e.detail.value.confirmPassword
      }
      network.networkget(url, params, app).then(() => {
        if (app.netWorkData.result.code == 1) {
          wx.showToast({
            title: '修改成功',//这里打印出提交成功
            image: '/images/index/success.png',
            duration: 1500
          }),
            wx.reLaunch({
              url: '../login/login'
            })
        } else {
          network.codeResolve(app.netWorkData.result)
        }
      })
    }
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