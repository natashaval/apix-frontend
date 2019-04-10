import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from "../actions/user";
import { AUTH_LOGOUT } from "../actions/auth";
import axios from 'axios'

export default {
    namespaced: true,
    state: {
        status: '',
        profile: {}
    },
    getters: {
        getProfile: state => state.profile,
        isProfileLoaded: state => !!state.profile.username
    },
    actions: {
        [USER_REQUEST]: ({commit, dispatch}) => {
            commit(USER_REQUEST)
            axios({url: 'http://localhost:8080/profile'})
                .then(resp => {
                    commit(USER_SUCCESS, resp)
                })
                .catch(resp => {
                    commit(USER_ERROR)
                    dispatch(AUTH_LOGOUT)
                })
        }
    },
    mutations: {
        [USER_REQUEST]: (state) => {
            state.status = 'loading'
        },
        [USER_SUCCESS]: (state, resp) => {
            state.status = 'success'
            state.profile = resp
        },
        [USER_ERROR]: (state) => {
            state.status = 'error'
        },
        [AUTH_LOGOUT]: (state) => {
            state.profile = {}
        }

    }
}