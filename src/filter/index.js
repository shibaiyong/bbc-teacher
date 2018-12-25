/*
 * @Desc: 过滤器
 */

import Vue from 'vue'
import moment from 'moment'

/**
 * 文件大小
 */ 
Vue.filter('fileSize', function (value) {
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
  size = size.toString().indexOf('.0') !== -1 ? parseInt(size) : size
  return size + unitArr[index]
})

/**
 * 时间格式化（2017-11-11 11:11）
 */
Vue.filter('date', function (value) {
  return moment(value).format('YYYY-MM-DD HH:mm')
})

/**
 * 时间格式化（2017年11月11日（星期一））
 */
Vue.filter('dateZh', function (value) {
  moment.locale('zh-cn')
  return moment(value).format('LL') + '（' + moment(value).format('dddd') + '）'
})

/**
 * 年龄格式化（2 岁 1 个月）
 */
Vue.filter('age', function(value) {
  var nowYear = new Date().getFullYear(),
      nowMonth = new Date().getMonth() + 1,
      nowDay = new Date().getDate()

  var dateArray = value.split('-')
  var year = dateArray[0] *1,
      month = dateArray[1] * 1,
      day = dateArray[2] * 1
  var resYear = 0, resMonth = 0 

  if (nowMonth > month) {
    resYear = nowYear - year
    resMonth = day <= nowDay ? nowMonth - month : nowMonth - month - 1
  }
  else {
    resYear = nowYear - year - 1
    resMonth = day <= nowDay ? nowMonth + (12 - month) : nowMonth + (12 - month) - 1
  }

  if (resMonth === 12) {
    resYear += 1
    resMonth = 0 
  }

  if (resYear < 0) {
    resYear = 0
  }


  resYear = resYear !== 0 ? resYear + '岁' : ''
  resMonth = resMonth !== 0 ? resMonth + '个月' : ''
 
  return resYear + resMonth
})