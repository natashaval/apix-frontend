import {createLocalVue, shallowMount} from "@vue/test-utils";
import AuthLogin from "@/components/auth/AuthLogin.Vue"
import Vuex from "vuex"
import AuthModule from "@/stores/modules/AuthModule.js"
import BootstrapVue from "bootstrap-vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {AUTH_REQUEST, AUTH_LOGOUT} from "@/stores/actions/auth";
import ProjectsList from "../../../src/components/projects/ProjectsList";
import {BASE_URL} from "../../../src/stores/actions/const";
import LayoutModule from "../../../src/stores/modules/LayoutModule";

// https://vue-test-utils.vuejs.org/guides/using-with-vue-router.html

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.use(VueRouter)

const routes = [{
    name: 'project-repo',
    path: '/projects',
    component: ProjectsList
}]
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
        layout: {
            namespaced: true,
            state: {
                layout: 'single-layout'
            },
            getters: LayoutModule.getters,
            mutations: LayoutModule.mutations
        }
    }
})

const factory = (values = {}) => {
    return shallowMount(AuthLogin, {
        localVue,
        store,
        router,
        data() {
            return {
                values
            }
        },
        stubs: {
            'route-link': true
        }
    })
}

describe('login user', () => {
    test('will redirect authenticated user', async () => {
        // https://medium.com/@sarngru/vue-router-unit-testing-navigation-6cc0b0f86811
        // https://stackoverflow.com/questions/50233263/how-to-write-jest-unit-test-for-a-vue-form-component-which-uses-a-vuex-store?rq=1
        const wrapper = factory({
            'username': 'username',
            'password': 'password'
        })

        wrapper.find('[name=username]').setValue('username')
        wrapper.find('[name=password]').setValue('password')
        // wrapper.vm.login = jest.fn().mockResolvedValue(true)
        wrapper.find('button').trigger('click')

        wrapper.vm.login()
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$route.name).toEqual('project-repo')
        expect(wrapper.vm.$route.path).toEqual('/projects')
    })
})

describe('actions', () => {
    let http;
    let store;
    beforeAll(() => {
        http = new MockAdapter(axios);
        store = new Vuex.Store({
            modules: {
                auth: {
                    namespaced: true,
                    state: {
                        status: '',
                        token: ''
                    },
                    getters: AuthModule.getters,
                    actions: {
                        AUTH_REQUEST: () => {
                            jest.fn(() => Promise.resolve());
                        }
                    }
                }
            }
        })
    })
    afterEach(() => {
        http.reset()
    })
    afterAll(() => {
        http.restore()
    })

    test('should trigger http login post', () => {
        const fakeUser = {
            success: true,
            message: 'User is authenticated!',
            token: 'token'
        }
        http.onPost(BASE_URL + '/auth/login').reply(200, {data: fakeUser})
        return store.dispatch('auth/' + AUTH_REQUEST)
            .then(() => {
                expect(store.state.status).toEqual('success')
            })
    })
})