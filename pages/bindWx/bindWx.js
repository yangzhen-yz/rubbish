const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false
  },

  // 绑定微信
  bindWx: function (openid) {
    let that = this;
    let url = '/gc-tenant-api/userApplet/bindWx';
    let params = {
      openid: openid,
      avatar: wx.getStorageSync('avatarUrl'),
      nickname: wx.getStorageSync('nickName')
    }
    network.networkpost(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 1500
        })
        that.setData({
          disabled: false
        })
        console.log("openid"+app.netWorkData.result.data)
        wx.setStorageSync('openid', app.netWorkData.result.data)
        wx.navigateBack({
          url: '../selfInfo/selfInfo'
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  //检查openid是否存在
  checkOpenid: function (openid) {
    let that = this;
    wx.request({
      url: app.a.Url + '/gc-tenant-api/userApplet/checkOpenid',
      header: {
        "accessToken": wx.getStorageSync('accessToken')
      },
      data: {
        openid: openid
      }, success: function (res) {
        switch (res.data.code) {
          case 0:
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            break;
          case 1:
            wx.showToast({
              title: '此微信账号已存在',
              icon: 'none',
              duration: 2000
            })
            break;
          case 2:
            that.bindWx(openid)
        }
      }
    })
  },

  // 获取用户信息
  getUserInfo: function (e) {
    let openid = wx.getStorageSync('openid');
    this.setData({
      disabled: true
    })
    if (openid == '') {
      wx.showLoading({
        title: '正在授权',
        icon: 'none',
        duration: 2000
      })
      if (e.detail.value == undefined) {
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) { //是否已经授权
              var that = this;
              wx.login({
                success: function (res) {
                  let code = res.code;

                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      let iv = res.iv;
                      let encryptedData = res.encryptedData;

                      wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
                      wx.setStorageSync('nickName', res.userInfo.nickName);

                      wx.request({
                        url: app.a.Url + "/gc-tenant-api/userApplet/getOpenid",
                        header: {
                          "accessToken": wx.getStorageSync('accessToken')
                        },
                        data: {
                          code: code,
                          iv: iv,
                          encryptedData: encryptedData
                        },
                        success: function (resp) {
                          if (resp.data.code == 1) {
                            let openid = resp.data.data.userInfo.openId;
                            if (openid != '') {
                              wx.showToast({
                                title: '授权成功',
                                image: '/images/index/success.png',
                              })
                              that.checkOpenid(openid);
                            }
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'none',
                              duration: 2000
                            })
                            return;
                          }
                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
      }
    } else {
      wx.showToast({
        title: '该微信号已绑定',
        icon: 'none',
        duration: 2000
      })
    }
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