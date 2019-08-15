import {createLocalVue, shallowMount} from "@vue/test-utils"
import AuthLogin from "@/components/auth/AuthLogin"
import Vuex from "vuex"
import AuthModule from "@/stores/modules/AuthModule"
import BootstrapVue from "bootstrap-vue"
import VueRouter from 'vue-router'
import ProjectsList from "@/components/projects/ProjectsList"
import LayoutModule from "@/stores/modules/LayoutModule"

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
