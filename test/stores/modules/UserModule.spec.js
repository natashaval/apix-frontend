import UserModule from "@/stores/modules/UserModule.js"
import { createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {BASE_URL} from "@/stores/consts/url";
import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from "@/stores/actions/user.js";
import { AUTH_LOGOUT } from "@/stores/actions/auth.js";
import flushPromises from "flush-promises";

const localVue = createLocalVue()
localVue.use(Vuex)

describe('user module test', () => {
    let store;
    beforeEach(() => {
        const state = {
            status: '',
            profile: {},
            editingPrivilege: undefined,
        }
        const mutations = UserModule.mutations;
        const getters = UserModule.getters;
        const actions = UserModule.actions;

        store = new Vuex.Store({state, getters, mutations, actions})
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

    test('action user request and should success', async () => {
        expect(store.state.profile).toEqual({})
        let http = new MockAdapter(axios);
        let expected = {
                success: true,
                message: 'User is authenticated!',
                username: 'bebek',
                roles: ['ROLE_USER'],
                teams: ['TEAMS']
        }

        http.onGet(BASE_URL + '/user/profile').reply(200, {
            data: expected
        });
        // const commit = jest.fn()
        store.dispatch('USER_REQUEST');
        await flushPromises();
        expect(store.state.profile).toEqual({data: expected})
        http.reset();
        http.restore();
    })

    test('action user request and give error',async () => {
        expect(store.state.profile).toEqual({})
        let http = new MockAdapter(axios);
        http.onGet(BASE_URL + '/user/profile').reply(403, {
            data: {
                "status": 403,
                "error": "Forbidden",
                "message": "Access Denied",
                "path": "/user/profile"
            }
        });
        store.dispatch('USER_REQUEST');
        await flushPromises();
        expect(store.state.status).toEqual('error')
        http.reset();
        http.restore();
    })
})