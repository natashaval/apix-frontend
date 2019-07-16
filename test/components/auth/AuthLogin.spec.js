import {createLocalVue, shallowMount} from "@vue/test-utils";
import AuthLogin from "@/components/auth/AuthLogin.Vue"
import Vuex from "vuex"
import AuthModule from "@/stores/modules/AuthModule.js"
import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)

const store = new Vuex.Store({
    auth: {
        namespaced: true,
        state: {
            status: 'success',
            token: 'token'
        },
        getters: AuthModule.getters
    }
})

const factory = (values = {}) => {
    return shallowMount(AuthLogin, {
        localVue,
        store,
        data() {
            return {
                values
            }
        }
    })
}

describe('login user', () => {
    test('will login user', () => {
        const wrapper = factory({
            'username': 'username',
            'password': 'password'
        })
        let expected = {
            success: true,
            message: 'User is authenticated!',
            token: 'token'
        }
        wrapper.find('[name=username]').setValue('username')
        wrapper.find('[name=password]').setValue('password')
        wrapper.find('[type=submit]').trigger('click')
        let res = wrapper.vm.login()
        console.log(res)

    })
})