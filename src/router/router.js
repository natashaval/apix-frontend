import Vue from 'vue'
import VueRouter from 'vue-router'
import ProjectEditor from "../components/editor/ProjectEditor";
import SectionEditor from "../components/editor/SectionEditor";

import {store} from '../store'
import PathEditor from "../components/editor/PathEditor";
import OperationEditor from "../components/editor/OperationEditor";

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
        }
    ]
})