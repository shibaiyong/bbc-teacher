/**
 * @Desc: 素材库相关api
 */
import requester from 'config/requester'
import store from 'store'

/**
 * 获取素材库筛选器
 * @param type(Number) 1:视频  2：图片
 */
export function requestGetMaterialFilter(type) {
	const url = `/api/v2/materialType/${type}`
	return requester.request({ url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * 获取素材库列表
 * @param pram(Object) 参数
 * @param searchKeyword(String) 搜索关键字
 */
export function requestGetMaterials(param, searchKeyword) {
  const url = `/api/v2/material/${param.type}`
  let params = {
    chapterOneId: param.activeDomainId,
    chapterTwoId: param.activeThemeId,
    pageSize: param.filterPageSize,
    pageNum: param.filterPageIndex
  }
  if (searchKeyword) {
    params = {
      search: searchKeyword,
      pageSize: param.searchPageSize,
      pageNum: param.searchPageIndex
    }
  }
  return requester.request({ url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * 获取收藏列表
 * @param param(Object) 参数
 */
export function requestGetCollectMaterials(param) {
  const url = '/api/v2/material/collected'
  const params = {
    pageSize: param.pageSize,
    pageNum: param.pageIndex
  }
	return requester.request({ url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * 收藏素材
 * @param materialId(Number) 素材id
 */
export function requestCollectMaterial(materialId) {
  const method = 'post'
	const url = `/api/v2/material/${materialId}/collected`
	return requester.request({ method, url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * 取消收藏素材
 * @param materialId(Number) 素材id
 */
export function requestCancelCollectMaterial(materialId) {
  const method = 'delete'
	const url = `/api/v2/material/${materialId}/collected`
	return requester.request({ method, url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}