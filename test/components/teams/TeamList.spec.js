import {createLocalVue, shallowMount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import TeamList from "@/components/teams/TeamList.vue"
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import flushPromises from 'flush-promises';

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('team list', () => {
    let wrapper
    let http
    beforeAll(() => {
        http = new MockAdapter(axios)
    })
    afterEach(() => {
        http.reset()
    })
    afterAll(() => {
        http.restore()
    })

    beforeEach(() => {
        wrapper = shallowMount(TeamList, {
            data: {
                teams: null,
                searchTeam: ''
            }
        })
    })

    test('load team and should show team', () => {

    })
})