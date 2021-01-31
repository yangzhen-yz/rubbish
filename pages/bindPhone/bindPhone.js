const util = require("../../utils/util.js");
const network = require('../../utils/api.js')
const app = getApp()
var uuid = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    verifyCodeTime: '获取验证码',
    loginOk: false,
    password: '',
    isShow: false,
    isShow1: false,
    isFocus: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: 'http://ip-api.com/json',
      success: function (res) {
        console.log("ip =>", res.data.query, res.data);
        that.setData({
          ip: res.data.query
        })
      }
    })
  },

  // 切换border
  focus: function (e) {
    this.setData({
      isFocus: e.currentTarget.dataset.key
    })
  },

  //密码输入
  passwordInput: function (e) {
    this.data.password = e.detail.value;
  },

  // 查看密码
  eyesOpen: function () {
    this.setData({
      isShow: true
    })
  },

  eyesClose: function () {
    this.setData({
      isShow: false
    })
  },

  // 查看密码1
  eyesOpen1: function () {
    this.setData({
      isShow1: true
    })
  },

  eyesClose1: function () {
    this.setData({
      isShow1: false
    })
  },

  // 获取手机号
  mobileInputEvent: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取验证码
  verifyCodeEvent: function (e) {
    uuid = util.wxuuid();

    let that = this;
    let phone = that.data.phone;
    let regMobile = /^1\d{10}$/;
    if (!regMobile.test(phone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
      return false;
    }

    if (this.data.imgCode == '' || this.data.imgCode == null) {
      wx.showToast({
        title: '请输入图形验证码',
        duration: 1500,
        icon: 'none'
      })
      return;
    }

    if (that.data.buttonDisable) return false;

    let url = '/gc-tenant-api/userApplet/sendSmsCode';
    let params = {
      uuid: uuid,
      phone: phone,
      captcha: 'bindPhone',
      code: this.data.imgCode,
      ip: this.data.ip
    }
    network.phoneCode(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let c = 60;
        var intervalId = setInterval(function () {
          c = c - 1;
          that.setData({
            verifyCodeTime: c + 's后重发',
            buttonDisable: true
          })
          if (c == 0) {
            clearInterval(intervalId);
            that.setData({
              verifyCodeTime: '获取验证码',
              buttonDisable: false
            })
            that.onTap();
          }
        }, 1000)
        wx.showToast({
          title: app.netWorkData.result.msg,
          image: '/images/index/success.png',
          duration: 1500
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 立即绑定
  formSubmit: function (e) {
    let phone = e.detail.value.phone;
    let password = e.detail.value.password;
    let password1 = e.detail.value.password1;
    let code = e.detail.value.code;

    var regMobile = /^1\d{10}$/;
    if (!regMobile.test(phone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (password.length == 0) {
      wx.showToast({
        title: '请填写密码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (password != password1) {
      wx.showToast({
        title: '两次密码不一致',
        image: '/images/index/fail.png',
        duration: 1500
      })
    }
    else if (code.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '确认绑定此手机号',
        // showCancel: true,//是否显示取消按钮
        // cancelText:"否",//默认是“取消”
        cancelColor: '#47AED3',//取消文字的颜色
        confirmColor: '#47AED3',//确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            wx.navigateBack({
              url: '../selfInfo/selfInfo',
            })
          } else if (res.confirm) {

            let url = '/gc-tenant-api/userApplet/bindMobile';
            let params = {
              uuid: uuid,
              mobile: phone,
              password: password,
              confirmPassword: password1,
              smsCode: code,
            }
            network.networkpost(url, params, app).then(() => {
              if (app.netWorkData.result.code == 1) {
                wx.showToast({
                  title: app.netWorkData.result.msg,
                  image: '/images/index/success.png',
                  duration: 1500
                })
                wx.reLaunch({
                  url: '../index/index',
                })
              } else {
                network.codeResolve(app.netWorkData.result)
              }
            })
          }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.onTap();
  },

  //刷新验证码
  onTap() {
    let that = this;

    let url = '/gc-tenant-api/userApplet/verifyCode';
    let params = {
      captcha: 'bindPhone'
    }
    network.refleshCode(url, params, app).then(() => {
      that.setData({
        url1: app.netWorkData.result
      })
    })
  },

  // 图形验证码
  codeImg: function (e) {
    this.setData({
      imgCode: e.detail.value
    })
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