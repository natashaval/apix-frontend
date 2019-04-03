import { shallowMount } from "@vue/test-utils";
import CustomData from "@/components/editors/editor-components/inputs/typedatas/CustomData";

let schemaData = {
    "required" : false,
    "ref" : "#/definitions/b7b1926d-de2d-4f09-bdb6-45253e7d594c"
}

describe('getAttributes() tests',() => {

    let expected = {$ref : '#/definitions/b7b1926d-de2d-4f09-bdb6-45253e7d594c'}

    test('create new',() => {
        const wrapper = shallowMount(CustomData,{
            propsData:{
                currentRef : '#/definitions/b7b1926d-de2d-4f09-bdb6-45253e7d594c'
            }
        })

        expect(wrapper.vm.getAttributes()).toEqual(expected)
    })

    test('load avaliable data',() => {
        const wrapper = shallowMount(CustomData,{
            propsData:{
                schemaData : schemaData,
                currentRef : '#/definitions/b7b1926d-de2d-4f09-bdb6-45253e7d594c'
            }
        })
        expect(wrapper.vm.getAttributes()).toEqual(expected)
        expect(wrapper.vm.getActions().length).toEqual(0)
    })

})

describe('getActions() tests', () => {

    test('attributes changed', () => {
        const wrapper = shallowMount(CustomData,{
            propsData:{
                schemaData : schemaData,
                currentRef : '#/definitions/b7b1926d-de2d-4f09-bdb6-45253e7d594c'
            }
        })
        wrapper.setProps({
            currentRef : '#/definitions/12312312-de2d-4f09-bdb6-45253e7d594c'
        })

        let expected = [ { action: 'put', key: '$ref',
            value: '#/definitions/12312312-de2d-4f09-bdb6-45253e7d594c' } ]
        expect(wrapper.vm.getActions().sort()).toEqual(expected.sort())
    })

})


