import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import TeamList from "@/components/teams/TeamList"
import Vuex from "vuex";
import axios from "axios";
import flushPromises from 'flush-promises';
import {BASE_URL} from "@/stores/actions/const";
import MockAdapter from "axios-mock-adapter";
import ApixUtil from "../../../src/utils/ApixUtil";

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

const authGetters = {
    isAuthenticated: () => true
}
const userGetters = {
    getProfile: function() {
        return {
            "success": true,
            "message": "User is authenticated!",
            "username": "username",
            "roles": ["ROLE_USER", "ROLE_ADMIN"],
            "teams": ["TEAMS"]
        }
    }
}

const store = new Vuex.Store({
    modules: {
        auth: {
            getters: authGetters
        },
        user: {
            getters: userGetters
        }
    }
})

describe('team list', () => {
    let wrapper

    let methods = {
        loadTeam: jest.fn()
    }

    afterEach(() => {
        // https://www.mazipan.xyz/unit-testing-guide-in-vuejs/#Testing-Pemanggilan-Rest-API
        jest.clearAllMocks()
    })

    beforeEach(() => {
        wrapper = shallowMount(TeamList, {
            localVue,
            computed: {
                profile: () => 'test',
                isAuthenticated: () => true,
                grantUser: function () {
                    return [
                        {
                            "id": "123",
                            "name": "grant",
                            "access": "PUBLIC",
                            "creator": "public",
                            "members": [
                                {"username": "public", "grant": true},
                                {"username": "test", "grant": true}
                            ]
                        }
                    ]
                },
                ungrantUser: function () {
                    return [
                        {
                            "id": "789",
                            "name": "ungrant",
                            "access": "PRIVATE",
                            "creator": "private",
                            "members": [
                                {"username": "private", "grant": true},
                                {"username": "test", "grant": false}
                            ]
                        }
                    ]
                },
                filterTeam: jest.fn()
            },
            methods: methods,
            stubs: {
                'route-link' : true,
                TeamCard: {
                    render: () => {},
                    methods : {
                        confirm : jest.fn(),
                        viewTeam : jest.fn()
                    }
                }
            }
        })
    })

    test('mounted call methods', () => {
        expect(methods.loadTeam).toHaveBeenCalled();
    })

})

describe('mock http', function () {
    /*
    let http
    let wrapper
    beforeAll(() => {
        http = new MockAdapter(axios)
    })
    afterEach(() => {
        http.reset()
        jest.clearAllMocks()
    })
    afterAll(() => {
        http.restore()
    })
    beforeEach(() => {
        wrapper = shallowMount(TeamList, {
            localVue,
            data: function() {
                return {
                    teams: [],
                    searchTeam: ''
                }
            },
            stubs: {
                'route-link' : true,
                TeamCard: {
                    render: () => {},
                    methods : {
                        confirm : jest.fn(),
                        viewTeam : jest.fn()
                    }
                }
            }
        })
    })
    */
    let wrapper
    beforeEach(() => {
        wrapper = mount(TeamList, {
            localVue,
            store,
            stubs: {
                'route-link' : true,
                TeamCard: {
                    render: () => {},
                    methods : {
                        confirm : jest.fn(),
                        viewTeam : jest.fn()
                    },
                    computed: {
                        profile: jest.fn()
                    }
                }
            }
        })
    })

    test('axios on get load team', async (done) => {
        const mockSuccessResponse = [
            {
                "id": "123",
                "name": "grant",
                "access": "PUBLIC",
                "creator": "public",
                "members": [
                    {"username": "public", "grant": true},
                    {"username": "test", "grant": true}
                ]
            },
            {
                "id": "789",
                "name": "ungrant",
                "access": "PRIVATE",
                "creator": "private",
                "members": [
                    {"username": "private", "grant": true},
                    {"username": "test", "grant": false}
                ]
            }
        ]
        const mockFetchPromise = Promise.resolve({
            data: mockSuccessResponse
        })
        axios.get = jest.fn().mockResolvedValue(mockFetchPromise)
        await wrapper.vm.loadTeam()
        expect(axios.get).toHaveBeenCalledTimes(1)
        expect(axios.get).toHaveBeenCalledWith(BASE_URL + '/teams/my-team')
        // expect(wrapper.vm.teams).toEqual(mockSuccessResponse)
        done()
        /*
        let expected = [{
            "id": "5d1727316c555e0d88d14d17",
            "name": "ho",
            "access": "PRIVATE",
            "creator": "bebek",
            "members": [
                {
                    "username": "bebek",
                    "grant": true
                }
            ]
        }]
        http.onGet(BASE_URL + '/teams/my-team').reply(200, {data: expected})
        // wrapper.vm.loadTeam()
        await flushPromises();
        console.log(wrapper.vm.teams.length)
        */
    })
});