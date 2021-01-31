// pages/realname/realname.js
const app = getApp();
const network = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist: '',
    addressid: '',
    objectArray: '',
    objectIndex: 0,
    sex: '',
    showModal: false,
    disabled: false
  },

  // 选择小区
  bindPickerChange: function (e) {
    this.setData({
      objectIndex: e.detail.value
    })
    if (e.detail.value == 1) {
      this.setData({
        showModal: true
      })
    } else {
      this.setData({
        showModal: false
      })
    }
  },

  // 性别
  radioChange: function (e) {
    let value = e.detail.value;
    this.setData({
      sex: value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: '加载中', duration: 2000 })
    var mid = wx.getStorageSync('mid');
    var that = this;
    var addresslist = ["0", "999999999",];
    // 小区
    wx.request({
      url: app.a.Url + '/xiaoqu',
      method: "GET",
      header: {
        "accessToken": wx.getStorageSync('accessToken')
      },
      success: function (res) {
        wx.hideLoading()
        for (var i = 0; i < res.data.data.length; i++) {
          addresslist.push(res.data.data[i].id)
        }
        console.log(res.data.data)
        that.setData({
          objectArray: [{ home: "点击滑动选择", id: 0 }, { home: "其他", id: 999999999 }].concat(res.data.data),
          addresslist: addresslist
        })
        console.log(addresslist)
      }
    })

    wx.request({
      url: app.a.Url + '/member',
      method: "GET",
      header: {
        "accessToken": wx.getStorageSync('accessToken')
      },
      data: {
        mid: mid
      },
      success: function (res) {
        wx.hideLoading()
        console.log('会员信息')
        console.log(res.data)
        that.setData({
          memdata: res.data.data
        })
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

  },
  formSubmit: function (e) {
    console.log(e.detail.value)
    var mid = wx.getStorageSync('mid');
    var that = this;
    console.log(e.detail.value.addressid)
    e.detail.value.addressid = that.data.addresslist[e.detail.value.addressid];
    var sex = that.data.sex;
    console.log(e.detail.value.floor1 + "-" + e.detail.value.floor2 + "-" + e.detail.value.floor3)
    console.log(e.detail.value.addressid)
    var address = e.detail.value.address
    if (that.data.disabled == true) {
      return false;
    }
    if (e.detail.value.member_name == 0) {
      wx.showToast({
        title: '请填写姓名',
        image: '/images/index/fail.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1500)
    } else if (e.detail.value.age == 0) {
      wx.showToast({
        title: '请填写年龄',
        image: '/images/index/fail.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1500)
    } else if (e.detail.value.addressid == 0) {
      wx.showToast({
        title: '请选择小区',
        image: '/images/index/fail.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1500)
    } else if (sex == null || sex == '') {
      wx.showToast({
        title: '请选择性别',
        image: '/images/index/fail.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1500)
    } else if (e.detail.value.floor1 == 0 && e.detail.value.floor2 == 0 && e.detail.value.floor3 == 0) {
      wx.showToast({
        title: '请填写家庭住址',
        image: '/images/index/fail.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1500)
    } else {
      wx.showLoading({ title: '提交中' })
      that.setData({
        disabled: true
      })
      wx.request({
        url: app.a.Url + '/meminfo',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "accessToken": wx.getStorageSync('accessToken')
        },
        method: "POST",
        data: {
          member_name: e.detail.value.member_name,
          age: e.detail.value.age,
          floor: e.detail.value.floor1 + "-" + e.detail.value.floor2 + "-" + e.detail.value.floor3,
          convenience_id: e.detail.value.addressid,
          mid: mid,
          sex: sex,
          address: address,
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.msg,
              image: '/images/index/fail.png',
              duration: 1500
            })
          } else {
            wx.showToast({
              title: res.data.msg,//这里打印出提交成功
              image: '/images/index/success.png',
              duration: 1500
            }),
              wx.reLaunch({
                url: '../user/user'
              })
          }
        },
        fail: function () {
          wx.showToast({
            title: '服务器网络错误!',
            image: '/images/index/fail.png',
            duration: 1500
          })
        }
      })
    }
  },
  go() {
    wx.reLaunch({
      url: '../user/user'
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