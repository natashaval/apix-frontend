import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from "../actions/user";
import { AUTH_LOGOUT } from "../actions/auth";
import axios from 'axios'
import {BASE_URL} from "../actions/const";
import {IN_PROCESS, NOT_START} from "../consts/FetchStatus";

export default {
    namespaced: true,
    state: {
        status: '',
        profile: {},
        users: [],
        editingPrivilege: undefined,
        fetchStatus : NOT_START,
    },
    getters: {
        getProfile: state => state.profile,
        isProfileLoaded: state => !!state.profile.username,
        hasEditingPrivilege : state => state.editingPrivilege,
        getUsers: state => state.users
    },
    actions: {
        [USER_REQUEST]: ({commit, dispatch}) => {
            commit(USER_REQUEST)
            axios({url: BASE_URL + 'user/profile'})
                .then(resp => {
                    commit(USER_SUCCESS, resp)
                })
                .catch(resp => {
                    commit(USER_ERROR)
                    dispatch('auth/' + AUTH_LOGOUT, null, {root: true})
                })
        },
        fetchAllUsersData({ commit }){
            let fetchUsers = () => axios.get(BASE_URL + 'admin/users')
                .then((response) => {
                    commit('LIST_DATA', response.data)
                })
            fetchUsers()
        },
        addUser: ({ commit }, payload) => {
            commit('PUSH_DATA', payload)
        },
        checkEditingPrivilege({commit, state}, payload){
            // let editable = state.profile.teams.some(x => payload.include(x));
            // console.log('ACTION USER MODULE EDITPRIV: ', editable)
            // commit('CHECK_PRIVILEGE', editable)
            // console.log(state.profile)
            // console.log('dari usermodule TEAM: ', state.profile.teams)
            let editable = state.profile.teams.some(x => payload.includes(x));
            commit('CHECK_PRIVILEGE', editable)
        }
    },
    mutations: {
        [USER_REQUEST]: (state) => {
            state.status = 'loading'
        },
        [USER_SUCCESS]: (state, resp) => {
            state.status = 'success'
            state.profile = resp.data
        },
        [USER_ERROR]: (state) => {
            state.status = 'error'
        },
        [AUTH_LOGOUT]: (state) => {
            state.profile = {}
        },
        LIST_DATA (state, newData) {
            state.users = newData
        },
        PUSH_DATA (state, newData) {
            state.users.push(newData)
        },
        CHECK_PRIVILEGE (state, editable) {
            state.editingPrivilege = editable
        }

    }
}
