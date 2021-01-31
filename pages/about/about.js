const app = getApp();
const network = require('../../utils/api')

var longitude = '';
var latitude = '';
var market = [];

// 定位
Page({
  data: {
    scale: '14', //缩放
    Height: '0',
    controls: '40',//中心点
    latitude: '',
    longitude: '',
    markers: [],
    isShow: false,
    relignList: '',
    recycleList: '',
    deviceId: ''
  },

  // 列表模式
  listType: function () {
    wx.navigateTo({
      url: '../equipmentList/equipmentList',
    })
  },

  // 折叠
  fold: function () {
    this.setData({
      isShow: false
    })
  },

  // 展开(通过id查询设备)
  unfold: function () {
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectDeviceById';
    let params = {
      deviceId: this.data.deviceId,
      longitude: longitude,
      latitude: longitude
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          recycleList: app.netWorkData.result.data.rubbishTypes,
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
    that.setData({
      isShow: true
    })
  },

  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
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
        console.log("纬度：" + res.latitude);
        console.log("经度：" + res.longitude)

        wx.setStorageSync('latitude', latitude);
        wx.setStorageSync('longitude', longitude);

        that.setData({
          markers: market,
          scale: 14,
          longitude: longitude,
          latitude: latitude
        })
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

  // 页面加载
  onLoad: function () {
    wx.showLoading({ title: '加载中' });
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
              wx.showModal({
                title: '提示',
                content: '此功能需获取位置信息，请授权',
                success: function (res) {
                  if (res.confirm == false) {
                    return false;
                  }
                  wx.openSetting({
                    success(res) {
                      //如果再次拒绝则返回页面并提示
                      if (!res.authSetting['scope.userLocation']) {
                        wx.showToast({
                          title: '此功能需获取位置信息，请重新设置',
                          duration: 3000,
                          icon: 'none'
                        })
                      } else {
                        //允许授权，调用地图
                        that.onLoad()
                      }
                    }
                  })
                }
              })
            }
          })
        } else {
          that.getLocation();
        }
      }
    })

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        that.setData({
          view: {
            Height: res.windowHeight
          },
        })
      }
    })
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    wx.hideLoading()
  },

  // 点击标记点对应的气泡时触发
  bindcallouttap: function (e) {
    let id = e.detail.markerId;
    for (var i = 0; i < this.data.markers.length; i++) {
      if (this.data.markers[i]['id'] == id) {
        let relignList = this.data.markers[i];
        if (relignList.distance < 1000) {
          relignList.distance = parseInt(relignList.distance);
          relignList.unit = 'm';
        } else {
          relignList.distance = (parseInt(relignList.distance) / 1000).toFixed(1);
          relignList.unit = 'km';
        }
        this.setData({
          relignList: relignList
        })
      }
    }
  },

  // 定位当前位置的markers
  markertap: function (e) {
    let id = e.detail.markerId;
    for (var i = 0; i < this.data.markers.length; i++) {
      if (this.data.markers[i]['id'] == id) {
        let relignList = this.data.markers[i];
        if (relignList.distance < 1000) {
          relignList.distance = parseInt(relignList.distance);
          relignList.unit = 'm';
        } else {
          relignList.distance = (parseInt(relignList.distance) / 1000).toFixed(1);
          relignList.unit = 'km';
        }
        this.setData({
          relignList: relignList
        })
      }
    }
  },


  // 导航
  toLocation: function (e) {
    let lati = e.currentTarget.dataset.lati;
    let long = e.currentTarget.dataset.long;
    if (lati != null && long != null) {
      wx.openLocation({
        latitude: parseFloat(lati),
        longitude: parseFloat(long),
        scale: 14
      })
    }
  },

  //点击缩放按钮动态请求数据
  controltap: function (e) {
    this.moveToLocation()
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  // 创建标记点
  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;
    let marker = {
      iconPath: "/images/index/glocation.png",
      id: point.deviceId || 0,
      community: point.community || '',
      address: point.address || '',
      distance: point.distance,
      state: point.state,
      operation_time: point.operation_time,
      latitude: latitude,
      longitude: longitude,
      label: {
        x: -24,
        y: -26,
      },
      width: 30,
      height: 35,
      callout: {
        content: point.community || '',
        fontSize: 14,
        bgColor: "#FFF",
        borderWidth: 1,
        borderColor: "#CCC",
        padding: 4,
        display: "ALWAYS",
        textAlign: "center"
      }
    };
    return marker;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.setData({
      latitude: wx.getStorageSync('latitude'),
      longitude: wx.getStorageSync('longitude'),
    })
    // latitude = latitude == '' ? 33.564856 : latitude;
    // longitude = longitude == '' ? 114.039803 : longitude;

    let url = '/gc-tenant-api/userApplet/selectAllDevice';
    let params = {
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude')
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let list1 = app.netWorkData.result.data[0];

        if (list1.distance < 1000) {
          list1.distance = parseInt(list1.distance);
          list1.unit = 'm'
        } else {
          list1.distance = (parseInt(list1.distance) / 1000).toFixed(1);
          list1.unit = 'km'
        }
        that.setData({
          deviceId: list1.deviceId
        })
        for (let item of app.netWorkData.result.data) {
          let marker1 = that.createMarker(item);
          market.push(marker1)
        }
        that.setData({
          markers: market,
          relignList: list1
        })
      } else {
        that.setData({
          markers: '',
          relignList: ''
        })
      }
    })
  },
})

