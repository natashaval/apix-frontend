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
        },
        getPath(state){
            return function(path) {
                let pointer = state.project.sections
                for(let _key1 in pointer){
                    for(let _key2 in pointer[_key1].paths){
                        if(_key2 == path){
                            return pointer[_key1].paths
                        }
                    }
                }
            }
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