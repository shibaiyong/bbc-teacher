/**
 * @Desc: 路由拦截器
 */
import router from 'router'
import store from 'store'
import cookie from 'js-cookie'
import { sessionStorageUtil } from 'lib/util'

// 路由全局钩子
router.beforeEach((to, from, next) => {
  // 设置页面title
  document.title = to.meta.title

  // 退出登录
  if (to.path === '/login') {
    store.commit('logout')
    return next()
  }
  
  // 框架权限校验,跳转到其他无需登陆的页面
  if (!to.meta || !to.meta.requireAuth) { 
    return next()
  }
  
  // 框架权限校验
  if (to.meta && to.meta.requireAuth && !sessionStorageUtil.get('bbc_logged')) {
    return next('/login')
  }

  // token失效则登陆
  if (!cookie.get('ttoken') && sessionStorageUtil.get('bbc_logged')) {
    return confirm('登陆已过期，为您跳转到登陆页面？') ? next('/login') : next()
  }

  // 已登陆状态
  if (store.state.logged) {
    return next() 
  }
  
  return next()

})
