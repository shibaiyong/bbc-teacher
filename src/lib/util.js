/** 
 * @Desc: 工具类
 */
import moment from 'moment'

/**
 * localstorage工具
 */ 
export const localStorageUtil = {
  get: function(key) {
    var value = localStorage.getItem(key)
    return value ? JSON.parse(value) : ''
  },
  set: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: function (key) {
    localStorage.getItem(key) && localStorage.removeItem(key)
  }
}

/**
 * sessionStorage工具
 */ 
export const sessionStorageUtil = {
  get: function(key) {
    var value = sessionStorage.getItem(key)
    return value ? JSON.parse(value) : ''
  },
  set: function(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  remove: function (key) {
    sessionStorage.getItem(key) && sessionStorage.removeItem(key)
  }
}

/**
 * 文件大小格式化
 * @param {number} value： 字节值 
 */
export function formatFileSize(value) {
  if (null == value || value == '') {
    return "0B"
  }
  var unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
  var index = 0
  var srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  var size = srcsize / Math.pow(1024, index)
  // 保留一个小数
  size = size.toFixed(1)
  // 小数为0则去除
  size =  size.toString().indexOf('.0') !== -1 ? parseInt(size) : size
  return size + unitArr[index]
}

/**
 * 进入全屏
 */
export function enterFullScreen(ele) {
  if (ele.requestFullscreen) {
    ele.requestFullscreen()
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen()
  } else if (ele.webkitRequestFullScreen) {
    ele.webkitRequestFullScreen()
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen()
  }
  return false
}

/**
 * 退出全屏
 */
export function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
  return false
}

/**
 * 检测浏览器是否处于通过requestFullScreen开启的全屏
 */
export function checkFullScreen() {
  var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
  if (isFull === undefined) {
    isFull = false
  }
  return isFull
}

/**
 * 判断是否全屏（兼容f11和requestFullScreen两种方式开启的全屏）
 */
export function isFullscreen() {
  var explorer = window.navigator.userAgent.toLowerCase()
  var isFull
  if (explorer.indexOf('chrome') > 0) {
    if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
      isFull = true
    } else {
      isFull = false
    }
  } else {
    if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
      isFull = true
    } else {
      isFull = false
    }
  }
  return isFull
}

// 验证手机号
export function validataPhone(value) {
  let pattern = /^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0|1|3|5|6|7|8]|18[0|1|2|3|5|6|7|8|9]|19[8|9])\d{8}$/
  if (null == value || value == '') {
    return false
  } else if ( !value.match(pattern) || value.length != 11) {
    return false
  } else {
    return true
  }
}

// 验证密码(6~32位字符)
export function validatePassword(value) {
  let pattern = /^.{6,32}$/
  if (null == value || value == '') {
    return false
  } else if ( !value.match(pattern)) {
    return false
  } else {
    return true
  }
}

// 核对两次密码一致否
export function confirmPassword(password, confirmPassword) {
  return password == confirmPassword 
}

// 验证码长度设置
export function validateCodeLength(value) {
  if (null == value || value == '') {
    return false
  } else if (value.length != 6) {
    return false
  } else return true
}

/**
 * 根据当前时间 获取下下周的最后一天的时间戳  时分秒都为0
 */ 
export function get2NextWeekLastDay() {
  var lastDay = new Date()
  var curDay = new Date().getDay()
  if (curDay === 0) {
    lastDay.setDate(lastDay.getDate() + 15)
  } 
  else {
    lastDay.setDate(lastDay.getDate() + (22 - curDay))
  }
  lastDay.setHours(0,0,0,0)
  return lastDay.getTime()
}