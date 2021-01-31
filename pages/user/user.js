const app = getApp();
const network = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    scroll_y: true,

    current_integral: 0,
    unenforced_integral: 0,
    totalMoney: 0,
    totalIntegral: 0,
    totalWeight: 0,
    totalNum: 0,
    avatar: '',
    phonedata: '',
    currentLelScore: 0,
    lev: 1,
    isShow: false
  },

  // 是否登录
  isLogin() {
    let mid = wx.getStorageSync('mid');
    if (mid == null || mid == "") {
      wx.showToast({
        title: '你还没有登录', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
      return false;
    } else {
      return true;
    }
  },

  // 等级说明
  gradeDescription() {
    wx.navigateTo({
      url: '../gradeDescription/gradeDescription',
    })
  },

  // 个人信息
  selfInfo() {
    wx.navigateTo({
      url: '../selfInfo/selfInfo',
    })
  },

  // 积分记录
  jfRecord() {
    if (this.isLogin()) {
      wx.navigateTo({
        url: '../integral/integral',
      })
    }
  },

  // 提现记录
  txRecord() {
    if (this.isLogin()) {
      wx.navigateTo({
        url: '../withdrawRecord/withdrawRecord',
      })
    }
  },

  // 奖惩记录
  jcRecord() {
    if (this.isLogin()) {
      wx.navigateTo({
        url: '../rewards/rewards',
      })
    }
  },

  // 预约订单
  orderList() {
    if (this.isLogin()) {
      wx.navigateTo({
        url: '../order/order',
      })
    }
  },

  // 信息完善
  infoPerfect() {
    if (this.isLogin()) {
      wx.navigateTo({
        url: '../perfectInfo/perfectInfo',
      })
    }
  },

  // 商家信息
  businessInfo() {
    if (this.data.status == 2) {
      wx.navigateTo({
        url: '../finishAudition/finishAudition?data1=' + this.data.reason,
      })
    } else {
      wx.navigateTo({
        url: '../businessInfo/businessInfo',
      })
    }
  },

  // 密码管理
  passwordManage() {
    if (this.isLogin()) {
      wx.navigateTo({
        url: '../editpwd/editpwd',
      })
    }
  },

  // 意见反馈
  feedback() {
    if (this.isLogin()) {
      wx.navigateTo({
        url: '../feedbackList/feedbackList',
      })
    }
  },

  // 帮助中心
  helpCenter() {
    wx.navigateTo({
      url: '../proCenter/proCenter',
    })
  },

  //  关于我们
  aboutUs() {
    wx.navigateTo({
      url: '../customerService/customerService',
    })
  },

  // 去登录
  toLogin() {
    let mid = wx.getStorageSync('mid');
    if (mid == null || mid == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  // 退出登录
  loginout: function (e) {
    let that = this;
    if (that.isLogin()) {
      wx.showToast({
        title: '退出成功',
        image: '/images/index/success.png',
        duration: 2000,
        success: function (res) {
          wx.clearStorageSync();
          that.onShow()
        }
      })
    }
  },

  // 个人积分
  selfIntegral: function () {
    let that = this;
    
    let url = '/gc-tenant-api/userApplet/selectUserIntegral';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          current_integral: app.netWorkData.result.data
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
    app.navigateTabBar();
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var ImageHeight = (227 / 500) * (windowWidth)//屏幕高宽比  
        that.setData({
          ImageWidth: windowWidth,
          ImageHeight: ImageHeight,
          scrollviewH: res.screenHeight,
          scrollviewW: res.screenWidth
        });
      },
    })
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
    let that = this;

    let mid = wx.getStorageSync('mid');
    let isMerchant = wx.getStorageSync('isMerchant');

    let url1 = '/gc-tenant-api/userApplet/selectMerchantInfo';
    let params1 = {};
    network.networkpost(url1, params1, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let tempData = app.netWorkData.result.data
        if (tempData != '') {
          that.setData({
            isShow: true,
            status: tempData.status,
            reason: tempData.reason
          })
        }
      }
    })

    that.setData({
      isMerchant: isMerchant,
      mid: mid
    })


    // 查询个人中心数据
    let url = '/gc-tenant-api/userApplet/selectUserCenterData';
    let params = {};
    network.networkget(url, params, app).then(() => {
      let tempData = app.netWorkData.result;
      if (tempData.code == 1) {
        that.setData({
          unenforced_integral: tempData.data.no_effect_integral,
          totalMoney: tempData.data.totalMoney,
          totalIntegral: tempData.data.total_integral,
          totalWeight: tempData.data.total_weight,
          totalNum: tempData.data.total_count,
          avatar: tempData.data.avatar,
          nickName: tempData.data.nickname
        })
        that.selfIntegral();

        let cur = tempData.data.currIntegral;
        let userLevel = tempData.data.userLevels;

        let level;
        let v;
        for (var i = 0; i < userLevel.length; i++) {
          if (cur < userLevel[i].integral) {
            level = userLevel[i].integral
            v = userLevel[i].V
            break;
          }
        }
        that.setData({
          currentLelScore: level,
          lev: v
        })
      } else {
        that.setData({
          current_integral: 0,
          unenforced_integral: 0,
          totalMoney: 0,
          totalIntegral: 0,
          totalWeight: 0,
          totalNum: 0,
          currentLelScore: 0
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