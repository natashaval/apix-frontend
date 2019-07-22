import LayoutModule from "@/stores/modules/LayoutModule.js"
import { createLocalVue } from "@vue/test-utils";
import Vuex from 'vuex'
import {EDITOR_LAYOUT} from "../../../src/consts/LayoutMode";

const localVue = createLocalVue()
localVue.use(Vuex)

describe('define layout', () => {
    let store;
    beforeEach(() => {
        const mutations = LayoutModule.mutations;
        const getters = LayoutModule.getters;
        const state = LayoutModule.state;

        store = new Vuex.Store({state, getters, mutations})
    })

    test('check layout state', () => {
        expect(store.state.layout).toEqual('')

        store.commit('SET_LAYOUT', EDITOR_LAYOUT)
        expect(store.state.layout).toEqual('editor-layout')
        expect(store.getters.getLayout).toEqual('editor-layout')
    })
})