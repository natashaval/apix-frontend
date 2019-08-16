import Vue from 'vue'
import VueRouter from 'vue-router'
import ProjectEditor from "../components/editors/ProjectEditor";
import SectionEditor from "../components/editors/SectionEditor";

import {store} from '../stores'
import PathEditor from "../components/editors/PathEditor";
import OperationEditor from "../components/editors/OperationEditor";
import DefinitionEditor from "../components/editors/DefinitionEditor";
import AuthLogin from "../components/auth/AuthLogin";
import GithubEditor from "../components/editors/GithubEditor";
import TeamCreate from "../components/teams/TeamCreate";
import TeamViewer from "../components/teams/TeamViewer";
import ProjectsList from "../components/projects/ProjectsList";
import UserViewer from "../components/auth/admin-components/UserViewer";
import ErrorNotFound from "../ErrorNotFound";
import SettingsEditor from "../components/editors/SettingsEditor";
import ClientEditor from "../components/editors/ClientEditor";
import SwaggerClient from "../components/editors/SwaggerClient";
import TeamList from "../components/teams/TeamList";
import TeamEditor from "../components/editors/TeamEditor";
import {DEFAULT_LAYOUT, EDITOR_LAYOUT} from "../consts/LayoutMode"
import ErrorForbidden from "../ErrorForbidden";

Vue.use(VueRouter)
const initProject = (to, from, next) => {
    // jika project id dari url sebelum dan sesudah berbeda, maka fetch ulang datanya
    if(from.params.projectId !== to.params.projectId){
        console.log('begin outer call')
        store.dispatch('project/fetchProjectData',to.params.projectId)
        console.log('end outer call')
    }
    next()
}

const checkAdmin = (to, from, next) => {
    // https://forum.vuejs.org/t/solved-delay-vue-action-until-a-state-variable-is-set/9063/5
    function proceed() {
        if (store.getters['user/isProfileLoaded']) {
            next()
        }
    }

    if (to.meta.adminAuth) {
        if (!store.getters['user/isProfileLoaded']) {
            store.watch(
                (state) => state.user.profile,
                (value) => {
                    if (value.roles.includes('ROLE_ADMIN') || value.roles.includes('ADMIN')) {
                        proceed()
                    } else {
                        router.push('/forbidden')
                    }
                }
            )
        } else {
            proceed()
        }
    }
}

let routeLayoutConfigs = [
    {
        layout : EDITOR_LAYOUT,
        routes : [
            {
                name : 'project-editor', path : '/projects/:projectId',
                component : ProjectEditor, props : true,
                beforeEnter: initProject
            },
            {
                name : 'section-editor', path : '/projects/:projectId/sections/:sectionApi',
                component : SectionEditor, props : true,
                beforeEnter : initProject
            },
            {
                name: 'section-create', path: '/projects/:projectId/new-section',
                component: SectionEditor, props: true,
                beforeEnter: initProject
            },
            {
                name : 'path-editor', path : '/projects/:projectId/sections/:sectionApi/paths/:pathApi',
                component : PathEditor, props : true,
                beforeEnter : initProject
            },
            {
                name : 'path-create', path : '/projects/:projectId/sections/:sectionApi/new-path',
                component : PathEditor, props : true,
                beforeEnter : initProject
            },
            {
                name : 'operation-editor', path : '/projects/:projectId/sections/:sectionApi/paths/:pathApi/operations/:operationApi',
                component : OperationEditor, props : true,
                beforeEnter : initProject
            },
            {
                name : 'operation-create', path : '/projects/:projectId/sections/:sectionApi/paths/:pathApi/new-operation',
                component : OperationEditor, props : true,
                beforeEnter : initProject
            },
            {
                name: 'definition-editor', path: '/projects/:projectId/definitions/:definitionApi',
                component: DefinitionEditor, props: true,
                beforeEnter: initProject
            },
            {
                name: 'definition-create', path: '/projects/:projectId/new-definition',
                component: DefinitionEditor, props: true,
                beforeEnter: initProject
            },
            {
                name: 'github-editor', path: '/projects/:projectId/github',
                component: GithubEditor, props: true,
                beforeEnter: initProject
            },
            {
                name: 'settings-editor', path: '/projects/:projectId/settings',
                component: SettingsEditor, props: true,
                beforeEnter: initProject
            },
            {
                name: 'client-editor', path : '/projects/:projectId/sections/:sectionApi/paths/:pathApi/operations/:operationApi/client',
                component: ClientEditor, props: true,
                beforeEnter: initProject
            },
            {
                name: 'team-editor', path: '/projects/:projectId/teams',
                component: TeamEditor, props: true,
                beforeEnter: initProject
            },
        ]
    },
    {
        layout : DEFAULT_LAYOUT,
        routes : [
            {
                name: 'swagger-client', path: '/projects/:projectId/swagger',
                component: SwaggerClient
            },
            {// List of Projects available
                name: 'project-repo', path: '/projects',
                component: ProjectsList
            },
            {
                name: 'auth-login', path: '/login',
                component: AuthLogin
            },
            {
                name: 'team-create', path: '/team/new-team',
                component: TeamCreate, props: true
            },
            {
                name: 'team-viewer', path: '/team/:name',
                component: TeamViewer, props: true
            },
            {
                name: 'team-list', path: '/teams',
                component: TeamList
            },
            {
                name: 'user-viewer', path: '/admin/users',
                component: UserViewer,
                meta: {adminAuth: true },
                beforeEnter: checkAdmin
            },
            {
                name: 'error-forbidden', path: '/forbidden',
                component: ErrorForbidden
            },
            {
                name: 'error-not-found', path: '*',
                component: ErrorNotFound
            }
        ]
    }
]

let routes = []

routeLayoutConfigs.forEach(config => {
    config.routes.forEach(route => {
        let fn
        if(route.beforeEnter !== undefined){
            let tmp = route.beforeEnter
            fn = (to, from, next) => {
                store.commit('layout/SET_LAYOUT', config.layout)
                tmp(to, from, next)
            }
        }
        else{
            fn = (to, from, next) => {
                store.commit('layout/SET_LAYOUT', config.layout)
                next()
            }
        }
        route.beforeEnter = fn
        routes.push(route)

    })
})

export const router = new VueRouter({
    mode : 'history',
    routes
})

// redirect to login if not logged in
router.beforeEach((to, from, next) => {
    //redirect to login if not logged in and trying to access restricted page
    // http://jasonwatmore.com/post/2018/07/14/vue-vuex-user-registration-and-login-tutorial-example#loginpage-vue
    const publicPages = ['/login'];
    const  authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('apix-token');

    if (authRequired && !loggedIn) {
        router.push('/login');
    }

    next();
})
