/**
 * @Desc 用户相关api
 */
import requester from 'config/requester'
// import store from 'store'

/**
 * 获取用户信息
 */
export function requestGetUserInfo1() {
  const url = '/api/v2/emp'
  return requester.request({ url })
    .then(res => { 
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * 获取用户信息（同步）
 */
export async function requestGetUserInfo() {
  const url = '/api/v2/emp'
  return await requester.request({ url })
    .then(res => { 
      return res.data
    })
    .catch(err => {
      return err
    })
}

/**
 * 修改用户信息
 */
export function requestPatchUserInfo(param) {
	const method = 'patch'
	const url = '/api/v2/emp'
	const params = {
		phone: param.phone,
		empName: param.name
	}
	return requester.request({ method, url, params })
    .then(res => { 
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/** 
 * 获取用户的所有的班级信息数据
*/
export function requestGetAllClassesData() {
	const url = '/api/v2/classes'
	return requester.request({ url })
    .then(res => { 
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/** 
 * 用户切换班级
*/
export function requestSwitchClasses(classId) {
  const method = 'patch'
  const url = `/api/v2/switch/${classId}`
  const params = {
    classId: classId
  }
	return requester.request({ method, url, params })
    .then(res => { 
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}