
const util = require('./util.js')
var showModal = true;
//post请求 url：请求路径，请求header，params请求参数，app全局变量
function networkpost(url, params, app) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: app.a.Url + url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "accessToken": wx.getStorageSync('accessToken')
      },
      data: params,
      method: 'POST',
      success: function (res) {
        //自行处理返回结果
        console.log('返回结果：')
        console.log(res.data)
        app.netWorkData.result = res.data
        resolve();
      }, fail: function (res) {
        reject()
      }
    })
  })
  return promise;
};

//get请求
function networkget(url, params, app) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: app.a.Url + url,
      header: {
        "accessToken": wx.getStorageSync('accessToken')
      },
      data: params,
      method: 'GET',
      success: function (res) {
        //返回结果自行处理
        console.log('返回结果：')
        console.log(res.data)
        app.netWorkData.result = res.data
        resolve();
      }, fail: function (res) {
        reject()
      }
    })
  });
  return promise;
};

// 图形验证码
function refleshCode(url, params, app) {
  let uuid = util.wxuuid();
  wx.setStorageSync('captchaUuid', uuid);

  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: app.a.Url + url,
      responseType: 'arraybuffer',
      method: 'GET',
      header: {
        "captchaUuid": uuid
      },
      data: params,
      success: function (res) {
        let imgUrl = 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data)
        app.netWorkData.result = imgUrl
        resolve();
      }, fail: function (res) {
        reject()
      }
    })
  })
  return promise;
};

// 短信验证码
function phoneCode(url, params, app) {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: app.a.Url + url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "accessToken": wx.getStorageSync('accessToken'),
        "captchaUuid": wx.getStorageSync('captchaUuid')
      },
      data: params,
      method: 'POST',
      success: function (res) {
        //自行处理返回结果
        console.log('返回结果：')
        console.log(res.data)
        app.netWorkData.result = res.data
        resolve();
      }, fail: function (res) {
        reject()
      }
    })
  })
  return promise;
};

// 返回code的处理
function codeResolve(data) {
  switch (data.code) {
    case -1:
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 2000
      })
      break;
    case 20:
      showModal == false
      wx.showModal({
        title: '提示',
        content: data.msg,
        confirmColor: '#47AED3',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        }
      })
      break;
    default:
      wx.showToast({
        title: data.msg,
        icon: 'none',
        duration: 2000
      })
      break;
  }
}

function getIp() {
  let that = this;
  wx.request({
    url: 'http://ip-api.com/json',
    success: function (res) {
      console.log("ip =>", res.data.query, res.data);
      that.setData({
        ip: res.data.query
      })
    }
  })
}

module.exports = {
  networkget: networkget,
  networkpost: networkpost,
  codeResolve: codeResolve,
  refleshCode: refleshCode,
  phoneCode: phoneCode,
  getIp: getIp
}