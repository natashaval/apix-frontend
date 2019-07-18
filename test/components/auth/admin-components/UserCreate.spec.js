import {shallowMount, createLocalVue, mount} from "@vue/test-utils";
import UserCreate from "@/components/auth/admin-components/UserCreate.Vue"
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {BASE_URL} from "@/stores/actions/const";
import AdminModule from "@/stores/modules/AdminModule";

// https://vuejs.org/v2/cookbook/unit-testing-vue-components.html
// https://medium.com/@lachlanmiller_52885/mocking-vuex-in-vue-unit-tests-b6eda1c4d301

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        admin: {
            namespaced: true,
            state: {
                users: [
                    {
                        id: '123',
                        username: 'admin',
                        roles: ['ROLE_ADMIN'],
                        teams: []
                    }
                ]
            },
            getters: AdminModule.getters,
            actions: {
                fetchAllUsersData: ({commit}) => {

                },
                addUser: () => {
                    jest.fn(() => Promise.resolve());
                }
            },
            mutations: {
                LIST_DATA(state, {users}) {
                    state.users = users
                }
            }
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
        }
    })
}

describe('display users test', () => {
    test('will create with no username', () => {
        const wrapper = factory()
        expect(wrapper.find('#input-live-feedback').text()).toEqual('Enter at least 4 letters')
    })
})

describe('try axios in submit', () => {
    let http;
    beforeAll(() => {
        http = new MockAdapter(axios);
    })
    afterEach(() => {
        http.reset()
    })
    afterAll(() => {
        http.restore()
    })

    test('will submit user', async () => {
        let payload = {
            'username' : 'username',
            'password': 'password',
            'confirmPassword': 'password'
        }
        const wrapper = factory()
        let expected = {
            success: true,
            message: 'User is created!'
        }
        wrapper.find('[name=username]').setValue('username')
        wrapper.find('[name=password]').setValue('password')
        wrapper.find('[name=confirm-password]').setValue('password')
        wrapper.find('[type=submit]').trigger('click')

        const event = Object.assign(jest.fn(), {preventDefault: () => {}})
        http.onPost(BASE_URL + '/admin/users').reply(200, {data: {
                success: true,
                message: 'User is created!',
                new_user: '123'
            }
        })

        let res = wrapper.vm.onSubmit(event)
        console.log(store.getters['admin/getUsers'])
        // wrapper.vm.$nextTick(() => {
        //     console.log(store.getters['admin/getUsers'])
        // })
        // expect(ApixUtil.isEqualObject(res, expected)).toBeTruthy()
    })
})