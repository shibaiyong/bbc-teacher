/*
 * @Desc: 开心上课相关api
 */
import requester from 'config/requester'

/**
 * 获取课程资源
 * @param {Number} courseId：课程id
 */
export function requestGetCourseResource(courseId) {
	const url = `api/v2/course/${courseId}/res`
	return requester.request({ url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch( err => {
      return Promise.reject(err)
    })
}

/**
 * 获取默认课程
 */
export function requestGetDefaultCourse() {
  const url = '/api/v2/defaultCourse'
  return requester.request({ url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch( err => {
      return Promise.reject(err)
    })
}

/**
 * 获取课程表
 * @param {Number} year：年
 * @param {Number} month：月
 */
export function requestGetCourseTable(year, month) {
  const url = '/api/v2/courseCalendar'
  const params = {
    date: `${year}-${month}`
  }
  return requester.request({ url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch( err => {
      return Promise.reject(err)
    })
}

