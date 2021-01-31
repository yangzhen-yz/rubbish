const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    communityList: '',
    statusList: '',
    isShow: true,
    isTrue: true
  },

  // 地图模式
  mapMode: function () {
    wx.navigateBack({
      url: "../about/about"
    })
  },

  // 搜索
  search: function (e) {
    let value = e.detail.value;
    if (value != '') {
      this.setData({
        isShow: false
      })
    } else {
      this.setData({
        isShow: true
      })
    }
    let that = this;

    let url = '/gc-tenant-api/userApplet/selectAllDevice';
    let params = {
      address: e.detail.value,
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude')
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {

        let communityList = app.netWorkData.result.data;
        for (var i = 0; i < communityList.length; i++) {
          if (communityList[i].distance < 1000) {
            communityList[i].distance = parseInt(communityList[i].distance);
            communityList[i].unit = 'm';
          } else {
            communityList[i].distance = (parseInt(communityList[i].distance) / 1000).toFixed(1);
            communityList[i].unit = 'km';
          }
        }
        that.setData({
          communityList: communityList
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 导航
  toLocation: function (e) {
    let lati = e.currentTarget.dataset.lati;
    let long = e.currentTarget.dataset.long;
    if (lati != null && long != null) {
      wx.openLocation({
        latitude: parseFloat(lati),
        longitude: parseFloat(long),
        scale: 14
      })
    }
  },

  // 设备详情
  toDetail: function (e) {
    let deviceId = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../equipmentDetail/equipmentDetail?data1=' + deviceId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let key = options.data1;
    if (key == 1) {
      this.setData({
        isTrue: false
      })
    } else {
      this.setData({
        isTrue: true
      })
    }
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

    let url = '/gc-tenant-api/userApplet/selectAllDevice';
    let params = {
      address: '',
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude'),
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let communityList = app.netWorkData.result.data;

        for (var i = 0; i < communityList.length; i++) {
          if (communityList[i].distance < 1000) {
            communityList[i].distance = parseInt(communityList[i].distance);
            communityList[i].unit = 'm';
          } else {
            communityList[i].distance = (parseInt(communityList[i].distance) / 1000).toFixed(1);
            communityList[i].unit = 'km';
          }
        }
        that.setData({
          communityList: communityList
        })
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