const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.a.Url,
    rankUrl: '/gc-tenant-api/userApplet/rank',
    currentTab: "0",
    type: 'week'
  },
  // 切换tab
  swichNav: function (e) {

    let cur = e.currentTarget.dataset.current;
    console.log("cur:" + cur)
    switch (cur) {
      case "0":
        this.setData({
          type: "week"
        })
        break;
      case "1":
        this.setData({
          type: "month"
        })
        break;
      case "2":
        this.setData({
          type: "year"
        })
        break;
    }

    if (this.data.currentTab == cur) {
      return false
    } else {
      this.setData({
        currentTab: cur
      })
    }
    this.rankList();
  },
  
  // 排行列表
  rankList: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    let url = '/gc-tenant-api/userApplet/appRank';
    let params = {
      type: this.data.type
    };
    network.networkget(url, params, app).then(() => {
      wx.hideLoading();

      switch (this.data.currentTab) {
        case "0":
          that.setData({
            weekList: app.netWorkData.result
          })
          break;
        case "1":
          that.setData({
            monthList: app.netWorkData.result
          })
          break;
        case "2":
          that.setData({
            yearList: app.netWorkData.result
          })
          break;
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.navigateTabBar();
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
    this.rankList()
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