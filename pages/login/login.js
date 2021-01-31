const app = getApp();
const network = require('../../utils/api.js');
const util = require('../../utils/util.js');
var uuid = '';
Page({
  data: {
    verifyCodeTime: '获取验证码',
    mid: '',
    isLogin: false,
    isShow: true,
    isFocus: 1,
    isFocus1: 3,
    logo: '',
    currentTab: 0
  },

  onLoad: function (options) {
    this.setData({
      logo: wx.getStorageSync('logo')
    })

    // 获取code
    let that = this;
    wx.login({
      success: res => {
        that.data.code = res.code
        console.log("code:"+res.code)
      },
    })

    // 获取ip
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

  focus: function (e) {
    this.setData({
      isFocus: e.currentTarget.dataset.key
    })
  },

  focus1: function (e) {
    this.setData({
      isFocus1: e.currentTarget.dataset.key
    })
  },

  // 查看密码
  eyesOpen: function () {
    this.setData({
      isShow: false
    })
  },

  // 隐藏密码
  eyesClose: function () {
    this.setData({
      isShow: true
    })
  },

  // 账号登录
  formSubmit: function (e) {
    let nickname = wx.getStorageSync('nickName');
    let avatar = wx.getStorageSync('avatarUrl');
    let openid = wx.getStorageSync('openid');

    let regMobile = /^1\d{10}$/;
    if (!regMobile.test(e.detail.value.phone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
    }
    else if (e.detail.value.password.length == 0) {
      wx.showToast({
        title: '请填写密码',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else {
      let url = '/gc-tenant-api/userApplet/login';
      let params = {
        phone: e.detail.value.phone,
        password: e.detail.value.password,
        avatar: avatar,
        nickname: nickname,
        openid: openid,
      }
      network.networkpost(url, params, app).then(() => {
        if (app.netWorkData.result.code == 1) {
          wx.showToast({
            title: app.netWorkData.result.msg,//这里打印出提交成功
            image: '/images/index/success.png',
            duration: 2000
          })
          wx.setStorageSync('mid', app.netWorkData.result.data.appUserId);
          wx.setStorageSync('isMerchant', app.netWorkData.result.data.isMerchant);
          wx.setStorageSync('accessToken', app.netWorkData.result.data.accessToken);
          wx.reLaunch({
            url: '../index/index',
          })
        } else {
          network.codeResolve(app.netWorkData.result)
        }
      })
    }
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
      captcha: 'duanxin',
      code: this.data.imgCode,
      ip: this.data.ip
    };
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

  //短信验证码登录
  formSubmit1: function (e) {
    let nickname = wx.getStorageSync('nickName');
    let avatar = wx.getStorageSync('avatarUrl');
    let openid = wx.getStorageSync('openid');

    let regMobile = /^1\d{10}$/;
    if (!regMobile.test(e.detail.value.phone)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
    }
    else if (e.detail.value.codeImg.length == 0) {
      wx.showToast({
        title: '图形验证码有误',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (e.detail.value.code.length == 0) {
      wx.showToast({
        title: '验证码有误',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else {
      let url = '/gc-tenant-api/userApplet/smsLogin';
      let params = {
        uuid: uuid,
        phone: e.detail.value.phone,
        smsCode: e.detail.value.code,
        avatar: avatar,
        nickname: nickname,
        openid: openid,
      }
      network.networkpost(url, params, app).then(() => {
        if (app.netWorkData.result.code == 1) {
          wx.showToast({
            title: app.netWorkData.result.msg,//这里打印出提交成功
            image: '/images/index/success.png',
            duration: 2000
          })
          wx.setStorageSync('mid', app.netWorkData.result.data.appUserId);
          wx.setStorageSync('isMerchant', app.netWorkData.result.data.isMerchant);
          wx.setStorageSync('accessToken', app.netWorkData.result.data.accessToken);
          wx.reLaunch({
            url: '../index/index',
          })
        } else {
          network.codeResolve(app.netWorkData.result)
        }
      })
    }
  },

  // 获取手机号
  getPhoneNumber(e) {
    let that = this;

    let msg = e.detail.errMsg;
    let encryptedDataStr = e.detail.encryptedData;
    let iv = e.detail.iv;
    if (msg == 'getPhoneNumber:ok') {
      wx.checkSession({
        success: function () {
          that.wxLogin(that.data.code, encryptedDataStr, iv)
        },
        fail: function () {
          wx.showToast({
            title: '网络异常!',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  //微信登录
  wxLogin(code, encryptedDataStr, iv) {
    wx.request({
      url: app.a.Url + '/gc-tenant-api/userApplet/getPhone',
      data: {
        code: code,
        iv: iv,
        encryptedData: encryptedDataStr
      },
      success: function (res) {
        if (res.data.code == 1 && res.data != null) {
          wx.request({
            url: app.a.Url + '/gc-tenant-api/userApplet/wxlogin',
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "accessToken": wx.getStorageSync('accessToken')
            },
            data: {
              phone: res.data.data.phoneNumber,
              openid: res.data.data.openid
            },
            success: function (res) {
              if (res.data.code == 1) {
                wx.setStorageSync('mid', res.data.data.id);
                wx.setStorageSync('accessToken', res.data.data.accessToken);
                wx.setStorageSync('isMerchant', res.data.data.isMerchant);
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  // 切换导航栏
  switchTab: function (e) {
    let cur = e.currentTarget.dataset.current;
    console.log("cur:" + cur)
    if (cur == this.data.currentTab) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
      })
    }
  },

  // 图形验证码
  codeImg: function (e) {
    this.setData({
      imgCode: e.detail.value
    })
  },

  //刷新验证码
  onTap() {
    let that = this;
    let url = '/gc-tenant-api/userApplet/verifyCode';
    let params = {
      captcha: 'zhuce'
    }
    network.refleshCode(url, params, app).then(() => {
      that.setData({
        codeUrl: app.netWorkData.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.onTap()
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