const app = getApp();
const util = require("../../utils/util.js");
const network = require('../../utils/api.js')
var uuid = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    verifyCodeTime: '获取验证码',
    verifyCodeTime1: '获取验证码',
    phone: '',
    isShow: false,
    currentPhone: '',
    imgCode: '',
    imgCode1: ''
  },

  // 获取手机号
  mobileInput: function (e) {
    this.setData({
      currentPhone: e.detail.value
    })
  },

  // 获取验证码
  verifyCodeEvent: function (e) {
    uuid = util.wxuuid();
    let that = this;
    let regMobile = /^1\d{10}$/;
    if (!regMobile.test(this.data.currentPhone)) {
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
    if (this.data.buttonDisable) return false;


    let url = '/gc-tenant-api/userApplet/sendSmsCode';
    let params = {
      uuid: uuid,
      phone: this.data.currentPhone,
      captcha: 'oldPhone',
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

  // 获取验证码
  verifyCodeEvent1: function (e) {
    uuid = util.wxuuid();
    let that = this;
    let regMobile = /^1\d{10}$/;
    if (!regMobile.test(this.data.currentPhone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
      return false;
    }
    if (this.data.imgCode1 == '' || this.data.imgCode1 == null) {
      wx.showToast({
        title: '请输入图形验证码',
        duration: 1500,
        icon: 'none'
      })
      return;
    }
    if (that.data.buttonDisable1) return false;


    let url = '/gc-tenant-api/userApplet/sendSmsCode';
    let params = {
      uuid: uuid,
      phone: this.data.currentPhone,
      captcha: 'newPhone',
      code: this.data.imgCode1,
      ip: this.data.ip
    }
    network.phoneCode(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let c = 60;
        var intervalId = setInterval(function () {
          c = c - 1;
          that.setData({
            verifyCodeTime1: c + 's后重发',
            buttonDisable1: true
          })
          if (c == 0) {
            clearInterval(intervalId);
            that.setData({
              verifyCodeTime1: '获取验证码',
              buttonDisable1: false
            })
            that.onTap1();
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

  // 提交
  formSubmit: function (e) {

    let oldPhone = e.detail.value.oldPhone;
    let code = e.detail.value.code;
    let that = this;
    let regMobile = /^1\d{10}$/;

    if (!regMobile.test(oldPhone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
      return false;
    } else if (code.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else {

      let url = '/gc-tenant-api/userApplet/changeMobile';
      let params = {
        uuid: uuid,
        step: 1,
        mobile: oldPhone,
        smsCode: code,
      }
      network.networkpost(url, params, app).then(() => {
        if (app.netWorkData.result.code == 1) {
          wx.showToast({
            title: app.netWorkData.result.msg,//这里打印出提交成功
            image: '/images/index/success.png',
            duration: 1500
          }),
            that.setData({
              isShow: true,
            })
          that.onTap1();
        } else {
          network.codeResolve(app.netWorkData.result)
        }
      })
    }
  },

  // 修改底部边框
  focus: function (e) {
    this.setData({
      isFocus: e.currentTarget.dataset.key
    })
  },

  // 提交
  formSubmit1: function (e) {

    let newPhone = e.detail.value.newPhone;
    let code = e.detail.value.code;
    let regMobile = /^1\d{10}$/;
    if (!regMobile.test(newPhone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
      return false;
    } else if (code.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else {

      let url = '/gc-tenant-api/userApplet/changeMobile';
      let params = {
        uuid: uuid,
        mobile: newPhone,
        smsCode: code,
        step: 2
      }
      network.networkpost(url, params, app).then(() => {
        if (app.netWorkData.result.code == 1) {
          wx.showToast({
            title: app.netWorkData.result.msg,//这里打印出提交成功
            image: '/images/index/success.png',
            duration: 1500
          })
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
    this.setData({
      phone: wx.getStorageSync('phone')
    })
    
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
      captcha: 'oldPhone'
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

  //刷新验证码
  onTap1() {
    let that = this;

    let url = '/gc-tenant-api/userApplet/verifyCode';
    let params = {
      captcha: 'newPhone'
    }
    network.refleshCode(url, params, app).then(() => {
      that.setData({
        url2: app.netWorkData.result
      })
    })
  },

  // 图形验证码
  codeImg1: function (e) {
    this.setData({
      imgCode1: e.detail.value
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