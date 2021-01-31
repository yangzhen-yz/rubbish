const app = getApp();
const network = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img_arr: '',
    img_arr1: '',
    img_arr2: '',
    img_arr3: '',

    isShow: true,
    isShow1: true,
    isShow2: true,
    isShow3: true,

    businessInfo: ''
  },

  // 上传门头照片
  upImg: function () {
    let that = this;
    wx.chooseImage({
      sizeType: ['original','compressed'],
      count: 1,
      success: function (res) {
        that.setData({
          img_arr: res.tempFilePaths,
          isShow: false
        })
      }
    })
  },

  // 上传身份证人身像
  upImg1: function (res) {
    let that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      count: 1,
      success: function (res) {
        that.setData({
          img_arr1: res.tempFilePaths,
          isShow1: false
        })
      }
    })
  },

  // 上传身份证国徽像
  upImg2: function (res) {
    let that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      count: 1,
      success: function (res) {
        that.setData({
          img_arr2: res.tempFilePaths,
          isShow2: false
        })
      }
    })
  },

  // 上传营业执照
  upImg3: function (res) {
    let that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      count: 1,
      success: function (res) {
        that.setData({
          img_arr3: res.tempFilePaths,
          isShow3: false
        })
        console.log(res.tempFilePaths)
      }
    })
  },

  // 是否为空
  isnull(data) {
    if (data == null || data == '') {
      return true
    } else {
      return false
    }
  },

  //表单提交
  formSubmit: function (e) {
    let that = this;
    console.log(JSON.stringify(e))

    if (this.isnull(e.detail.value.legalPerson)) {
      wx.showToast({
        title: '请输入法人姓名',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (this.isnull(e.detail.value.contactName)) {
      wx.showToast({
        title: '请输入联系人',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (this.isnull(e.detail.value.contactPhone)) {
      wx.showToast({
        title: '请输入联系电话',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (this.isnull(e.detail.value.shopAddress)) {
      wx.showToast({
        title: '请输入商铺地址',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (that.data.img_arr.length == 0) {
      wx.showToast({
        title: '请上传门店照片',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (that.data.img_arr1.length == 0) {
      wx.showToast({
        title: '请上传正面照片',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (that.data.img_arr2.length == 0) {
      wx.showToast({
        title: '请上传国徽面',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (that.data.img_arr3.length == 0) {
      wx.showToast({
        title: '请上传营业执照',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定提交吗',
        // showCancel: true,//是否显示取消按钮
        // cancelText:"否",//默认是“取消”
        cancelColor: '#47AED3',//取消文字的颜色
        confirmColor: '#47AED3',//确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else if (res.confirm) {

            wx.showToast({
              title: '保存中...',
              icon: 'loading',
            })
            that.upload(e.detail.value);
          }
        }
      })
    }
  },

  // 上传
  upload: function (adds) {
    let that = this;

    let storePicBase64;
    let idPicFigureBase64;
    let idPicFrontBase64;
    let businessLicenseBase64;

    if (this.data.img_arr == '') {
      storePicBase64 = ''
    } else {
      storePicBase64 = wx.getFileSystemManager().readFileSync(that.data.img_arr.toString(), "base64");
    }

    if (this.data.img_arr1 == '') {
      idPicFigureBase64 = ''
    } else {
      idPicFigureBase64 = wx.getFileSystemManager().readFileSync(that.data.img_arr1.toString(), "base64");
    }

    if (this.data.img_arr2 == '') {
      idPicFrontBase64 = ''
    } else {
      idPicFrontBase64 = wx.getFileSystemManager().readFileSync(that.data.img_arr2.toString(), "base64");
    }

    if (this.data.img_arr3 == '') {
      businessLicenseBase64 = ''
    } else {
      businessLicenseBase64 = wx.getFileSystemManager().readFileSync(that.data.img_arr3.toString(), "base64");
    }

    wx.showLoading({
      title: '提交中',
    })

    let url = '/gc-tenant-api/userApplet/applyMerchant';
    let params = {
      legalPerson: adds.legalPerson,
      contactsName: adds.contactName,
      contactsPhone: adds.contactPhone,
      address: adds.shopAddress,
      storePicBase64: storePicBase64,
      idPicFigureBase64: idPicFigureBase64,
      idPicFrontBase64: idPicFrontBase64,
      businessLicenseBase64: businessLicenseBase64
    };
    network.networkpost(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        wx.showToast({
          title: '已提交！',
          duration: 2000
        });
        wx.navigateTo({
          url: '../dataAudition/dataAudition'
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  //删除图片
  delImage: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.img;
    console.log('index' + index)
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        console.log(JSON.stringify(res))
        if (res.confirm) {
          switch (index) {
            case 0:
              that.setData({
                img_arr: '',
                isShow: true
              });
              break;
            case 1:
              that.setData({
                img_arr1: '',
                isShow1: true
              });
              break;
            case 2:
              that.setData({
                img_arr2: '',
                isShow2: true
              });
              break;
            case 3: that.setData({
              img_arr3: '',
              isShow3: true
            });
              break;
          }
        }
      }
    })
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