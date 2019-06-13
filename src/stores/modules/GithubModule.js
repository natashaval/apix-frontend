import axios from 'axios'
import {BASE_URL} from "../actions/const";

export default{
    namespaced : true,
    state : {
        owner: {},
        repos: {},
        content: undefined
    },
    getters : {
        getOwner: state => state.owner,
        isOwnerLoaded: state => !!state.owner.login,
        getRepos: state => state.repos,
        getContent: state => state.content,
    },
    actions: {
        fetchOwner({commit}){
            axios.get(BASE_URL + 'github/api/user')
                .then(resp => {
                    commit('ASSIGN_OWNER', resp.data)
                })
        },
        fetchRepos({commit}){
            axios.get(BASE_URL + 'github/api/user/repos')
                .then(resp => {
                    commit('ASSIGN_REPOS', resp.data)
                })
        },
        fetchOas({commit}, payload) {
            axios.get(BASE_URL + 'github/api/repos/' + payload.owner + '/' + payload.repo + '/contents/' + payload.path,
                {params: {
                        ref: this.branch
                    }}
            )
                .then((response) => {
                    commit('ASSIGN_CONTENT', response.data.content)
                })
                .catch((e) => {console.error(e)})
        }
    },
    mutations: {
        ASSIGN_OWNER(state, newData){
            state.owner = newData
        },
        ASSIGN_REPOS(state, newData){
            state.repos = newData
        },
        ASSIGN_CONTENT (state, newData) {
            state.content = newData
        }
    }

}