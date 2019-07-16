import {shallowMount, createLocalVue} from "@vue/test-utils";
import UserCreate from "@/components/auth/admin-components/UserCreate.Vue"
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import ApixUtil from "../../../../src/utils/ApixUtil";

// https://vuejs.org/v2/cookbook/unit-testing-vue-components.html

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)

const factory = (values = {}) => {
    return shallowMount(UserCreate, {
        localVue,
        data() {
            return {
                values
            }
        }
    })
}

describe('Create User tests', () => {
    test('will create with no username', () => {
        const wrapper = factory()
        expect(wrapper.find('#input-live-feedback').text()).toEqual('Enter at least 4 letters')
    })

    test.skip('should submit user', () => {
        const wrapper = factory({
            'username' : 'username',
            'password': 'password',
            'confirmPassword': 'password'
        })
        let expected = {
            success: true,
            message: 'User is created!'
        }
        // wrapper.find('[name=username]').setValue('username')
        // wrapper.find('[name=password]').setValue('password')
        // wrapper.find('[name=confirm-password]').setValue('password')

        wrapper.find('#input-username').setValue('username')
        wrapper.find('#input-password').setValue('password')
        wrapper.find('#input-confirm-password').setValue('password')
        wrapper.find('[type=submit]').trigger('click')

        const event = Object.assign(jest.fn(), {preventDefault: () => {}})
        let res = wrapper.vm.onSubmit(event)
        console.log(res)
        expect(ApixUtil.isEqualObject(res, expected)).toBeTruthy()
    })
})