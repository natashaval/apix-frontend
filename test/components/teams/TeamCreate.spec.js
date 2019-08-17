import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import TeamCreate from "@/components/teams/TeamCreate"
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import flushPromises from 'flush-promises';
import Vuex from "vuex";
import {BASE_URL} from "../../../src/stores/consts/url";
import ApixUtil from "../../../src/utils/ApixUtil";

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

// https://lmiller1990.github.io/vue-testing-handbook/components-with-props.html#refactor-with-a-factory-function
const factory = (propsData) => {
    return mount(TeamCreate, {
        localVue,
        // store,
        propsData: {
            ...propsData
        },
        computed: {
            profile: function () {
                return {
                    'success': true,
                    "message": "User is authenticated!",
                    'username': 'username',
                    "roles": ["ROLE_USER", "ROLE_ADMIN"],
                    "teams": ["TEAMS"]
                }
            },
            filterUser: () => ['user1', 'user2', 'user3']
        }
    })
}

describe('team create test', () => {
    let wrapper
    // let http
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('load users', async () => {
        let wrapper = factory();
        let expected = [{
            id: 'id',
            username: 'bebek',
            roles: ['ROLE_USER'],
            teams: ['TEAMS']
        }]

        axios.get = jest.fn().mockResolvedValue(Promise.resolve({
            data: expected
        }))

        wrapper.vm.loadUsers()
        await flushPromises()
        expect(axios.get).toHaveBeenCalledTimes(1)
        expect(axios.get).toHaveBeenCalledWith(BASE_URL + '/admin/users')
        // console.log('users', wrapper.vm.users)
        expect(wrapper.vm.users.length).toEqual(1);
        // done()

    })

    test('create payload for invite', () => {
        let wrapper = factory({
            isInvite: true,
            isRemove: false,
            teamInvite: {
                "id": "456",
                "name": "TeamName",
                "access": "PRIVATE",
                "creator": "creator",
                "members": []
            }
        })
        console.log('factory isInvite', wrapper.vm.isInvite, wrapper.vm.teamInvite)
        wrapper.find('#user1').setChecked(true)
        wrapper.find('#user2').setChecked(true)
        let res = wrapper.vm.createPayload()
        console.log(res)
        expect(wrapper.find('.title').text()).toEqual('Invite Members of TeamName')

        let payload = {
            teamName: 'New Team',
            access: 'PRIVATE',
            creator: 'username',
            members: ['user1', 'user2'],
        }

        expect(ApixUtil.isEqualObject(res, payload))

    })

    test('create payload for create team', () => {
        let wrapper = factory()
        wrapper.find('#create-name').setValue('New Team')
        wrapper.find('select').findAll('option').at(1).setSelected()
        wrapper.find('#user1').setChecked(true)
        wrapper.find('#user2').setChecked(true)
        let res = wrapper.vm.createPayload()
        console.log(res)
        expect(wrapper.find('.title').text()).toEqual('Create Team')
        expect(ApixUtil.isEqualObject(res, {
            teamName: 'New Team',
            access: 'PRIVATE',
            creator: 'username',
            members: ['user1', 'user2'],
        }))
    })

    test('reset form of create team', () => {
        let wrapper = factory()
        wrapper.find('#create-name').setValue('New Team')
        wrapper.find('select').findAll('option').at(1).setSelected()
        wrapper.find('#user1').setChecked(true)
        wrapper.find('#user2').setChecked(true)

        let elem = wrapper.find("form").trigger("reset")
        expect(wrapper.vm.name).toEqual('')
        expect(wrapper.vm.access).toEqual('PUBLIC')
        expect(wrapper.vm.searchUser).toEqual('')
        expect(ApixUtil.isEqualArray(wrapper.vm.selectedMember, [])).toBeTruthy()
    })

    test('submit create team', () => {
        let wrapper = factory()
        wrapper.find('#create-name').setValue('New Team')
        wrapper.find('select').findAll('option').at(1).setSelected()
        wrapper.find('#user1').setChecked(true)
        wrapper.find('#user2').setChecked(true)

        const mockSuccessResponse = {
            success: true,
            message: 'Team is created!'
        }
        axios.post = jest.fn().mockResolvedValue(Promise.resolve({
            data: mockSuccessResponse
        }))

        let payload = {
            teamName: 'New Team',
            access: 'PRIVATE',
            creator: 'username',
            members: ['user1', 'user2'],
        }
        // https://lmiller1990.github.io/vue-testing-handbook/simulating-user-input.html#creating-the-component
        let elem = wrapper.find("form").trigger("submit.prevent")
        expect(axios.post).toHaveBeenCalledTimes(1)
        expect(axios.post).toHaveBeenCalledWith(BASE_URL + '/teams', payload)
    })

    test('submit invite team', () => {
        let wrapper = factory({
            isInvite: true,
            isRemove: false,
            teamInvite: {
                "id": "456",
                "name": "TeamName",
                "access": "PRIVATE",
                "creator": "creator",
                "members": []
            }})
        wrapper.setData({show: true})
        wrapper.find('#user1').setChecked(true)
        wrapper.find('#user2').setChecked(true)

        const mockSuccessResponse = {
            success: true,
            message: 'Members have been invited!'
        }
        axios.put = jest.fn().mockResolvedValue(Promise.resolve({
            data: mockSuccessResponse
        }))

        let payload = {
            teamName: 'TeamName',
            members: ['user1', 'user2'],
            invite: false
        }
        // https://lmiller1990.github.io/vue-testing-handbook/simulating-user-input.html#creating-the-component
        let elem = wrapper.find("form").trigger("submit.prevent")
        expect(axios.put).toHaveBeenCalledTimes(1)
        expect(axios.put).toHaveBeenCalledWith(BASE_URL + '/teams/TeamName/invite', payload)
    })

    test('submit remove team', () => {
        let wrapper = factory({
            isInvite: false,
            isRemove: true,
            teamInvite: {
                "id": "456",
                "name": "TeamName",
                "access": "PRIVATE",
                "creator": "creator",
                "members": [{
                    username: 'member1',
                    grant: true
                }]
            }})
        wrapper.setData({show: true})
        wrapper.find('#user1').setChecked(true)
        wrapper.find('#user2').setChecked(true)

        const mockSuccessResponse = {
            success: true,
            message: 'Members have been removed from team TeamName!'
        }
        axios.put = jest.fn().mockResolvedValue(Promise.resolve({
            data: mockSuccessResponse
        }))

        let payload = {
            teamName: 'TeamName',
            members: ['user1', 'user2'],
            invite: false
        }
        // https://lmiller1990.github.io/vue-testing-handbook/simulating-user-input.html#creating-the-component
        let elem = wrapper.find("form").trigger("submit.prevent")
        expect(axios.put).toHaveBeenCalledTimes(1)
        expect(axios.put).toHaveBeenCalledWith(BASE_URL + '/teams/TeamName/remove', payload)
    })
})