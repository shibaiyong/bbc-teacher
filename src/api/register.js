/** 
 * @description: 注册api 
 */
import axios from 'axios'
import { baseURL } from 'config/config'

/** 
* 检查验证码
*/
export function requestCheckCode(data) {
  const url = '/api/v2/checkSmsForRegistration'
  const method = 'post'
  const params = {
    phone: data.tel,
    code: data.code
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return axios.request( {baseURL,url, method, headers, params })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch( error => {
      return Promise.reject(error)
    })
}

/** 
 * 注册 
 */
export function requestRegister(data) {
  const url = '/api/v2/registration'
  const method= 'post'
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const params = {
    phone: data.phone,
		code: data.code,
		password: data.password
  }
  return axios.request( { baseURL, url, method, headers, params })
    .then ( response => {
      return Promise.resolve(response.data)
    })
    .catch( error => {
      return Promise.reject(error)
    })
}