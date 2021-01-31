const app = getApp()
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    problemList: '',
    isShow: false,
    index1: '',
    input: ''
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  // 弹出层
  showPopup() {
    this.setData({ show1: true });
  },

  onClose() {
    this.setData({ show1: false });
  },


  // 搜索
  search: function (e) {
    let that = this;

    let url = '/gc-tenant-api/userApplet/searchQuestion';
    let params = {
      searchValue: e.detail.value
    };
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          problemList: app.netWorkData.result.data
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 快速搜索
  fastSearch: function (e) {
    let hotValue = e.currentTarget.dataset.value;
    let hotName = e.currentTarget.dataset.name;
    this.setData({
      input: hotName
    })
    let that = this;

    let url = '/gc-tenant-api/userApplet/searchQuestionByTag';
    let params = {
      tagId: hotValue
    };
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          problemList: app.netWorkData.result.data
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

    let url = '/gc-tenant-api/userApplet/selectQuestionTag';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          keyword: app.netWorkData.result.data
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

    let url = '/gc-tenant-api/userApplet/selectQuestion';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          problemList: app.netWorkData.result.data
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