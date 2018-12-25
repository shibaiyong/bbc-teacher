import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from 'router'
import 'router/interceptor'
import store from 'store'
import viewshare from 'viewshare'
import 'viewshare/dist/styles/viewshare.css'
import 'filter'
import 'base'
import 'component'
import 'lib/viewbox.js'
import 'style/index.styl'
import FastClick from 'fastclick'
FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.use(viewshare)

window.infoflag = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
