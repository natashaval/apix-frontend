import {shallowMount, mount, createLocalVue} from "@vue/test-utils";
import MenuBar from "@/layouts/MenuBar.vue"
import Vuex from "vuex";
import BootstrapVue from "bootstrap-vue";
import VueRouter from 'vue-router';
import ProjectsList from "@/components/projects/ProjectsList";
import TeamList from "@/components/teams/TeamList";
import UserViewer from "@/components/auth/admin-components/UserViewer";
import AuthLogin from "@/components/auth/AuthLogin";
import {USER_REQUEST} from "@/stores/actions/user";
import flushPromises from "flush-promises";

// https://lmiller1990.github.io/vue-testing-handbook/vuex-in-components.html#using-createlocalvue-to-test-store-state
const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.use(VueRouter)

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
            getters: {
                isAuthenticated: () => true,
            }
        },
        user: {
            namespaced: true,
            getters: {
                getProfile: function () {
                    return {
                        "username": "test",
                        "roles": ["ROLE_USER", "ROLE_ADMIN"],
                        "teams": ["TEAMS"]
                    }
                },
                isProfileLoaded: () => true
            },
            actions: {
                [USER_REQUEST]: jest.fn()
            }
        }
    }
})

describe('menu bar tests', () => {
    let wrapper
    beforeEach(()=> {
        wrapper = mount(MenuBar, {
            localVue,
            router,
            store,
            stubs: {
                'router-link': true
            }
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
})