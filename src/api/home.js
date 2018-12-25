/**
 * @Desc 首页相关api
 */
import requester from 'config/requester'

/**
 * 获取用户信息
 */
export function requestGetIndexData() {
  const url = '/api/v2/index'
  return requester.request({ url })
    .then(res => { 
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

