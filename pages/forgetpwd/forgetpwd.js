const util = require("../../utils/util.js");
const app = getApp();
const network = require('../../utils/api')
var uuid = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyCodeTime: '获取验证码',
    isFocus: 1,
    phone: '',
    isShow: false,
    isShow1: false,
    imgCode: ''
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
      captcha: 'forgetpsw',
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

  // 切换border
  focus: function (e) {
    this.setData({
      isFocus: e.currentTarget.dataset.key
    })
  },

  // 查看密码
  eyesOpen: function (e) {
    let eye = e.currentTarget.dataset.eye;
    if (eye == 1) {
      this.setData({
        isShow: true
      })
    } else if (eye == 2) {
      this.setData({
        isShow1: true
      })
    }
  },

  // 隐藏密码
  eyesClose: function (e) {
    let eye1 = e.currentTarget.dataset.eye;
    if (eye1 == 1) {
      this.setData({
        isShow: false
      })
    } else if (eye1 == 2) {
      this.setData({
        isShow1: false
      })
    }
  },

  // 提交
  formSubmit: function (e) {
    let phone = e.detail.value.phone;
    let code = e.detail.value.code;
    let newPassword = e.detail.value.newPassword;
    let confirmPassword = e.detail.value.confirmPassword;

    var regMobile = /^1\d{10}$/;
    if (!regMobile.test(phone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
      return false;
    } else if (newPassword.length == 0) {
      wx.showToast({
        title: '请填写新密码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (confirmPassword.length == 0) {
      wx.showToast({
        title: '请填写确认密码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (newPassword != confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (code.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else {
      let url = '/gc-tenant-api/userApplet/forgetPassword';
      let params = {
        uuid: uuid,
        phone: phone,
        smsCode: code,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      }
      network.networkpost(url, params, app).then(() => {
        if (app.netWorkData.result.code == 1) {
          wx.showToast({
            title: app.netWorkData.result.msg,//这里打印出提交成功
            image: '/images/index/success.png',
            duration: 1500
          }),
            wx.reLaunch({
              url: '../login/login'
            })
        } else {
          network.codeResolve(app.netWorkData.result)
        }
      })
    }
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
      captcha: 'forgetpsw'
    }
    network.refleshCode(url, params, app).then(() => {
      that.setData({
        codeUrl: app.netWorkData.result
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