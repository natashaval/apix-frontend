import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import TeamCard from "@/components/teams/team-components/TeamCard.vue"
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";
import TeamViewer from "@/components/teams/TeamViewer";
import flushPromises from "flush-promises";
import axios from "axios";
import {BASE_URL} from "@/stores/actions/const";
import ApixUtil from "@/utils/ApixUtil";

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueRouter)

const routes = [
    {name: 'team-viewer', path: '/team/:name', component: TeamViewer}
]

describe('team card unit test when granted in my team', () => {
    let wrapper
    const router = new VueRouter({routes})

    beforeEach(() => {
        wrapper = mount(TeamCard, {
            localVue,
            router,
            propsData: {
                isGrant: true,
                teams: [
                    {
                        "id": "123",
                        "name": "TeamPublic",
                        "access": "PUBLIC",
                        "creator": "test",
                        "members": [
                            {"username": "public", "grant": true},
                            {"username": "test", "grant": true}
                        ]
                    },
                    {
                        "id": "789",
                        "name": "TeamPrivate",
                        "access": "PRIVATE",
                        "creator": "private",
                        "members": [
                            {"username": "private", "grant": true},
                            {"username": "test", "grant": false}
                        ]
                    }
                ]
            },
            computed: {
                profile: function() {
                    return {
                        "success": true,
                        "message": "User is authenticated!",
                        "username": "test",
                        "roles": ["ROLE_USER", "ROLE_ADMIN"],
                        "teams": ["TEAMS"]
                    }
                }
            }
        })
    })

    test('should count total of b-card created', () => {
        expect(wrapper.findAll('.team-header').length).toEqual(2)
        expect(wrapper.findAll('h5.team-title').at(0).text()).toEqual('TeamPublic')
        expect(wrapper.findAll('h5.team-title').at(1).text()).toEqual('TeamPrivate')
        // console.log(wrapper.findAll('.team-header').at(0).html())
        expect(wrapper.findAll('.card-header').at(0).classes()).toContain('bg-info')
        expect(wrapper.findAll('.card-header').at(1).classes()).toContain('bg-light')
    })

    test('should route to team viewer', async () => {
        wrapper.findAll('h5.team-title').at(0).trigger('click')
        await flushPromises()
        expect(wrapper.vm.$route.name).toEqual('team-viewer')
        expect(wrapper.vm.$route.path).toEqual('/team/TeamPublic')
        expect(wrapper.vm.$route.params.name).toEqual('TeamPublic')
    })
})

describe('team card need confirmation team', () => {
    let wrapper
    const router = new VueRouter({routes})

    beforeEach(() => {
        jest.clearAllMocks()
        wrapper = mount(TeamCard, {
            localVue,
            router,
            propsData: {
                isGrant: false,
                teams: [
                    {
                        "id": "456",
                        "name": "TeamNot",
                        "access": "PRIVATE",
                        "creator": "my-boss",
                        "members": [
                            {"username": "public", "grant": true},
                            {"username": "test", "grant": false}
                        ]
                    }
                ]
            },
            computed: {
                profile: function() {
                    return {
                        "success": true,
                        "message": "User is authenticated!",
                        "username": "test",
                        "roles": ["ROLE_USER", "ROLE_ADMIN"],
                        "teams": ["TEAMS"]
                    }
                }
            }
        })
    })

    test('section need confirmation and click confirm success', async (done) => {
        expect(wrapper.findAll('.team-header').length).toEqual(1)
        const mockSuccessResponse = {
            success: true,
            message: 'Members have been invited!'
        }
        axios.put = jest.fn().mockResolvedValue(Promise.resolve({
            data: mockSuccessResponse
        }))
        let grantList = {
            invite: true,
            members: ['test'],
            teamName: 'TeamNot'
        }

        let elem = wrapper.findAll('button.confirm-team').at(0);
        elem.trigger('click')
        expect(axios.put).toHaveBeenCalledTimes(1)
        expect(axios.put).toHaveBeenCalledWith(BASE_URL + '/teams/TeamNot/grant', grantList)
        expect(ApixUtil.isEqualObject(wrapper.vm.confirm("TeamNot"), grantList)).toBeTruthy()
        done()
    })

    test('section need confirmation and click confirm failed', async (done) => {
        expect(wrapper.findAll('.team-header').length).toEqual(1)
        console.log(wrapper.findAll('button.confirm-team').at(0).html())
        const mockFailedResponse = {
            success: false,
            message: 'Team does not exist!'
        }
        const mockFetchPromise = Promise.reject(mockFailedResponse)
        axios.put = jest.fn().mockReturnValue(mockFetchPromise)
        let grantList = {
            invite: true,
            members: ['test'],
            teamName: 'TeamNot'
        }

        await wrapper.vm.confirm("TeamNot")
        expect(axios.put).toHaveBeenCalledTimes(1)
        expect(axios.put).toHaveBeenCalledWith(BASE_URL + '/teams/TeamNot/grant', grantList)
        done()
    })
})