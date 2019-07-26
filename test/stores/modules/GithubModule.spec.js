import GithubModule from "@/stores/modules/GithubModule.js"
import { createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {BASE_URL} from "@/stores/actions/const";
import flushPromises from "flush-promises";

const localVue = createLocalVue()
localVue.use(Vuex)

describe('github unit test', () => {
    let store;
    let http;
    beforeEach(() => {
        // jest.clearAllMocks()
        const state = {
            owner: {},
            repos: {},
            content: undefined
        }
        const mutations = GithubModule.mutations;
        const getters = GithubModule.getters;
        const actions = GithubModule.actions;

        store = new Vuex.Store({state, getters, mutations, actions})
        http = new MockAdapter(axios);
    })

    beforeAll(() => {

    })
    afterEach(() => {
        http.reset()
    })
    afterAll(() => {
        http.restore()
    })

    test('should fetch Owner', async () => {
        let expected = {
            id: "id",
            login: "login",
            username: "username"

        }
        http.onGet(BASE_URL + '/github/api/user').reply(200, {
            data: expected
        });
        store.dispatch('fetchOwner')
        await flushPromises()
        store.commit('ASSIGN_OWNER', expected)
        expect(store.state.owner).toEqual(expected);
        expect(store.getters.getOwner).toEqual(expected);
        expect(store.getters.isOwnerLoaded).toBeTruthy();
    })

    test('should fetch repo',async () => {
        let expected = {
            id: "id",
            name: "repo",
            fullName: "owner/repo",
            description: "unit test",
            ownerName: "owner"
        }
        http.onGet(BASE_URL + '/github/api/user/repos').reply(200, {
            data: expected
        });
        store.dispatch('fetchRepos')
        await flushPromises()
        store.commit('ASSIGN_REPOS', expected)
        expect(store.state.repos).toEqual(expected);
        expect(store.getters.getRepos).toEqual(expected);
    })
})