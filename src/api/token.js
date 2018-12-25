/*
 * @Desc: token相关api
 */
import axios from 'axios'
import { baseURL, auth } from 'config/config'

/**
 * 获取token
 * @param  {object} param: 用户和密码
 */ 
export function requestGetToken(param) {
  const method = 'post'
  const url = '/oauth/token'
  const params = {
    'grant_type': 'password',
    username: param.username,
    password: param.password
  }
  return axios.request({ method, baseURL, url, auth, params })
    .then(res => { 
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * 获取token
 * @param  {string} refresh_token: 刷新token
 */ 
export function requestRefreshToken(refresh_token) {
  const method = 'post'
  const url = '/oauth/token'
  const params = {
    grant_type: 'refresh_token',
    refresh_token
  }
  return axios.request({ method, baseURL, url, auth, params })
    .then(res => { 
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}