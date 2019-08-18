import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_ERROR, AUTH_LOGOUT } from "../actions/auth"
import {USER_REQUEST} from "../actions/user"
import axios from 'axios'
import {BASE_URL} from "../consts/url";
// https://blog.sqreen.com/authentication-best-practices-vue/
// https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex

export default {
    namespaced: true,
    state: {
        status: '',
        token: localStorage.getItem('apix-token') || '',
    },
    getters: {
        isAuthenticated: state => !!state.token,
        authStatus: state => state.status,
        getToken: state => state.token
    },
    mutations: {
        [AUTH_REQUEST]: (state) => {
            state.status = 'loading'
        },
        [AUTH_SUCCESS]: (state, token) => {
            state.status = 'success'
            state.token = token
        },
        [AUTH_ERROR]: (state) => {
            state.status = 'error'
        },
        [AUTH_LOGOUT]: (state) => {
            state.status = 'logout'
            state.token = ''
        }
    },
    actions: {
        [AUTH_REQUEST]: ({commit, dispatch}, user) => {
            return new Promise(((resolve, reject) => {
                commit(AUTH_REQUEST)
                axios({url: BASE_URL + '/auth/login', data: user, method: 'POST'})
                    .then(response => {
                        const token = response.data.token
                        localStorage.setItem('apix-token', token)
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                        commit(AUTH_SUCCESS, token)

                        dispatch('user/' + USER_REQUEST, null, {root: true}) // to log in user
                        resolve(response)
                    })
                    .catch(error => {
                        commit(AUTH_ERROR, error)
                        localStorage.removeItem('apix-token')
                        reject(error)
                    })
            }))
        },

        [AUTH_LOGOUT]: ({commit}) => {
            return new Promise(((resolve) => {
                commit(AUTH_LOGOUT)
                localStorage.removeItem('apix-token')
                delete  axios.defaults.headers.common['Authorization']
                resolve()
            }))
        }
    }
}
