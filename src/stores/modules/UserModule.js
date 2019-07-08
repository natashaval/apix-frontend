import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from "../actions/user";
import { AUTH_LOGOUT } from "../actions/auth";
import axios from 'axios'
import {BASE_URL} from "../actions/const";
import {COMPLETE, IN_PROCESS, NOT_START} from "../consts/FetchStatus";

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
        getUsers: state => state.users,
        getFetchStatus : state => state.fetchStatus
    },
    actions: {
        [USER_REQUEST]: ({commit, dispatch, state}) => {
            if(state.fetchStatus === NOT_START || state.fetchStatus === COMPLETE){
                commit('SET_STATUS', IN_PROCESS)
                axios({url: BASE_URL + '/user/profile'})
                    .then(resp => {
                        // commit('SET_STATUS', COMPLETE)
                        state.fetchStatus = COMPLETE
                        commit(USER_SUCCESS, resp)
                    })
                    .catch(resp => {
                        commit(USER_ERROR)
                        commit('SET_STATUS', COMPLETE)
                        dispatch('auth/' + AUTH_LOGOUT, null, {root: true})
                })
            }
        },
        fetchAllUsersData({ commit }){
            let fetchUsers = () => axios.get(BASE_URL + 'admin/users')
                .then((response) => {
                    commit('LIST_DATA', response.data)
                })
            fetchUsers()
        },
        addUser: ({ commit }, payload) => {
            console.log('dispatch add user', payload)
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
        SET_STATUS : (state, status) => {
            state.fetchStatus = status
        },
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
