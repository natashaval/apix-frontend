import axios from 'axios'
import {BASE_URL} from "../actions/const";

export default{
    namespaced : true,
    state : {
        projects : [],//list project lain, cuma data sederhana (id,nama,...dll)
        project : {}//menyimpan data detail dari suatu project
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
        }
    },
    actions : {
        fetchProjectData({ commit }, idProject) {
            let fetchData = () => axios.get(BASE_URL + 'projects/'+idProject).then(
                (response) => {
                    commit('ASSIGN_DATA', response.data)
                }
            )
            fetchData()
        },
        
        fetchAllProjectsData({ commit }) {
            let fetchProjects = () => axios.get(BASE_URL + 'projects/all/info')
                .then((response) => {
                    commit('LIST_DATA', response.data)
                })
            fetchProjects()
        },

        deleteProjectData({ commit }, idProject) {
            let deleteProject = () => axios.delete(BASE_URL + 'projects/' + idProject).then(
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
                axios.post(BASE_URL + 'projects', newProjectForm)
                    .then((response) => {
                        console.log('hasil axios dari module', response.data)
                        commit('ADD_DATA', response.data.newProject)
                        resolve(response)
                    })
                    .catch((error) => {
                        console.log(error)
                        reject(error)
                    })
            })
        }
    }
}