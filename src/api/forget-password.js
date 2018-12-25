/** 
 * @description: 忘记密码 
 */
import axios from 'axios'
import { baseURL } from 'config/config'

/** 
* 获得邀请码
*/
export function requestGetCode(phone) {
  const url = '/api/v2/emp/forget'
  const method = 'post'
  const params = {
    phone: phone
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return axios.request( { baseURL, url, method, headers, params })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch( error => {
      return Promise.reject(error)
    })
}

/** 
 * 校验验证码 
 */
export function requestCheckCode(data) {
  const url = '/api/v2/checkSmsForModifyPassword'
  const method = 'post'
  const params = {
    phone: data.phone,
    code: data.code
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return axios.request( { baseURL, url, method, headers, params })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch( error => {
      return Promise.reject(error)
    })
}

/** 
 * 修改密码 
 */
export function requestModifyPassword(data) {
  const url = '/api/v2/modifyPassword'
  const method = 'patch'
  const params = {
    phone: data.phone,
    code: data.code,
    password: data.password
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return axios.request( { baseURL, url, method, headers, params })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch( error => {
      return Promise.reject(error)
    })
}