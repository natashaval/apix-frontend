import {shallowMount} from "@vue/test-utils";
import TeamDetail from "@/components/teams/team-components/TeamDetail.vue"

describe('unit test team detail', () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(TeamDetail, {
            propsData: {
                team: {
                    "id": "123",
                    "name": "Test",
                    "access": "PUBLIC",
                    "creator": "creator",
                    "members": [
                        {"username": "public", "grant": true},
                        {"username": "test", "grant": true}
                    ]
                },
                isCreator: true
            }
        })
    })

    test('team detail list', () => {
        expect(wrapper.find('[name="team-name"]').text()).toEqual("Team Test")
        expect(wrapper.find('[name="team-access-public"]').exists()).toBeTruthy()
        expect(wrapper.find('[name="team-access-public"]').text()).toEqual('Public')
        expect(wrapper.find('[name="team-access-private"]').exists()).toBeFalsy()
        expect(wrapper.find('[name="team-creator"]').text()).toEqual('creator')
        expect(wrapper.find('[name="is-creator"]').exists()).toBeTruthy()
    })
})