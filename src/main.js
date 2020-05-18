import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局表样式表
import './assets/css/global.css'

import axios from 'axios'
import qs from 'qs'

// 请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8081/api/v1/'
// 挂载请求头
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$qs = qs

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
