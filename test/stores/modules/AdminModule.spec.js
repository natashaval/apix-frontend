import AdminModule from "@/stores/modules/AdminModule.js"
import { createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {BASE_URL} from "../../../src/stores/actions/const";

const localVue = createLocalVue()
localVue.use(Vuex)

describe('admin unit test', () => {
    let store;
    beforeEach(() => {
        const state = {
            users: [{
                id: 'user-id',
                username: 'username',
                roles: ['ROLE_USER', 'ROLE_ADMIN'],
                teams: ['TEAMS']
            }]
        }
        const mutations = AdminModule.mutations;
        const getters = AdminModule.getters;
        const actions = AdminModule.actions;

        store = new Vuex.Store({state, getters, mutations, actions});
    })

    test('should getters user', () => {
        let expected = [{
            id: 'user-id',
            username: 'username',
            roles: ['ROLE_USER', 'ROLE_ADMIN'],
            teams: ['TEAMS']
        }]
        expect(store.getters.getUsers).toEqual(expected)
    })

    test('should do mutation in add user', () => {
        let newUser = {
            id: 'user-id-2',
            username: 'user',
            roles: ['ROLE_USER'],
            teams: ['TEAMS']
        }
        store.commit('PUSH_DATA', newUser)
        expect(store.state.users.length).toEqual(2);
        expect(store.state.users[1]).toEqual(newUser);
    })

    test('should do mutation in list user', () => {
        let expected = [{
            id: 'user-id-2',
            username: 'user',
            roles: ['ROLE_USER'],
            teams: ['TEAMS']
        }]
        store.commit('LIST_DATA', expected)
        expect(store.state.users.length).toEqual(1);
        expect(store.state.users[0]).toEqual(expected[0]);
    })

    test('should dispatch add user', () => {
        let newUser = {
            id: 'user-id-2',
            username: 'user',
            roles: ['ROLE_USER'],
            teams: ['TEAMS']
        }
        store.dispatch('addUser', newUser)
        expect(store.state.users.length).toEqual(2);
        expect(store.state.users[1]).toEqual(newUser);
    })

    test('should dispatch fetch all users from axios', async () => {
        let http = new MockAdapter(axios);
        let expected = [{
            id: 'user-id',
            username: 'username',
            roles: ['ROLE_USER', 'ROLE_ADMIN'],
            teams: ['TEAMS']
        }]
        http.onGet(BASE_URL + '/admin/users').reply(200, {
            data: expected
        });

        await store.dispatch('fetchAllUsersData')
        expect(store.state.users.length).toEqual(1);
        expect(store.state.users[0]).toEqual(expected[0]);

        http.reset();
        http.restore();
    })
})
