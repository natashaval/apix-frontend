import Vue from 'vue'
import App from './App.vue'
import {store} from './stores'
import {router} from "./routers/router";

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
