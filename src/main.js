import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/assets/css/global.css'
import '@/assets/fonts/iconfont.css'
import Axios from 'axios'
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = Axios
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
