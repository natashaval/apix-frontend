import Vue from 'vue'
import Vuex from 'vuex'
import ProjectModule from "./modules/ProjectModule";
import LayoutModule from "./modules/LayoutModule";
import AuthModule from "./modules/AuthModule";
import UserModule from "./modules/UserModule";

Vue.use(Vuex)

Vue.config.productionTip = false

export const store = new Vuex.Store({
    modules : {
        project : ProjectModule,
        layout: LayoutModule,
        auth: AuthModule,
        user: UserModule
    }
})