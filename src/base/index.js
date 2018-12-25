/**
 * 全局注册组件
 */
import Vue from 'vue'
import './message'
import VIcon from './icon'
import VLoading from './loading'

Vue.component(VIcon.name, VIcon)
Vue.component(VLoading.name, VLoading)

// Vue.use(VIcon)
// Vue.use(VLoading)
