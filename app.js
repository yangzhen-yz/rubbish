// const url = 'https://wxapp.g0356.cn'
const url = 'https://gc.i0356.cn';
App({
  a: {
    Url: url,
    defaultName: '獭獭',
    defaultImg: '/images/user/avatar.png'
  },
  netWorkData: {
    result: ''
  },

  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs)
  },

  // 获取用户信息
  getUserInfo: function (cb) {
    let openid = wx.getStorageSync('openid');
    if (this.globalData.userInfo && openid) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) { //是否已经授权
            let that = this;
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
                      url: url + '/gc-tenant-api/userApplet/getOpenid',
                      data: {
                        code: code,
                        iv: iv,
                        encryptedData: encryptedData
                      },
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      }, success: function (resp) {
                        switch (resp.data.code) {
                          case 1:
                            let openid = resp.data.data.userInfo.openId;
                            if (openid != '') {
                              wx.showToast({
                                title: '授权成功',
                                image: '/images/index/success.png',
                              })
                              that.checkOpenid(openid);
                            } else {
                              wx.showToast({
                                title: '授权失败',
                                image: '/images/index/fail.png',
                                duration: 1500
                              })
                            }
                            break;
                          case 0:
                            wx.showToast({
                              title: resp.data.msg,
                              icon: 'none',
                              duration: 2000
                            })
                            break;
                          case -1:
                            wx.showToast({
                              title: '网络异常',
                              icon: 'none',
                              duration: 2000
                            })
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
  },

  // 校验openid
  checkOpenid: function (data) {
    wx.request({
      url: url + '/gc-tenant-api/userApplet/checkOpenid',
      header: {
        "accessToken": wx.getStorageSync('accessToken')
      },
      data: {
        openid: data
      }, success: function (res) {
        switch (res.data.code) {
          case 0:
            wx.showToast({
              title: res.data.msg,
              duration: 1500
            })
            break;
          case 1:
            wx.setStorageSync('mid', res.data.data.appUserId);
            wx.setStorageSync('accessToken', res.data.data.accessToken);
            wx.setStorageSync('isMerchant', res.data.data.isMerchant);
            wx.reLaunch({
              url: '../index/index',
            })
            break;
          case 2:   //微信号未注册
          console.log("openid"+data)
            wx.request({
              url: url + '/gc-tenant-api/userApplet/wxlogin',
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "accessToken": wx.getStorageSync('accessToken')
              },
              data: {
                avatar: wx.getStorageSync("avatarUrl"),
                nickname: wx.getStorageSync('nickName'),
                openid: data
              }, success: function (res) {
                console.log("微信注册"+JSON.stringify(res.data))
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
            break;
          case -1:
            wx.showToast({
              title: '网络异常',
              duration: 1500
            })
        }
      }
    })
  },

  // 底部导航
  navigateTabBar1: function () {
    let tabbar = this.globalData1.tabbar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);

    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  //页面内底部导航
  navigateTabBar: function () {
    let tabbar = this.globalData.tabbar;
    let currentPages = getCurrentPages();
    let _this = currentPages[0];
    let pagePath = _this.__route__;

    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  globalData: {
    userInfo: null,
    tabbar: {
      color: "#9F9F9F",
      selectedColor: "#333333",
      backgroundColor: "#ffffff",
      borderStyle: "#f0f0f0",
      list: [
        {
          pagePath: "/pages/index/index",
          text: "首页",
          iconPath: "/images/user/index.png",
          selectedIconPath: "/images/user/index_active.png"
        },
        {
          pagePath: "/pages/about/about",
          text: "附近设备",
          iconPath: "/images/user/location.png",
          selectedIconPath: "/images/user/location_active.png"
        },
        {
          pagePath: "/pages/rank/rank",
          text: "排行榜",
          iconPath: "/images/user/rank.png",
          selectedIconPath: "/images/user/rank_active.png"
        },
        {
          pagePath: "/pages/user/user",
          text: "个人中心",
          iconPath: "/images/user/my.png",
          selectedIconPath: "/images/user/my_active.png"
        }
      ],
      position: "bottom"
    }
  },

  globalData1: {
    tabbar: {
      color: "#9F9F9F",
      selectedColor: "#333333",
      backgroundColor: "#ffffff",
      borderStyle: "#f0f0f0",
      list: [
        {
          pagePath: "/pages/orderRecycle/orderRecycle",
          text: "预约回收",
          iconPath: "/images/type/order-recycle1.png",
          selectedIconPath: "/images/type/order-recycle.png",
          selected: false
        },
        {
          pagePath: "/pages/order/order",
          text: "我的订单",
          iconPath: "/images/type/myorder1.png",
          selectedIconPath: "/images/type/myorder.png",
          selected: true
        }
      ],
      position: "bottom"
    }
  }
})