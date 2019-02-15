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
            if(state.project.sections === undefined){
                return () => undefined
            }
            return (section) => state.project.sections[section]
        },
        getPathData(state,getters){
            return (section, path) => getters['getSectionData'](section).paths[path]
        },
        getOperationData(state,getters){
            return (section, path, operation) => getters['getPathData'](section,path).methods[operation]
        },
        getDataTypes(state){
            return state.project.definitions
        }
    },
    mutations: {
        ASSIGN_DATA(state,newData){
            state.project = newData
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
        }
    }
}