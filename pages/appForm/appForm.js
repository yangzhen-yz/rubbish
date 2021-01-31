const app = getApp();
const network = require('../../utils/api')
const utils = require('../../utils/util')
var list1 = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    serviceTime: '',
    phonedata: '',
    notes: '',
    showModal: false,
    showPicker: false,
    firstShow: false,
    list: [],
    list1: [],
    chooseList: [],
    disabled: false,
    img_arr: [],
    detailAddress: '',
    userInfo: ''
  },

  // 点击picker元素事件	
  chooseItem(e) {
    let that = this

    let val = e.currentTarget.dataset.id;
    let arr = that.data.chooseList;
    console.log("渲染前" + JSON.stringify(arr));

    let flag = [];
    let index = '';

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == val) {
        index = i;
        flag = `chooseList[${i}].flag`
      }
    }

    if (that.data.chooseList[index].flag) {
      that.setData({
        [flag]: false
      })
    } else {
      that.setData({
        [flag]: true
      })
    }
    console.log("渲染后" + JSON.stringify(that.data.chooseList))
  },

  // 选好了按钮事件
  sure() {
    list1 = [];
    let list = [];
    console.log("选好了" + JSON.stringify(this.data.chooseList))
    for (let item of this.data.chooseList) {
      if (item.flag) {
        list.push(item.id);
        list1.push(item);   //所选list
      }
    }
    this.setData({
      list: list,
      list1: list1,
      showPicker: false,
    })
  },

  // 减少类别
  reduce: function (e) {
    let item = e.currentTarget.dataset.ids;
    let list = this.data.list;
    for (var i = 0; i < list1.length; i++) {
      if (list1[i].id == item) {
        list1.splice(i, 1);
      }
    }
    for (var j = 0; j < list.length; j++) {
      if (list[j] == item) {
        list.splice(j, 1)
      }
    }
    this.setData({
      list1: list1,
      list: list
    })
  },

  // 添加修改
  showPicker() {
    if (!this.data.firstShow) {
      this.setData({
        firstShow: true
      })
    }
    this.setData({
      showPicker: true,
    })

    // 加载时重新渲染已选择元素
    let arr = this.data.chooseList;
    this.setData({
      chooseList: arr
    })
    let array = this.data.list;
    let flag = '';
    let index = '';
    for (let i = 0; i < arr.length; i++) {
      index = i;
      flag = `chooseList[${i}].flag`;

      if (!array.includes(arr[i].id)) {
        this.setData({
          [flag]: false
        })
      } else {
        this.setData({
          [flag]: true
        })
      }
    }
  },

  // 隐藏picker
  hidePicker() {
    this.setData({
      showPicker: false
    })
  },

  // 上传图片
  upImg: function () {
    let that = this;
    if (this.data.img_arr.length < 4) {
      wx.chooseImage({
        sizeType: ['compressed'],
        count: 4,
        success: function (res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多上传四张图片',
        icon: 'loading',
        duration: 2000
      });
    }
  },

  //删除图片
  delImage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    let imgUrl = this.data.img_arr;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          imgUrl.splice(index, 1);
          that.setData({
            img_arr: imgUrl
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 提交预约单
  formSubmit: function (e) {
    let that = this;
    let imgUrl = new Array();
    if (that.data.img_arr.length == 0) {
      imgUrl = []
    } else {
      for (var i = 0; i < that.data.img_arr.length; i++) {
        imgUrl[i] = wx.getFileSystemManager().readFileSync(that.data.img_arr[i], "base64");
      }
    }
    console.log("imgUrl" + JSON.stringify(imgUrl));

    if (that.data.disabled == true) {
      return false;
    }

    let regMobile = /^1\d{10}$/;
    if (that.data.list1 == 0 || that.data.list1 == null) {
      wx.showToast({
        title: '请选择回收种类',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (e.detail.value.mobile == 0) {
      wx.showToast({
        title: '请填写联系方式',
        image: '/images/index/fail.png',
        duration: 1500
      })
    }
    else if (!regMobile.test(e.detail.value.mobile)) {
      wx.showToast({
        title: '手机号有误！',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else if (e.detail.value.address == 0) {
      wx.showToast({
        title: '请填写详细地址',
        image: '/images/index/fail.png',
        duration: 1500
      })
    } else {
      that.setData({
        img_arr: '',
        disabled: true
      })
      let reservePriceIds = ''
      for (var i = 0; i < list1.length; i++) {
        reservePriceIds += list1[i].id + ","
      }
      if (reservePriceIds.length > 0) {
        reservePriceIds = reservePriceIds.substr(0, reservePriceIds.length - 1)
      }

      wx.showLoading({ title: '提交中' })

      let word = e.detail.value.word;
      if (word == null) {
        word = ""
      }

      if (imgUrl.length == 0) {
        imgUrl = ""
      }

      let url = '/gc-tenant-api/userApplet/submitReserve';
      let params = {
        reservePriceIds: reservePriceIds,
        phone: e.detail.value.mobile,
        address: e.detail.value.address,
        message: word,
        picJson: imgUrl
      }
      network.networkpost(url, params, app).then(() => {
        if (app.netWorkData.result.code == 1) {
          wx.navigateTo({
            url: '../orderSuccess/orderSuccess',
          })
        } else {
          network.codeResolve(app.netWorkData.result)
        }
      })
    }
  },

  // 我的选择
  mySelect(e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      address: name,
      showModal: false
    })
  },

  // 获取备注信息
  noteInfo: function () {
    let that = this;
    let url = '/gc-tenant-api/userApplet/selectReserveRemark';
    let params = {}
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          notes: app.netWorkData.result.data
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 查询个人信息
  selfInfo: function () {
    let that = this;

    let url = '/gc-tenant-api/userApplet/selectUserInfo';
    let params = {}
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        let userInfo = app.netWorkData.result.data;
        let community = userInfo.community.name;
        let floor = userInfo.address1;
        let unit = userInfo.address2;
        let doorNo = userInfo.address3;

        // userInfo.phone = utils.formatPhone(userInfo.phone)

        let detailAddress = '';
        if (community != null && floor != null && unit != null && doorNo != null) {
          detailAddress = userInfo.community.name + userInfo.address1 + "号楼" + userInfo.address2 + "单元" + userInfo.address3 + "门牌号"
        } else {
          detailAddress = ''
        }
        that.setData({
          userInfo: app.netWorkData.result.data,
          detailAddress: detailAddress,
          // phone: userInfo.phone
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
  },

  // 格式化手机
  phoneFormat: function (e) {
    let phone = e.detail.value;
    if (phone) {
      const matchs = /^(\d{3})(\d{4})(\d{4})$/.exec(phone)
      if (matchs) {
        return matchs[1] + '-' + matchs[2] + '-' + matchs[3]
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取回收列表
    let url = '/gc-tenant-api/userApplet/getReservePrice';
    let params = {
      reservePriceId: options.data1
    }
    network.networkpost(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          chooseList: app.netWorkData.result.data.list
        })
      } else {
        network.codeResolve(app.netWorkData.result)
      }
    })
    // 个人信息
    that.selfInfo();
    // 备注
    that.noteInfo();

    if (options.data2 != undefined) {
      wx.setNavigationBarTitle({
        title: options.data2
      })
    }
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

    let url = '/gc-tenant-api/staffApplet/selectPlatformInfo';
    let params = {};
    network.networkget(url, params, app).then(() => {
      if (app.netWorkData.result.code == 1) {
        that.setData({
          phonedata: app.netWorkData.result.data.servicePhone,
          serviceTime: app.netWorkData.result.data.serviceTime
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