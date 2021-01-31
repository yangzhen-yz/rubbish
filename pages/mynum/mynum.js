const app = getApp();
const network = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myScore: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 是否完善信息
  perfectInfo: function () {
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
            url: '../withdraw/withdraw'
          })
        }
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },


  // 积分提现
  withdraw: function () {
    let that = this;

    // 查询是否绑定手机号和微信号
    let url1 = '/gc-tenant-api/userApplet/checkMobileBind';
    let params1 = {};
    network.networkget(url1, params1, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let isbindWx = app.netWorkData.result.data.isBindWx
        if (isbindWx) {
          that.perfectInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '请先绑定微信',
            confirmText: '去绑定',
            confirmColor: '#47AED3',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../selfInfo/selfInfo',
                })
              }
            }
          })
        }
      } else {
        network.codeResolve(app.netWorkData.result)
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
    let that = this;

    let url = '/gc-tenant-api/userApplet/selectUserIntegral';
    let params = {}
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          myScore: app.netWorkData.result.data,
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