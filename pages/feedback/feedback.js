const app = getApp();
const network = require('../../utils/api.js');
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    img_arr: [],
    isShow: true,
    phone: ''
  },

  // 上传图片
  upImg: function () {
    let that = this;
    if (this.data.img_arr.length < 4) {
      that.setData({
        isShow: true
      })
      wx.chooseImage({
        sizeType: ['compressed'],
        count: 4,
        success: function (res) {
          that.data.img_arr.concat(res.tempFilePaths);
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
        }
      })
    } else {
      that.setData({
        isShow: false
      })
      wx.showToast({
        title: '最多上传四张图片',
        icon: 'loading',
        duration: 2000
      });
    }
  },

  //删除图片
  delImage: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let imgList = this.data.img_arr;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      confirmColor: '#47AED3',
      cancelColor: '#47AED3',
      success(res) {
        if (res.confirm) {
          imgList.splice(index, 1);
          that.setData({
            img_arr: imgList
          })
          if (that.data.img_arr.length < 4) {
            that.setData({
              isShow: true
            })
          }
        } else if (res.cancel) {

        }
      }
    })
  },
  // 格式化手机号
  phoneFormat: function (e) {
    let phone = e.detail.value;
    if (phone) {
      const matchs = /^(\d{3})(\d{4})(\d{4})$/.exec(phone)
      if (matchs) {
        return matchs[1] + '-' + matchs[2] + '-' + matchs[3]
      }
    }
  },


  // 查询用户信息
  selfInfo: function () {
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectUserInfo';
    let params = {}
    network.networkget(url, params, app).then(() => {
      wx.hideLoading();
      if (app.netWorkData.result.code == 1) {
        that.setData({
          phone: app.netWorkData.result.data.phone
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
    this.selfInfo();
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

  // 提交
  formSubmit: function (e) {
    let that = this;
    let regMobile = /^1\d{10}$/;
    if (that.data.disabled == true) {
      return false;
    }
    if (!regMobile.test(e.detail.value.mobile)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
    }
    else if (e.detail.value.problem == 0) {
      wx.showToast({
        title: '请填写意见哦',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else {
      let imgUrl = new Array();
      if (that.data.img_arr.length == 0) {
        imgUrl = ''
      } else {
        for (var i = 0; i < that.data.img_arr.length; i++) {
          imgUrl[i] = wx.getFileSystemManager().readFileSync(that.data.img_arr[i], "base64");
          console.log(JSON.stringify(imgUrl))
        }
      }
      wx.showLoading({ title: '提交中' });
      that.setData({
        disabled: true
      })
      let url = '/gc-tenant-api/userApplet/submitFeedback';
      let params = {
        opinion: e.detail.value.problem,
        phone: e.detail.value.mobile,
        imgJson: imgUrl
      }
      network.networkpost(url, params, app).then(() => {
        wx.hideLoading();
        if (app.netWorkData.result.code == 1) {
          wx.showToast({
            title: '提交成功',//这里打印出提交成功
            image: '/images/index/success.png',
            duration: 3000
          })
          wx.navigateTo({
            url: '../feedbackSuccess/feedbackSuccess'
          })
        } else {
          network.codeResolve(app.netWorkData.result)
        }
      })
    }
  },
})