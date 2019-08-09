import {shallowMount, createLocalVue} from "@vue/test-utils";
import UserViewer from "@/components/auth/admin-components/UserViewer"
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import AdminModule from "@/stores/modules/AdminModule";

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

const actions = {
    fetchAllUsersData: () => jest.fn(),
    addUser: () => jest.fn()
}

const store = new Vuex.Store({
    modules: {
        admin: {
            namespaced : true,
            state: {
                users: [{
                    id: 'user-id',
                    username: 'username',
                    roles: ['ROLE_USER', 'ROLE_ADMIN'],
                    teams: ['TEAMS']
                }]
            },
            getters: AdminModule.getters,
            actions: actions
        }
    }
})

describe('admin view users management page and users is already exists', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallowMount(UserViewer, {
            localVue,
            store,
        })
    })

    test('test computed property', () => {
        console.log(wrapper.vm.users)
        expect(wrapper.vm.users.length).toEqual(1);
    })
})

describe('admin created where user has not exist', () => {
    test.skip('dispatch admin user', () => {
        let wrapper = shallowMount(UserViewer, {
            localVue,
            store,
            computed: {
                users: () => [],
            }
        })

        console.log('jan', wrapper.vm.users)
        // expect(actions.fetchAllUsersData.length).toBe(1);
        expect(actions.fetchAllUsersData()).toHaveBeenCalledWith("admin/fetchAllUsersData");
        // console.log(actions.fetchAllUsersData);
        // expect(actions.fetchAllUsersData.mock.calls.length).toBe(1);
        // console.log('after', wrapper.vm.users)
    })
})
