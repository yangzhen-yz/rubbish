const app = getApp();
const network = require('../../utils/api.js')
var year = '';
var month = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    currentTab: 0,
    currentTab1: 3,

    integralData: '',
    recycleList: '',

    isShow: true,
    scroll_y: true,
  },

  // 选择年和月
  bindDateChange: function (e) {
    let yearAndMonth = e.detail.value;
    let time1 = yearAndMonth.split("-");
    year = time1[0];
    month = time1[1];
    this.setData({
      year: time1[0],
      month: time1[1]
    })
    switch (e.currentTarget.dataset.picker) {
      case 0:
        this.integralStatus();
        break;
      case 1:
        this.searchRecycle();
    }
  },

  // 切换机柜投递与上门回收
  switchTab: function (e) {
    let cur1 = e.currentTarget.dataset.current1;
    this.setData({
      currentTab1: cur1,
    })
    if (cur1 == 3) {
      this.setData({
        isShow: true
      })
      this.deviceDelivery();
    } else if (cur1 == 4) {
      this.setData({
        isShow: false
      })
      this.visitRecycle();
    }
    this.loadDate()
  },

  // 查询上门回收数据
  visitRecycle() {
    let that = this;

    let url = '/gc-tenant-api/userApplet/selectReserveList';
    let params = {
      type: 3,
      time: year + "-" + month
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          recycleList: app.netWorkData.result.data
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 机柜投递积分详情
  integralDetail: function (e) {
    let cashId = e.currentTarget.dataset.key;
    let selectYear = year + '-' + month
    wx.navigateTo({
      url: '../integralDetail/integralDetail?data1=' + cashId + "&data2=" + selectYear,
    })
  },

  // 上门回收积分详情
  integralDetail1: function (e) {
    let reserveId = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?data1=' + reserveId,
    })
  },

  //切换机柜投递列表
  swichNav: function (e) {
    let cur = e.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
      })
      this.deviceDelivery()
    }
  },

  //  查询机柜投递记录
  deviceDelivery: function () {
    let that = this;
    console.log(year + "-" + month + "  " + this.data.currentTab)
    wx.showLoading({
      title: '加载中',
    })
    let url = '/gc-tenant-api/userApplet/selectDelivery';
    let params = {
      year: year + "-" + month,
      checkState: this.data.currentTab,
    }
    network.networkget(url, params, app).then(() => {
      wx.hideLoading();
      if (app.netWorkData.result.code == 1) {
        that.setData({
          integralData: app.netWorkData.result.data,
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 加载年和月
  loadDate: function () {
    let now = new Date();
    let month1 = now.getMonth();
    year = now.getFullYear();
    month = month1 + 1;
    if (month < 10) {
      month = '0' + month;
    }
    this.setData({
      year: year,
      month: month
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDate();
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
    this.deviceDelivery(this.data.currentTab)
  },

  // 触底
  onReachBottom() {

  }
})