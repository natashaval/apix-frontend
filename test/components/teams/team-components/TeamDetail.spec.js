import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import TeamDetail from "@/components/teams/team-components/TeamDetail.vue"
import VueRouter from 'vue-router'
import BootstrapVue from "bootstrap-vue";
import TeamCreate from "@/components/teams/TeamCreate";

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(VueRouter)

const routes = [{
    name: 'team-create', path: '/team/new-team', component: TeamCreate }]
const router = new VueRouter({routes})

describe('unit test team detail', () => {
    let wrapper

    beforeEach(() => {
        jest.clearAllMocks()
        wrapper = mount(TeamDetail, {
            localVue,
            router,
            propsData: {
                team: {
                    "id": "123",
                    "name": "Test",
                    "access": "PUBLIC",
                    "creator": "creator",
                    "members": [
                        {"username": "public", "grant": true},
                        {"username": "test", "grant": true}
                    ]
                },
                isCreator: true
            },
            stubs: {
                'router-link': true
            }
        })
    })

    test('team detail list', () => {
        expect(wrapper.find('[name="team-name"]').text()).toEqual("Team Test")
        expect(wrapper.find('[name="team-access-public"]').exists()).toBeTruthy()
        expect(wrapper.find('[name="team-access-public"]').text()).toEqual('Public')
        expect(wrapper.find('[name="team-access-private"]').exists()).toBeFalsy()
        expect(wrapper.find('[name="team-creator"]').text()).toEqual('creator')
        expect(wrapper.find('[name="is-creator"]').exists()).toBeTruthy()
    })

    test('click on invite member to team', () => {
        let elem = wrapper.find('[name="route-invite"]')
        elem.trigger('click')
        expect(wrapper.vm.$route.name).toEqual('team-create')
        expect(wrapper.vm.$route.path).toEqual('/team/new-team')
    })

    test('click on remove member from team', () => {
        let elem = wrapper.find('[name="route-remove"]')
        elem.trigger('click')
        expect(wrapper.vm.$route.name).toEqual('team-create')
        expect(wrapper.vm.$route.path).toEqual('/team/new-team')
    })
})