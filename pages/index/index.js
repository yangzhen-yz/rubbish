const app = getApp();
const network = require('../../utils/api.js')

var longitude = '';
var latitude = '';
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    scroll_y: true,

    appealPhone: '',
    currentIntegral: 0,

    errorDevices: '',
    bannerUrls: '',
    newArticles: '',
    newPrices: '',
    nearbyDevice: '',

    city: '',
    district: '',
    mid: ''
  },

  // 去帮助中心
  toHelp: function () {
    wx.navigateTo({
      url: '../proCenter/proCenter',
    })
  },

  // 是否登录
  isLogin() {
    let mid = wx.getStorageSync('mid');
    if (mid == '' || mid == null) {
      wx.showModal({
        title: '没有登录',
        content: '登录后即可查看更多信息',
        confirmColor: '#29A7F1FF',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../login/login',
            })
          }
        }
      })
      return false;
    } else {
      return true;
    }
  },

  // 垃圾分类
  rubbishType: function () {
    wx.navigateTo({
      url: '../rubbishType/rubbishType',
    })
  },

  // 预约回收
  orderRecycle() {
    if (this.isLogin()) {
      wx.navigateTo({
        url: '../orderRecycle/orderRecycle',
      })
    }
  },

  // 点我查看
  myIntegration() {
    if (this.isLogin()) {
      wx.navigateTo({
        url: '../mynum/mynum'
      })
    }
  },

  // 附近回收机
  moreDevice(e) {
    wx.navigateTo({
      url: '../equipmentList/equipmentList?data1=' + e.currentTarget.dataset.key
    })
  },

  // 一键预约
  calling: function () {
    var that = this;
    if (this.isLogin()) {
      wx.makePhoneCall({
        phoneNumber: that.data.appealPhone,
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    }
  },

  // 查看更多资讯
  moreNews() {
    wx.navigateTo({
      url: '../newsList/newsList'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.navigateTabBar();
    let that = this;

    wx.getSetting({
      success(res) {
        //若用户没有授权地理位置
        if (!res.authSetting['scope.userLocation']) {
          //在调用需授权 API 之前，提前向用户发起授权请求
          wx.authorize({
            scope: 'scope.userLocation',
            //用户同意授权
            success() {
              // 用户已经同意小程序使用地理位置，后续调用 wx.getLocation 接口不会弹窗询问
              that.getLocation();
            },
            // 用户不同意授权
            fail() {
              wx.showToast({
                title: '获取位置失败',
                image: '/images/index/fail.png',
                duration: 2000
              })
            }
          })
        } else {
          that.getLocation();
        }
      }
    })

    // 获取系统屏幕
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
    // 平台信息
    this.platInfo();
    // 首页数据(无参)
    this.homeData();

  },

  // 获取经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        // 经纬度
        longitude = res.longitude;
        latitude = res.latitude;

        wx.setStorageSync('longitude', longitude);
        wx.setStorageSync('latitude', latitude);

        console.log("经度1：" + res.longitude);
        console.log("纬度1：" + res.latitude);

        // 构建请求地址
        // let qqMapApi = 'http://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + latitude + ',' +
        //   longitude + "&key=" + 'FXRBZ-UT33U-426VM-B6QG4-HNNIF-GKFYY' + "&get_poi=1";

        // that.sendRequest(qqMapApi);
      },
      fail: function () {
        wx.showToast({
          title: '获取位置失败',
          image: '/images/index/fail.png',
          duration: 2000
        })
      }
    })
  },

  // 导航到此
  toLocation: function () {
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      scale: 14
    })
  },

  /**
   * 发送请求获取地图接口的返回值
   */
  sendRequest: function (qqMapApi) {
    let that = this;
    wx.request({
      url: qqMapApi,
      method: 'GET',
      success: (res) => {
        if (res.statusCode == 200 && res.data.status == 0) {
          console.log(res.data)
          // 从返回值中提取需要的业务地理信息数据
          that.setData({ nation: res.data.result.address_component.nation });
          that.setData({ province: res.data.result.address_component.province });
          that.setData({ city: res.data.result.address_component.city });
          that.setData({ district: res.data.result.address_component.district });
          that.setData({ street: res.data.result.address_component.street });
        }
      }
    })
  },

  // 查询首页信息(无参)
  homeData: function () {
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectHomeData';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let newArticles = app.netWorkData.result.data.newArticles;
        let news = []
        for (var i = 0; i < 5; i++) {
          news[i] = newArticles[i]
        }
        that.setData({
          newArticles: news,
          errorDevices: app.netWorkData.result.data.errorDevices,
          bannerUrls: app.netWorkData.result.data.bannerUrls
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 查询附近回收机信息(有参)
  nearbyDevice: function () {
    let that = this;

    let url = '/gc-tenant-api/userApplet/selectHomeDevice';
    let params = {
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude')
    };
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          nearbyDevice: app.netWorkData.result.data.nearbyDevice,
        })
      } else {
        that.setData({
          nearbyDevice: ''
        })
      }
    })
  },

  // 平台信息
  platInfo: function () {
    let that = this;
    let url = '/gc-tenant-api/staffApplet/selectPlatformInfo';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          phonedata: app.netWorkData.result.data.servicePhone,
          appealPhone: app.netWorkData.result.data.appealPhone,
          logo: app.netWorkData.result.data.logo,
        })
        wx.setStorageSync('phonedata', app.netWorkData.result.data.servicePhone);
        wx.setStorageSync('logo', app.netWorkData.result.data.logo);
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 个人积分
  selfIntegral: function () {
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectUserIntegral';
    let params = {};
    network.networkpost(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          currentIntegral: app.netWorkData.result.data
        })
        that.selectPhone();
      }
    })
  },

  // 查询待入账积分
  unenforcedScore: function () {
    let that = this;

    let url = '/gc-tenant-api/userApplet/selectUserCenterData';
    let params = {};
    network.networkget(url, params, app).then(() => {
      let tempData = app.netWorkData.result;
      if (tempData.code == 1) {
        that.setData({
          unenforcedIntegral: tempData.data.no_effect_integral,
        })
      }
    })
  },

  // 查询手机号
  selectPhone: function () {
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectPhone';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          phone: app.netWorkData.result.data
        })

        if(app.netWorkData.result.data==''){
          wx.showModal({
            title: '提示',
            content: '请尽快绑定手机号，绑定后可获得更好的服务',
            confirmColor: '#47AED3',
            cancelColor: '#47AED3',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../bindPhone/bindPhone',
                })
              }
            }
          })
        }
        wx.setStorageSync('phone', app.netWorkData.result.data)
      }
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
    // 个积分
    this.selfIntegral();
    // 附近回收机
    this.nearbyDevice();
    this.setData({
      mid: wx.getStorageSync('mid')
    })
    // 待入账积分
    this.unenforcedScore();

  

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