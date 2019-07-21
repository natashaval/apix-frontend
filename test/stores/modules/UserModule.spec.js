import UserModule from "@/stores/modules/UserModule.js"
import { createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {BASE_URL} from "@/stores/actions/const";
import {COMPLETE, IN_PROCESS, NOT_START} from "@/stores/consts/FetchStatus";
import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from "@/stores/actions/user.js";
import { AUTH_LOGOUT } from "@/stores/actions/auth.js";

const localVue = createLocalVue()
localVue.use(Vuex)

describe('user module test', () => {
    let store;
    beforeEach(() => {
        const state = {
            status: '',
            profile: {},
            editingPrivilege: undefined,
            fetchStatus : NOT_START,
        }
        const mutations = UserModule.mutations;
        const getters = UserModule.getters;
        const actions = UserModule.actions;

        store = new Vuex.Store({state, getters, mutations, actions})
    })

    test('mutation in fetchStatus', () => {
        expect(store.state.fetchStatus).toEqual(NOT_START)
        store.commit('SET_STATUS', COMPLETE)
        expect(store.state.fetchStatus).toEqual(COMPLETE)
        expect(store.getters.getFetchStatus).toEqual(COMPLETE)
    })

    test('mutation in User Request', () => {
        store.commit('USER_REQUEST')
        expect(store.state.status).toEqual('loading')
    })

    test('mutation in User Error', () => {
        store.commit('USER_ERROR')
        expect(store.state.status).toEqual('error')
    })

    test('mutation in user success and save profile', () => {
        let expected = {
            data: {
                "success": true,
                "message": "User is authenticated!",
                "username": "username",
                "roles": ["ROLE_USER", "ROLE_ADMIN"],
                "teams": ["TEAMS"]
            }
        }

        store.commit('USER_SUCCESS', expected)
        expect(store.state.status).toEqual('success')
        expect(store.state.profile).toEqual(expected.data)
        expect(store.getters.isProfileLoaded).toEqual(true)
        expect(store.getters.getProfile).toEqual(expected.data)

        store.commit('AUTH_LOGOUT')
        expect(store.state.profile).toEqual({})
        expect(store.getters.isProfileLoaded).toEqual(false)
    })
})