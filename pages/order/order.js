const app = getApp()
const network = require('../../utils/api.js')
var currentDate = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    orderdata: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  },

  // 选择年和月
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    let yearAndMonth = e.detail.value;
    let time1 = yearAndMonth.split("-");
    this.setData({
      year: time1[0],
      month: time1[1]
    })
    currentDate = this.data.year + "-" + this.data.month
    this.onShow();
  },

  // 切换tab
  swichNav: function (e) {
    let cur = e.target.dataset.current;
    console.log("cur:" + cur)
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
      })
      this.orderList(cur);
    }
  },

  // 订单列表
  orderList: function (cur) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })

    let url = '/gc-tenant-api/userApplet/selectReserveList';
    let params = {
      type: cur,
      time: currentDate
    }
    network.networkget(url, params, app).then(() => {
      wx.hideLoading();
      if (app.netWorkData.result.code == 1) {
        that.setData({
          orderdata: app.netWorkData.result.data,
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  //  取消预约
  cancelOrder: function (e) {
    let that = this;
    let orderId = e.currentTarget.dataset.key;
    wx.showModal({
      title: '取消预约单',
      content: '确定要取消预约单？',
      showCancel: true,//是否显示取消按钮
      cancelColor: '#47AED3',//取消文字的颜色
      confirmColor: '#47AED3',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {

          let url = '/gc-tenant-api/userApplet/cancelReserve';
          let params = {
            reserveId: orderId
          }
          network.networkget(url, params, app).then(() => {
            if (app.netWorkData.result.code == 1) {
              wx.showToast({
                title: '取消成功',
                duration: 1500
              })
              that.onShow()
            } else {
              network.codeResolve(app.netWorkData.result)
            }
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.navigateTabBar1();
    let currentMonth = new Date().getMonth() + 1;
    currentDate = new Date().getFullYear() + "-" + currentMonth;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onReachBottom() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.orderList(this.data.currentTab);
  }
})
