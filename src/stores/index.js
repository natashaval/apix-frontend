import Vue from 'vue'
import Vuex from 'vuex'
import ProjectModule from "./modules/ProjectModule";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'


Vue.use(Vuex)
Vue.use(BootstrapVue)

Vue.config.productionTip = false

export const store = new Vuex.Store({
    modules : {
        project : ProjectModule
    }
})