function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function isPhone(aPhone) {
  var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(aPhone);
  if (bValidate) {
    return true;
  }
  else
    return false;
}
function isEmpty(str) {
  return !str || str.length == 0 || (new RegExp(/^\s+$/g)).test(str)
}
module.exports = {
  formatTime: formatTime,
  isPhone,
  isEmpty
}
