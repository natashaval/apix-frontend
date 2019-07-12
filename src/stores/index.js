import Vue from 'vue'
import Vuex from 'vuex'
import ProjectModule from "./modules/ProjectModule";
import LayoutModule from "./modules/LayoutModule";
import AuthModule from "./modules/AuthModule";
import UserModule from "./modules/UserModule";
import GithubModule from "./modules/GithubModule";
import AdminModule from "./modules/AdminModule";

Vue.use(Vuex)

Vue.config.productionTip = false

export const store = new Vuex.Store({
    modules : {
        project : ProjectModule,
        layout: LayoutModule,
        auth: AuthModule,
        user: UserModule,
        github: GithubModule,
        admin: AdminModule
    }
})