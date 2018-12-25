/*
 * @Desc: 在线备课相关api
 */
import requester from 'config/requester'

/**
 * 完成备课
 * @param {Number} courseId：课程id
 */
export function requestFinishPrepareCourse(courseId) {
  const method = 'post'
  const url = `/api/v2/coursePrepare/${courseId}`
	return requester.request({ method, url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch( err => {
      return Promise.reject(err)
    })
}

/**
 * 教案备课状态切换(默认、自定义)
 * @param {Number} courseId：课程id
 */
export function requestTogglePreparePlan(courseId) {
  const method = 'patch'
  const url = `/api/v2/coursePrepare/${courseId}/planPrepareType`
  return requester.request({ method, url})
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch( err => {
      return Promise.reject(err)
    })
}

/**
 * 课件备课状态切换(默认、自定义)
 * @param {Number} courseId：课程id
 */
export function requestToggleCourseware(courseId) {
  const method = 'patch'
  const url = `/api/v2/coursePrepare/${courseId}/coursewarePrepareType`
  return requester.request( { method, url})
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch( err => {
      return Promise.reject(err)
    })
}


