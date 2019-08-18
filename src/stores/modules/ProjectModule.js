import axios from 'axios'
import {IN_PROCESS,COMPLETE,NOT_FOUND} from "@/stores/consts/FetchStatus";
import {NOT_START} from "@/stores/consts/FetchStatus";
import {BASE_PROJECT_URL} from "../consts/url";

export default{
    namespaced : true,
    state : {
        projects : [],//list project lain, cuma data sederhana (id,nama,...dll)
        project : {},//menyimpan data detail dari suatu project
        fetchStatus : NOT_START
    },
    getters : {
        getProjectList(state){
            return state.projects
        },
        getProjectData(state){
            return state.project
        },
        getSectionData(state){
            return (section) => {
                return (state.project.sections === undefined)? undefined : state.project.sections[section]
            }
        },
        getPathData(state,getters){
            return (section, path) => {
                let tmp = getters['getSectionData'](section)
                return (tmp === undefined)?undefined : tmp.paths[path]
            }
        },
        getOperationData(state,getters){
            return (section, path, operation) => {
                let tmp = getters['getPathData'](section,path)
                return (tmp === undefined)?undefined : tmp.methods[operation]
            }
        },
        getDefinitionDataByName(state){
            return (definitionName) => {
                return (state.project.definitions === undefined) ? undefined :
                    Object.values(state.project.definitions).find(definition => definition.name === definitionName)
            }
        },
        getDefinitionDataById(state){
            return (definitionId) => {
                return (state.project.definitions === undefined) ? undefined : state.project.definitions[definitionId]
            }
        },
        getDefinitions(state){
            return state.project.definitions
        },
        getGithubData(state) {
            return state.project.githubProject
        },
        getState(state){
            return state.fetchStatus
        },
        getProjectOwner(state) {
            return state.project.projectOwner
        },
        getTeams(state) {
            return state.project.teams
        }
    },
    mutations: {
        ASSIGN_DATA(state,newData){
            state.project = newData
        },

        LIST_DATA (state, newData) {
            state.projects = newData
        },

        DELETE_DATA (state, idxData) {
            const projectIndex = state.projects.findIndex(p => p.id === idxData);
            state.projects.splice(projectIndex, 1)
        },

        ADD_DATA(state, newData) {
            state.projects.push(newData)
        },
        CHANGE_STATE(state, processState){
            state.fetchStatus = processState
        },
        PUSH_TEAM(state, newTeam) {
            state.project.teams.push(newTeam)
        },
        REMOVE_TEAM(state, deleteTeam) {

        }
    },
    actions : {
        fetchProjectData({ commit }, idProject) {
            commit('CHANGE_STATE', IN_PROCESS)
            axios.get(BASE_PROJECT_URL +'/'+ idProject).then(
                (response) => {
                    if(response.status === 200){
                        commit('ASSIGN_DATA', response.data)
                        commit('CHANGE_STATE', COMPLETE)
                    }
                }
            ).catch(() => {
                commit('CHANGE_STATE', NOT_FOUND)
            })
        },

        fetchAllProjectsData({ commit }) {
            let fetchProjects = () => axios.get(BASE_PROJECT_URL + '/all/info')
                .then((response) => {
                    commit('LIST_DATA', response.data)
                })
            fetchProjects()
        },

        deleteProjectData({ commit }, idProject) {
            let deleteProject = () => axios.delete(BASE_PROJECT_URL +'/'+ idProject).then(
                (response) => {
                    commit('DELETE_DATA', idProject)
                }
            ).catch(function (error) {
                console.log(error);
            })
            deleteProject()
        },

        createProjectData({commit}, newProjectForm) {
            return new Promise((resolve, reject) => {
                axios.post(BASE_PROJECT_URL, newProjectForm)
                    .then((response) => {
                        commit('ADD_DATA', response.data.newProject)
                        resolve(response)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },

        assignTeamToProject({state, commit}, payload){
            if (!state.project.teams.includes(payload)) commit('PUSH_TEAM', payload)
        },
        unassignTeamFromProject({state, commit}, payload) {
            if(state.project.teams.includes(payload)) commit('REMOVE_TEAM', payload)
        }
    }
}
