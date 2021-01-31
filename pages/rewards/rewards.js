const app = getApp();
const network = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    rewardList: '',
    punishList: '',

  },

  // 切换tab
  swichNav: function (e) {
    let cur = e.target.dataset.current;
    let type = cur == 0 ? 1 : 2;
    this.setData({
      type: type
    })

    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
      })
      switch (type) {
        case 1:
          this.rewardList()
          break;
        case 2:
          this.punishList()
          break;
      }
    }
  },

  // 查询奖励记录
  rewardList() {
    let that = this
    let url = '/gc-tenant-api/userApplet/selectRewardsPunish';
    let params = {
      type: 1
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          rewardList: app.netWorkData.result.data,
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 查询惩罚记录
  punishList(e) {
    let that = this
    let url = '/gc-tenant-api/userApplet/selectRewardsPunish';
    let params = {
      type: 2
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          punishList: app.netWorkData.result.data
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
    this.rewardList();
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