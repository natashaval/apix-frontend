import Vue from 'vue'
import VueRouter from 'vue-router'
import ProjectEditor from "../components/editors/ProjectEditor";
import SectionEditor from "../components/editors/SectionEditor";

import {store} from '../stores'
import PathEditor from "../components/editors/PathEditor";
import OperationEditor from "../components/editors/OperationEditor";
import DefinitionEditor from "../components/editors/DefinitionEditor";
import AuthLogin from "../components/auth/AuthLogin";
import UserProfile from "../components/auth/UserProfile";
import ProjectsUpload from "../components/projects/ProjectsUpload";
import GithubEditor from "../components/editors/GithubEditor";
import TeamCreate from "../components/auth/TeamCreate";
import TeamViewer from "../components/auth/TeamViewer";
import ProjectsList from "../components/projects/ProjectsList";
import UserViewer from "../components/auth/admin-components/UserViewer";
import ErrorNotFound from "../ErrorNotFound";
import SettingsEditor from "../components/editors/SettingsEditor";

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
        {// List of Projects available
            name: 'project-repo', path: '/projects',
            component: ProjectsList
        },
        {
          name: 'project-import', path: '/projects/import',
            component: ProjectsUpload
        },
        {
            name: 'auth-login', path: '/login',
            component: AuthLogin
        },
        {
            name: 'user-profile', path: '/user/profile',
            component: UserProfile
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
            name: 'user-viewer', path: '/admin/users',
            component: UserViewer
        },
        {
            name: 'error-not-found', path: '*',
            component: ErrorNotFound
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
        router.push('/login');
    }

    next();
})
