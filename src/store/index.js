import Vue from 'vue'
import Vuex from 'vuex'
import ProjectModule from "./modules/ProjectModule";

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules : {
        project : ProjectModule
    }
})