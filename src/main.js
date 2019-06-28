import Vue from 'vue'
import App from './App.vue'
import {store} from './stores'
import {router} from "./routers/router"
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import { BToast } from 'bootstrap-vue'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

axios.interceptors.request.use(function (config) {
  const apixToken = localStorage.getItem('apix-token')
  if (apixToken) {
    config.headers.Authorization = `Bearer ${apixToken}`
  }
  return config

}, error => {
  return Promise.reject(error);
})

// response interceptor
axios.interceptors.response.use(response => {
  return response

}, error => {
  // console.log(error.response)
  console.log('dari axios interceptor', error.response.data)
  console.log(error.response.status)
  console.log(error.response.headers)
  alert(error.response.data.message)
  return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
