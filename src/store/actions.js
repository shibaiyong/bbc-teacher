import { requestGetUserInfo, requestGetAllClassesData } from 'api/user'
import { sessionStorageUtil } from  'lib/util'

/**
 * 获取用户信息（同步）
 */
export async function getUserInfo({ commit }) {
  const res = await requestGetUserInfo()
  if (res.code === 200) {
    // console.log('requestGetUserInfo SUCCESS', res)
    commit('setUserInfo', res.data)
  }
  else {
    // console.log('requestGetUserInfo FAIL', res)
  }
}

/** 
 * 获取所有的机构数据
*/
// export async function getAllClassesData({ commit }) {
//   const res = await requestGetAllClassesData()
//   if (res.code === 200) {
//     // console.log('requestGetAllClassesData SUCCESS', res.data)
//     sessionStorageUtil.set('activeClassId', res.data.defaultId)
//     commit('setAllClassesList', res.data.classes)
//   }
// }


