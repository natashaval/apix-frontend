import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from "../actions/user";
import { AUTH_LOGOUT } from "../actions/auth";
import axios from 'axios'
import {BASE_URL} from "../actions/const";

export default {
    namespaced: true,
    state: {
        status: '',
        profile: {}
    },
    getters: {
        getProfile: state => state.profile,
        isProfileLoaded: state => !!state.profile.username,
        hasEditingPrivilege : () => true
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
        }

    }
}
