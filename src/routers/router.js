import Vue from 'vue'
import VueRouter from 'vue-router'
import ProjectEditor from "../components/editors/ProjectEditor";
import SectionEditor from "../components/editors/SectionEditor";

import {store} from '../stores'
import PathEditor from "../components/editors/PathEditor";
import OperationEditor from "../components/editors/OperationEditor";
import ProjectAll from "../components/projects/ProjectAll";

Vue.use(VueRouter)
const initProject = (to, from, next) => {
    // jika project id dari url sebelum dan sesudah berbeda, maka fetch ulang datanya
    if(from.params.projectId !== to.params.projectId){
        store.dispatch('project/fetchProjectData',to.params.projectId)
    }
    next()
}

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
            name : 'path-editor', path : '/projects/:projectId/sections/:sectionApi/path/:pathApi',
            component : PathEditor, props : true,
            beforeEnter : initProject
        },
        {
            name : 'operation-editor', path : '/projects/:projectId/sections/:sectionApi/paths/:pathApi/operations/:operationApi',
            component : OperationEditor, props : true,
            beforeEnter : initProject
        },
        {
            name: 'project-all', path: '/projects',
            component: ProjectAll, props: true,

        }
    ]
})