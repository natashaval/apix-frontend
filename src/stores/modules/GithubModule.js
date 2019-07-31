import axios from 'axios'
import {BASE_URL} from "../actions/const";

export default{
    namespaced : true,
    state : {
        owner: {},
        repos: {},
    },
    getters : {
        getOwner: state => state.owner,
        isOwnerLoaded: state => !!state.owner.login,
        getRepos: state => state.repos,
    },
    actions: {
        fetchOwner({commit}){
            axios.get(BASE_URL + '/github/api/user')
                .then(resp => {
                    commit('ASSIGN_OWNER', resp.data)
                })
        },
        fetchRepos({commit}){
            axios.get(BASE_URL + '/github/api/user/repos')
                .then(resp => {
                    commit('ASSIGN_REPOS', resp.data)
                })
        }
    },
    mutations: {
        ASSIGN_OWNER(state, newData){
            state.owner = newData
        },
        ASSIGN_REPOS(state, newData){
            state.repos = newData
        }
    }

}
