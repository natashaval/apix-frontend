import AuthModule from "@/stores/modules/AuthModule.js"
import { createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {BASE_URL} from "@/stores/consts/url";
import flushPromises from "flush-promises";

const localVue = createLocalVue()
localVue.use(Vuex)

describe('auth module unit test', function () {
    let store;

    beforeEach(() => {
        const state = {
            status: '',
            token: ''
        }
        const mutations = AuthModule.mutations;
        const getters = AuthModule.getters;
        const actions = AuthModule.actions;
        store = new Vuex.Store({state, getters, mutations, actions})
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('actions in Auth Request and should success giving token', async () => {
        let http = new MockAdapter(axios);
        let expected = {
            success: true,
            message: 'User is authenticated',
            username: 'test',
            token: 'token'
        }
        let request = {username: 'test', password: 'pass'}
        // axios.post = jest.fn().mockReturnValue(Promise.resolve({data: expected}))
        http.onPost(BASE_URL + '/auth/login', request)
            .reply(200, expected)
        store.dispatch('AUTH_REQUEST', request)
        await flushPromises()
        // expect(axios.post).toHaveBeenCalledTimes(1)
        // expect(axios.post).toHaveBeenCalledWith(BASE_URL + '/auth/login')
        expect(store.state.token).toEqual('token')
        expect(store.state.status).toEqual('success')
        expect(store.getters.isAuthenticated).toBeTruthy()
        expect(store.getters.authStatus).toEqual('success')
        expect(store.getters.getToken).toEqual('token')
        http.reset();
        http.restore();
    })

    test('actions in auth request and should throw error', async () => {
        let http = new MockAdapter(axios);
        let request = {username: 'test', password: 'pass'}
        http.onPost(BASE_URL + '/auth/login', request)
            .reply(500)
        expect(store.dispatch('AUTH_REQUEST', request)).rejects.toThrowError();
        await flushPromises()
        expect(store.state.token).toEqual('')
        expect(store.state.status).toEqual('error')
        expect(store.getters.isAuthenticated).toBeFalsy()
        expect(store.getters.authStatus).toEqual('error')
        expect(store.getters.getToken).toEqual('')
        http.reset();
        http.restore();
    })

    test('actions in auth logout and should remove token', () => {
        store.state.token = 'token'
        store.dispatch('AUTH_LOGOUT')
        expect(store.state.token).toEqual('')
        expect(store.state.status).toEqual('logout')
        expect(store.getters.isAuthenticated).toBeFalsy()
        expect(store.getters.authStatus).toEqual('logout')
        expect(store.getters.getToken).toEqual('')

    })

});
