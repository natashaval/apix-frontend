import {shallowMount, mount, createLocalVue} from "@vue/test-utils";
import MenuBar from "@/layouts/MenuBar.vue"
import Vuex from "vuex";
import BootstrapVue from "bootstrap-vue";
import VueRouter from 'vue-router';
import {NOT_START} from "../../src/stores/consts/FetchStatus";
import {AUTH_REQUEST, AUTH_LOGOUT} from "@/stores/actions/auth";
import AuthModule from "../../src/stores/modules/AuthModule";
import UserModule from "../../src/stores/modules/UserModule";
import ProjectsList from "../../src/components/projects/ProjectsList";
import TeamList from "../../src/components/teams/TeamList";
import UserViewer from "../../src/components/auth/admin-components/UserViewer";
import AuthLogin from "../../src/components/auth/AuthLogin";

// https://lmiller1990.github.io/vue-testing-handbook/vuex-in-components.html#using-createlocalvue-to-test-store-state
const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
// localVue.use(VueRouter)

const routes = [
    { name: 'project-repo', path: '/projects', components: ProjectsList },
    { name: 'user-viewer', path: '/admin/users', components: UserViewer },
    { name: 'team-list', path: '/teams', components: TeamList },
    { name: 'auth-login', path: '/login', components: AuthLogin }
]
const router = new VueRouter({routes})

const store = new Vuex.Store({
    modules: {
        auth: {
            namespaced: true,
            state: {
                status: 'success',
                token: 'token'
            },
            getters: AuthModule.getters,
            actions: {
                AUTH_REQUEST: () => {
                    jest.fn(() => Promise.resolve());
                },
                AUTH_LOGOUT: () => {
                    jest.fn(() => Promise.resolve());
                }
            }
        },
    }
})

describe('menu bar tests', () => {
    let wrapper
    beforeEach(()=> {
        wrapper = mount(MenuBar, {
            localVue,
            router,
            store,
            computed: {
                isAdmin: () => true,
                isAuthenticated: () => true,
                isProfile: () => true,
                profile: () => {
                    return {
                        'success': true,
                        'message': 'User is authenticated!',
                        'username': 'test',
                        'roles': ['ROLE_USER', 'ROLE_ADMIN'],
                        'teams': ['team-test']
                    }
                }
            },
            stubs: {
                'route-link': true
            },
            // mocks: {
            //     $route: routes
            // }
        })
    })

    test('user profile name', () => {
        expect(wrapper.find('#profile-username').text()).toEqual('test')
    })

    test('menu bar navbar item', () => {
        expect(wrapper.text().trim()).toEqual('APIX  Projects Teams Users  test Logout')
    })

    test.skip('team menu clicked', async () => {
        wrapper.find('#menu-teams').trigger('click')
        await wrapper.vm.$nextTick();
        console.log(wrapper.vm.$route.name)
        // expect(wrapper.vm.$route.name).toEqual('project-repo')
        // expect(wrapper.vm.$route.path).toHaveBeenCalledWith('/projects')
        // https://medium.com/@sarngru/vue-router-unit-testing-navigation-6cc0b0f86811
    })

    test('logout user and should return to login page', async () => {
        wrapper.find('#profile-logout').trigger('click')
        wrapper.vm.logout();
        await wrapper.vm.$nextTick();
        // console.log(wrapper.vm.$route);
        expect(wrapper.vm.logout()).toHaveBeenCalled();
        // expect(wrapper.vm.$route.name).toEqual('auth-login')
        // expect(wrapper.vm.$route.path).toHaveBeenCalledWith('/login')
    })
})