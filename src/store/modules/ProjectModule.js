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
        getProject(state){
            return state.project
        },
        getSection(state){
            if(state.project.sections === undefined){
                return () => undefined
            }
            return (section) => state.project.sections[section]
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