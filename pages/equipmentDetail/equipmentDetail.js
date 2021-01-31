const app = getApp();
const network = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let url = '/gc-tenant-api/userApplet/selectDeviceById';
    let params = {
      deviceId: options.data1,
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude')
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {

        let equipmentDetail = app.netWorkData.result.data;
        if (equipmentDetail.distance < 1000) {
          equipmentDetail.distance = parseInt(equipmentDetail.distance);
          equipmentDetail.unit = 'm';
        } else {
          equipmentDetail.distance = (parseInt(equipmentDetail.distance) / 1000).toFixed(1);
          equipmentDetail.unit = 'km';
        }
        that.setData({
          recycleDetail: equipmentDetail,
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })

    // 查询广告图片
    let url1 = '/gc-tenant-api/userApplet/selectAd';
    let params1 = {
      location: 2
    }
    network.networkget(url1, params1, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          imgUrl: app.netWorkData.result.data.url
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 导航
  toNavigate: function (e) {
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