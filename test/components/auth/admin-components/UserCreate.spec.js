import {shallowMount, createLocalVue, mount} from "@vue/test-utils";
import UserCreate from "@/components/auth/admin-components/UserCreate.Vue"
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import {BASE_URL} from "@/stores/actions/const";
import AdminModule from "@/stores/modules/AdminModule";

// https://vuejs.org/v2/cookbook/unit-testing-vue-components.html
// https://medium.com/@lachlanmiller_52885/mocking-vuex-in-vue-unit-tests-b6eda1c4d301

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)

let actions = {
    fetchAllUsersData: jest.fn(),
    addUser: jest.fn()
}
let state = {
    users: [
        {
            id: '123',
            username: 'admin',
            roles: ['ROLE_ADMIN'],
            teams: []
        }
    ]
}

const store = new Vuex.Store({
    modules: {
        admin: {
            namespaced: true,
            state: state,
            getters: AdminModule.getters,
            actions: actions,
            mutations: AdminModule.mutations
        }
    }
})

const factory = (values = {}) => {
    return mount(UserCreate, {
        localVue,
        store,
        data() {
            return {
                values
            }
        },
        // computed: {
        //     nameState: () => {
        //         return values.user.username.length >= 4 ? true : false
        //     }
        // }
    })
}

describe('display users test', () => {
    test('input empty username and show input invalid length < 4', () => {
        const wrapper = factory()
        expect(wrapper.vm.nameState).toBeFalsy()
        expect(wrapper.find('#input-live-feedback').text()).toEqual('Enter at least 4 letters')
    })

    test('input username with length > 4', () => {
        const wrapper = factory({user: {username: ''}});
        wrapper.find('[name=username]').setValue('username')
        expect(wrapper.vm.nameState).toBeTruthy()
    })
})

describe('try axios in submit', () => {
    let http;
    /*
    let adminStore;
    let adminActions = {
        fetchAllUsersData: jest.fn(),
        addUser: jest.fn()
    }
    let adminState = {
        users: [{
            id: 'user-id',
            username: 'username',
            roles: ['ROLE_USER', 'ROLE_ADMIN'],
            teams: ['TEAMS']
        }]
    }
    */
    beforeAll(() => {
        http = new MockAdapter(axios);
        // adminStore = new Vuex.Store({
        //     state: adminState,
        //     actions: adminActions,
        //     getters: AdminModule.getters,
        //     mutations: AdminModule.mutations
        // })
    })
    afterEach(() => {
        http.reset()
    })
    afterAll(() => {
        http.restore()
    })

    test('will submit user', async () => {
        const wrapper = factory()
        wrapper.find('[name=username]').setValue('username')
        wrapper.find('[name=password]').setValue('password')
        wrapper.find('[name=confirm-password]').setValue('password')
        wrapper.find('[type=submit]').trigger('click')

        const event = Object.assign(jest.fn(), {preventDefault: () => {}})
        http.onPost(BASE_URL + '/admin/users').reply(200, {data: {
                success: true,
                message: 'User is created!',
                new_user: '456'
            }
        })

        wrapper.vm.onSubmit(event)
        await flushPromises();
        expect(actions.addUser).toHaveBeenCalled()
        // console.log(store.getters['admin/getUsers'])
    })
})