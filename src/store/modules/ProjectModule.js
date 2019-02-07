import axios from 'axios'


export default{
    namespaced : true,
    state : {
        projectList : [],
        project : "asd"//data
    },
    getters : {
        getProjectList(state){
            return state.projects
        },
        getById(state){
            return id => state.projects.find(project => project.id === id)
        },
        get(state){
            return state.project
        }
    },
    mutations: {
        ASSIGN_DATA(state,newData){
            state.project = newData
        }
    },
    actions : {
        fetchProjectData({ commit }, id) {
            // console.log(commit.getProjectList())
            // if (this.hasInitDrivers === undefined) {
            let fetchData = () => axios.get('http://localhost:8080/project/'+id).then(
                (response) => {
                    commit('ASSIGN_DATA', response.data)
                }
            )
            fetchData()
            //
            //     setInterval(function () {
            //             fetchDrivers()
            //         }.bind(this)
            //         , 10000
            //     )
            //     this.hasInitDrivers = false
            // }
        }
    }
}