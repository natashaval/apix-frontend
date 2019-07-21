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
        fetchStatus : NOT_START,
    },
    getters: {
        getProfile: state => state.profile,
        isProfileLoaded: state => !!state.profile.username,
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
        }
    }
}
