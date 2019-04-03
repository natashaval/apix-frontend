import { shallowMount } from "@vue/test-utils";
import ObjectData from "@/components/editors/editor-components/inputs/typedatas/ObjectData";

let schemaData = {
    "type" : "object",
    "required" : false,
    "additionalProperties" : true
}

describe('getAttributes() tests',() => {

    let expected = {type : 'object', additionalProperties : true}

    test('create new',() => {
        const wrapper = shallowMount(ObjectData,{
            propsData:{
                isEditing : true
            }
        })
        wrapper.find('[name=additional-properties]').setChecked()
        expect(wrapper.vm.getAttributes()).toEqual(expected)
    })

    test('load avaliable data',() => {
        const wrapper = shallowMount(ObjectData,{
            propsData:{
                schemaData : schemaData
            }
        })
        expect(wrapper.vm.getAttributes()).toEqual(expected)
        expect(wrapper.vm.getActions().length).toEqual(0)
    })

})

describe('getActions() tests', () => {

    test('attributes changed', () => {
        const wrapper = shallowMount(ObjectData,{
            propsData:{
                isEditing : true,
                schemaData : schemaData
            }
        })
        wrapper.find('[name=additional-properties]').setChecked(false)
        let expected =  [ { action: 'put', key: 'additionalProperties', value: false } ]
        expect(wrapper.vm.getActions().sort()).toEqual(expected.sort())
    })

})


