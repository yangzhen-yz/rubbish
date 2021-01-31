function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

const parseURL = (url) => {
  if (url && url.indexOf("?") == -1) return {}

  var startIndex = url.indexOf("?") + 1;
  var str = url.substr(startIndex);
  var strs = str.split("&");
  var param = {}
  for (var i = 0; i < strs.length; i++) {
    var result = strs[i].split("=");
    var key = result[0];
    var value = result[1];
    param[key] = value;
  }
  return param
}

/**

 * 生成uuid

 */

const wxuuid = function () {

  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("").replace("-", "");
  return uuid
}

/**
 * 格式化手机号
 */

function formatPhone(data) {
  if (data) {
    const matchs = /^(\d{3})(\d{4})(\d{4})$/.exec(data)
    if (matchs) {
      return matchs[1] + '-' + matchs[2] + '-' + matchs[3]
    }
  }
}

module.exports = {
  formatTime: formatTime,
  parseURL: parseURL,
  wxuuid: wxuuid,
  formatPhone: formatPhone
}