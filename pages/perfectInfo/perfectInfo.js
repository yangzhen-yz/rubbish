const app = getApp();
const network = require('../../utils/api.js')
var sexName = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: '',
    index: '',
    selfInfo: '',
    communityList: ''
  },
  // 性别
  radioChange: function (e) {
    let value = e.detail.value;
    this.setData({
      sex: value
    })
    sexName = value == 0 ? 1 : 2;
  },

  // 选择小区
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  // 提交
  toSubmit: function (e) {
    let tempValue = e.detail.value;
    let that = this;
    if (that.data.selfInfo.sex == null && sexName == '') {
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (sexName == '') {
      sexName = that.data.selfInfo.sex
    }

    let url = '/gc-tenant-api/userApplet/completeInfo';
    let params = {
      name: tempValue.name,
      sex: sexName,
      age: tempValue.age,
      communityId: tempValue.communityId,
      address1: tempValue.tower,
      address2: tempValue.units,
      address3: tempValue.door
    };
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        wx.reLaunch({
          url: '../user/user',
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let url = '/gc-tenant-api/userApplet/selectCommunity';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          communityList: app.netWorkData.result.data
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
    let that = this;
    
    let url = '/gc-tenant-api/userApplet/selectUserInfo';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          selfInfo: app.netWorkData.result.data,
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