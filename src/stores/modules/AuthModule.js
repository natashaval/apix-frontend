import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_ERROR, AUTH_LOGOUT } from "../actions/auth"
import {USER_REQUEST} from "../actions/user"
import axios from 'axios'
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
        authStatus: state => state.status
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
            state.token = ''
        }
    },
    actions: {
        [AUTH_REQUEST]: ({commit, dispatch}, user) => {
            return new Promise(((resolve, reject) => {
                commit(AUTH_REQUEST)
                axios({url: 'http://localhost:8080/auth/login', data: user, method: 'POST'})
                    .then(resp => {
                        const token = resp.data.token
                        localStorage.setItem('apix-token', token)
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                        commit(AUTH_SUCCESS, resp)

                        dispatch(USER_REQUEST) // to log in user
                        resolve(resp)
                    })
                    .catch(err => {
                        commit(AUTH_ERROR, err)
                        localStorage.removeItem('apix-token')
                        reject(err)
                    })
            }))
        },

        [AUTH_LOGOUT]: ({commit, dispatch}) => {
            return new Promise(((resolve, reject) => {
                commit(AUTH_LOGOUT)
                localStorage.removeItem('apix-token')
                delete  axios.defaults.headers.common['Authorization']
                resolve()
            }))
        }
    }
}