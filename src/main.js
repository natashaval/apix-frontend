import Vue from 'vue'
import App from './App.vue'
import {store} from './stores'
import {router} from "./routers/router"
import axios from 'axios'
import VueIziToast from 'vue-izitoast'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'izitoast/dist/css/iziToast.min.css'

Vue.use(BootstrapVue)
Vue.use(VueIziToast)

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

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')