import cookie from 'js-cookie'
import { sessionStorageUtil } from  'lib/util'

const mutations = {
  // 登入
  login: (state) => {
    state.logged = true
    sessionStorageUtil.set('bbc_logged', true)
  },

  // 保存用户信息
  setUserInfo: (state, userInfo) => {
    state.orgName = userInfo.orgName
    state.userName = userInfo.emp.name
    state.userPhone = userInfo.emp.phone
  },

  // 保存所有的机构数据
  setAllClassesList: (state, list) => {
    state.classesList = list
  },

  // 请空用户信息和存储的数据
  logout: (state) => { 
    state.logged = false
    cookie.get('ttoken') && cookie.remove('ttoken')
    sessionStorage.removeItem('attendClassId')
    sessionStorage.removeItem('prepareLessonId')
    sessionStorageUtil.remove('courseId')
    sessionStorageUtil.remove('activeClassName')
    sessionStorageUtil.remove('activeClassId')
    sessionStorageUtil.remove('bbc_logged')
  }
}

export default mutations