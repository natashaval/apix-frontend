import Vue from 'vue'
import VueRouter from 'vue-router'
import ProjectEditor from "../components/editors/ProjectEditor";
import SectionEditor from "../components/editors/SectionEditor";

import {store} from '../stores'
import PathEditor from "../components/editors/PathEditor";
import OperationEditor from "../components/editors/OperationEditor";
import ProjectRepo from "../components/projects/ProjectRepo";
import DefinitionEditor from "../components/editors/DefinitionEditor";
import Login from "../components/auth/Login";
import SampahLogin from "../components/auth/SampahLogin";

Vue.use(VueRouter)
const initProject = (to, from, next) => {
    // jika project id dari url sebelum dan sesudah berbeda, maka fetch ulang datanya
    if(from.params.projectId !== to.params.projectId){
        store.dispatch('project/fetchProjectData',to.params.projectId)
    }
    next()
}

/*
const listProjects = () => {
    store.dispatch('fetchAllProjectsData')
}
*/

/*
router.beforeEach((to, from, next) => {
    //redirect to login if not logged in and trying to access restricted page
    // http://jasonwatmore.com/post/2018/07/14/vue-vuex-user-registration-and-login-tutorial-example#loginpage-vue
    const publicPages = ['/login', '/'];
    const  authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('apix-token');

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    next();
})
*/

export const router = new VueRouter({
    mode : 'history',
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
            name : 'path-editor', path : '/projects/:projectId/sections/:sectionApi/paths/:pathApi',
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
        {// List of Projects available
            name: 'project-repo', path: '/projects',
            component: ProjectRepo, props: true,
            // beforeEnter: listProjects
        },
        {
            name: 'login', path: '/login',
            component: Login
        },
        {
            name: 'sampahlogin', path: '/sampahlogin',
            component: SampahLogin
        }

    ]
})

// redirect to login if not logged in
router.beforeEach((to, from, next) => {
    //redirect to login if not logged in and trying to access restricted page
    // http://jasonwatmore.com/post/2018/07/14/vue-vuex-user-registration-and-login-tutorial-example#loginpage-vue
    const publicPages = ['/login'];
    const  authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('apix-token');

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    next();
})