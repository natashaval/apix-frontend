import Vue from 'vue'
import App from './App.vue'
import {store} from './stores'
import {router} from "./routers/router"
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

axios.interceptors.request.use(function (config) {
  const apixToken = localStorage.getItem('apix-token')
  if (apixToken) {
    config.headers.Authorization = `Bearer ${apixToken}`
  }
  return config
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
