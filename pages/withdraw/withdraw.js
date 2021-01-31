const app = getApp();
const network = require('../../utils/api.js')

var canWithdraw = '';
var minWithdrawScore = '';
var isAll = '';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mid: '',
    openid: '',
    disabled: false,
    moneyList: [{ id: 1, name: "5元" }, { id: 2, name: "10元" }, { id: 3, name: "20元" }, { id: 4, name: "50元" },
    { id: 5, name: "100元" }, { id: 6, name: "全部提现" }],
    isShow: true,
    select: '',
    phonedata: '',
    money: '',
    integral: '',
    minScore: '',
    currentIntegral: '',
  },

  // 点击选择金额
  selectMoney: function (t) {
    let id = t.currentTarget.dataset.item;

    console.log("当前积分" + this.data.currentIntegral);

    console.log("最低提现积分" + minWithdrawScore);

    if (this.data.currentIntegral < minWithdrawScore) {
      wx.showToast({
        title: '积分不足',
        icon: 'none',
        duration: 2000
      })
    } else {
      switch (id) {
        case 1:
          this.setData({
            select: id,
            withdrawMoney: 5,
            isShow: true,
          })
          break;
        case 2:
          if (canWithdraw < 10) {
            wx.showToast({
              title: '积分不足',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              isShow: false
            })
          } else {
            this.setData({
              select: id,
              withdrawMoney: 10,
              isShow: true,
            })
          }
          break;
        case 3:
          if (canWithdraw < 20) {
            wx.showToast({
              title: '积分不足',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              isShow: false,
            })
          } else {
            this.setData({
              select: id,
              withdrawMoney: 20,
              isShow: true,
            })
          }
          break;
        case 4:
          if (canWithdraw < 50) {
            wx.showToast({
              title: '积分不足',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              isShow: false,
            })
          } else {
            this.setData({
              select: id,
              withdrawMoney: 50,
              isShow: true,
            })
          }
          break;
        case 5:
          if (canWithdraw < 100) {
            wx.showToast({
              title: '积分不足',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              isShow: false,
            })
          } else {
            this.setData({
              select: id,
              withdrawMoney: 100,
              isShow: true,
            })
          }
          break;
        case 6:
          if (canWithdraw < 100) {
            wx.showToast({
              title: '全部提现最低金额为100',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              isShow: false,
            })
          } else {
            this.setData({
              select: id,
              withdrawMoney: canWithdraw,
              isShow: true,
            })
          }
      }
    }
    isAll = id == 6 ? 1 : 0;
  },

  // 获取当前积分
  getIntegral() {
    let that = this;
    let data2 = '';
    let data3 = '';

    wx.showLoading({
      title: '加载中',
    })

    let url = '/gc-tenant-api/userApplet/selectUserIntegral';
    let params = {};
    network.networkget(url, params, app).then(() => {
      wx.hideLoading();
      if (app.netWorkData.result.code == 1) {
        that.setData({
          currentIntegral: app.netWorkData.result.data
        })

        let url1 = '/gc-tenant-api/userApplet/selectIntegralRule';
        let params1 = {};
        network.networkget(url1, params1, app).then(() => {
          wx.hideLoading();
          if (app.netWorkData.result.code == 1) {
            that.setData({
              money: app.netWorkData.result.data.money,
              integral: app.netWorkData.result.data.integral,
              minScore: app.netWorkData.result.data.min_withdraw_core,
            })

            data2 = app.netWorkData.result.data.money;        //钱1
            data3 = app.netWorkData.result.data.integral;    //积分100

            minWithdrawScore = app.netWorkData.result.data.min_withdraw_core;   // 最低提现

            wx.setStorageSync('data2', data2);
            wx.setStorageSync('data3', data3);

            canWithdraw = Math.floor(that.data.currentIntegral / data3 * data2);

            console.log("可提现金额" + canWithdraw);
            console.log("规则" + JSON.stringify(app.netWorkData.result.data.rule))

            let vale = app.netWorkData.result.data.rule;
            vale = vale.substring(1, vale.length-1);
            let ruleArray = new Array();
            ruleArray = vale.split(",")
            that.setData({
              rule: ruleArray
            })
          } else {
            network.codeResolve(app.netWorkData.result)
          }
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
    this.setData({
      phonedata: wx.getStorageSync('phonedata')
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
    this.getIntegral();
  },

  // 提交
  formSubmit: function (e) {
    let that = this;
    let mid = wx.getStorageSync('mid');

    // 提交金额
    let money1 = e.detail.value.money;
    // 提现积分
    let moneyScore = money1 / that.data.money * that.data.integral;

    wx.showLoading({ title: '提交中' })

    wx.request({
      url: app.a.Url + '/gc-tenant-api/userApplet/integralCashout',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "accessToken": wx.getStorageSync('accessToken')
      },
      method: 'POST',
      data: {
        isAll: isAll,
        appUserId: mid,
        integral: moneyScore
      },
      success: function (res) {
        wx.hideLoading();

        switch (res.data.code) {
          case 0:
            wx.showToast({
              title: res.data.msg,
              image: '/images/index/fail.png',
              duration: 1500
            })
            break;
          case 1:
            that.setData({
              disabled: true
            })
            wx.showToast({
              title: '提现成功,请等待审核',
              icon: 'none',
              duration: 1500
            })
            wx.navigateTo({
              url: '../withdrawSuccess/withdrawSuccess?data1=' + res.data.data.id,
            })
            break;
          case 2:
            wx.showModal({
              title: '提示',
              content: '请先绑定微信',
              confirmText: '去绑定',
              confirmColor: '#47AED3',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../selfInfo/selfInfo',
                  })
                }
              }
            })
            break;
          default:
            wx.showToast({
              title: '网络异常',
              icon: 'none',
              duration: 1500
            })
        }
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