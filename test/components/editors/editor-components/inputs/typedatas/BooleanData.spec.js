import { shallowMount } from "@vue/test-utils";
import BooleanData from "@/components/editors/editor-components/inputs/typedatas/BooleanData";

let schemaData = {
    "type": "boolean",
    "required": false,
    "example": true,
    "default": true
}

describe('getAttributes() tests',() => {

    let expected = {type: 'boolean', default : true}

    test('create new',() => {
        const wrapper = shallowMount(BooleanData,{
            propsData:{
                isEditing : true
            }
        })
        expect(wrapper.vm.$props.isEditing).toEqual(true)

        wrapper.find('[name=default-val]').setChecked()
        expect(wrapper.vm.getAttributes()).toEqual(expected)
    })

    test('load avaliable data',() => {
        const wrapper = shallowMount(BooleanData,{
            propsData:{
                isEditing : true,
                schemaData : schemaData
            }
        })
        expect(wrapper.vm.getAttributes()).toEqual(expected)
        expect(wrapper.vm.getActions().length).toEqual(0)
    })

})

describe('getActions() tests', () => {

    test('attributes changed', () => {
        let wrapper = shallowMount(BooleanData,{
            propsData: {
                isEditing: true,
                schemaData: schemaData
            }
        })
        let expected =  [ { action: 'put', key: 'default', value: false } ]

        wrapper.find('[name=default-val]').setChecked(false)
        expect(wrapper.vm.getActions().sort()).toEqual(expected.sort())
    })

})


