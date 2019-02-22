import axios from 'axios'


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
        getDataTypes(state){
            return state.project.definitions
        }
    },
    mutations: {
        ASSIGN_DATA(state,newData){
            state.project = newData
        },

        LIST_DATA (state, newData) {
            state.projects = newData
        }
    },
    actions : {
        fetchProjectData({ commit }, idProject) {
            let fetchData = () => axios.get('http://localhost:8080/project/'+idProject).then(
                (response) => {
                    commit('ASSIGN_DATA', response.data)
                }
            )
            fetchData()
        },
        
        fetchAllProjectsData({ commit }) {
            let fetchProjects = () => axios.get('http://localhost:8080/project/all/info')
                .then((response) => {
                    commit('LIST_DATA', response.data)
                })
            fetchProjects()
        }
    }
}