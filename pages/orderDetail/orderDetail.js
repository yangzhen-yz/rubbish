const app = getApp();
const network = require('../../utils/api.js')
const utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: '',
    staffImg: '',
  },

  // 选择图片
  previewImg: function (data) {
    let that = this;
    wx.previewImage({
      current: data.currentTarget.dataset.item,
      urls: that.data.orderDetail.picList,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      id: options.data1
    })

    let url = '/gc-tenant-api/userApplet/selectReserveDetail';
    let params = {
      reserveId: options.data1
    }
    network.networkpost(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let orderDetail = app.netWorkData.result.data;
        console.log('orderDetail'+JSON.stringify(orderDetail))

        // orderDetail.phone = utils.formatPhone(orderDetail.phone);
        orderDetail.staffPhone = utils.formatPhone(orderDetail.staffPhone)
        that.setData({
          orderDetail: orderDetail,
          staffImg: app.netWorkData.result.data.rubbishes
        })
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

  },
})