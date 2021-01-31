const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_y: true,
    adImg: '',
    pleaseSelect: '请选择您要回收的类型',
    recycleList: '',
    isShow: true,
    recyclePrice: ''
  },

  // 申请成为商家
  applyPrompt: function () {
    let that = this;

    let url1 = '/gc-tenant-api/userApplet/selectMerchantInfo';
    let params1 = {};
    network.networkpost(url1, params1, app).then(() => {

      switch (app.netWorkData.result.code) {
        case 1:
          let tempData = app.netWorkData.result.data
          if (tempData != '') {
            wx.showModal({
              title: '提示',
              content: '您已提交过申请，请耐心等待结果',
              confirmColor: '#47AED3',
              cancelColor: '#47AED3',
              confirmText: '查看',
              cancelText: '关闭',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../businessInfo/businessInfo',
                  })
                }
              }
            })
          } else {
            that.applyBusiness()
          }
          break;
        case 0:
          that.applyBusiness()
          break;
        default:
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
      }
    })
  },

  // 预约申请
  applyBusiness: function () {
    let value = wx.getStorageSync("isMerchant");
    if (value == 1) {
      wx.showToast({
        title: '你已是商家',
        duration: 2000,
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../applyPrompt/applyPrompt',
      })
    }
  },


  // 马上预约
  toOrder: function (e) {
    let index = e.currentTarget.dataset.index;
    let recycleName = e.currentTarget.dataset.name;

    let url = '/gc-tenant-api/userApplet/selectUserInfo';
    let params = {};
    network.networkpost(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let userInfo = app.netWorkData.result.data;

        let name = userInfo.name;
        let sex = userInfo.sex;
        let age = userInfo.age;
        let community = userInfo.community.name;
        let address1 = userInfo.address1;
        let address2 = userInfo.address2;
        let address3 = userInfo.address3;

        if (name == null || sex == null || age == null || community == null || address1 == null || address2 == null || address3 == null) {
          wx.showModal({
            title: '您还没有完善信息',
            content: '完善个人信息后,可快速预约',
            confirmColor: '#47AED3',
            cancelColor: '#47AED3',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../perfectInfo/perfectInfo',
                })
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '../appForm/appForm?data1=' + index + '&data2=' + recycleName,
          })
        }
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })

  },

  // 图片
  adImg: function () {
    let that = this;

    let url = '/gc-tenant-api/userApplet/selectAd';
    let params = {
      location: 1
    }
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          adImg: app.netWorkData.result.data.url
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 查询最新回收价格
  recyclePrice: function () {
    let that = this;
    let isMerchant = wx.getStorageSync('isMerchant') == 1 ? 1 : 0;

    let url = '/gc-tenant-api/userApplet/getReserveHomePrice';
    let params = {
      isMerch: isMerchant
    }
    network.networkpost(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let recyclePrice = app.netWorkData.result.data;
        let length = 0;
        for (var i = 0; i < recyclePrice.length; i++) {
          length += recyclePrice[i].children.length
        }
        console.log("length" + length)
        that.setData({
          recyclePrice: recyclePrice,
          length: length
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
    app.navigateTabBar1();
    this.adImg();
    this.recyclePrice();
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
    let isMerchant = wx.getStorageSync('isMerchant');
    this.setData({
      isMerchant: isMerchant
    })

    let that = this;
    let url = '/gc-tenant-api/userApplet/getReserveHomeData';
    let params = {};
    network.networkpost(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          recycleList: app.netWorkData.result.data.list
        })
      } else {
        network.codeResolve(app.netWorkData.result)
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