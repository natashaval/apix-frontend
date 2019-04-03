import { shallowMount } from "@vue/test-utils";
import ArrayData from "@/components/editors/editor-components/inputs/typedatas/ArrayData";

let schemaData = {
    "type": "array",
    "required": false,
    "description": "desc3",
    "items": {
        "type": "string",
        "required": false,
        "description": "strdesc",
        "example": "exa1",
        "pattern": "daasdad",
        "enum": [
            "asd",
            "qwe"
        ],
        "default": "default",
        "maxLength": 6,
        "minLength": 5
    },
    maxItems : 3,
    minItems : 1
}

describe('getAttributes() tests',() => {

    let expected =  { type: 'array', minItems: 1, maxItems: 3, uniqueItems: false }

    test('create new',() => {
        const wrapper = shallowMount(ArrayData,{
            propsData:{
                isEditing : true
            }
        })
        expect(wrapper.vm.$props.isEditing).toEqual(true)

        wrapper.find('[name=min-items]').setValue(expected['minItems'])
        wrapper.find('[name=max-items]').setValue(expected['maxItems'])
        expect(wrapper.vm.getAttributes()).toEqual(expected)
    })

    test('load avaliable data',() => {
        const wrapper = shallowMount(ArrayData,{
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

    test('data type changed', () => {
        let cpy = Object.assign({},schemaData)
        cpy['type'] = 'string'
        let wrapper = shallowMount(ArrayData,{
            propsData: {
                schemaData: cpy
            }
        })
        expect(wrapper.vm.getActions()).toEqual([])
    })

    test('attributes changed', () => {
        let wrapper = shallowMount(ArrayData,{
            propsData: {
                isEditing: true,
                schemaData: schemaData
            }
        })
        let expected =  [ { action: 'put', key: 'minItems', value: '2' },
            { action: 'put', key: 'maxItems', value: '10' },
            { action: 'put', key: 'uniqueItems', value: true } ]

        wrapper.find('[name=min-items]').setValue("2")
        wrapper.find('[name=max-items]').setValue("10")
        wrapper.find('[name=unique-items]').setChecked()
        expect(wrapper.vm.getActions().sort()).toEqual(expected.sort())
    })

})


