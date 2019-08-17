import axios from 'axios'
import {BASE_URL} from "../consts/url";

export default {
    namespaced: true,
    state: {
        users: []
    },
    getters: {
        getUsers: state => state.users,
    },
    actions: {
        fetchAllUsersData({ commit }){
            let fetchUsers = () => axios.get(BASE_URL + '/admin/users')
                .then((response) => {
                    commit('LIST_DATA', response.data)
                })
            fetchUsers()
        },
        addUser: ({ commit }, payload) => {
            console.log('dispatch add user', payload)
            commit('PUSH_DATA', payload)
        },
    },
    mutations: {
        LIST_DATA (state, newData) {
            state.users = newData
        },
        PUSH_DATA (state, newData) {
            state.users.push(newData)
        },
    }
}