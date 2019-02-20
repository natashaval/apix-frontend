import Vue from 'vue'
import Vuex from 'vuex'
import ProjectModule from "./modules/ProjectModule";
import LayoutModule from "./modules/LayoutModule";

Vue.use(Vuex)

Vue.config.productionTip = false

export const store = new Vuex.Store({
    modules : {
        project : ProjectModule,
        layout: LayoutModule
    }
})