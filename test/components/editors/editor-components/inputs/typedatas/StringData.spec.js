import { shallowMount } from "@vue/test-utils";
import StringData from "@/components/editors/editor-components/inputs/typedatas/StringData"

let schemaData = {
    "type" : "string",
    "required" : false,
    "description" : "qstring desc",
    "example" : "example1",
    "pattern" : "qweasd",
    "enum" : [
        "string1",
        "string2"
    ],
    "default" : "default-string",
    "maxLength" : 3,
    "minLength" : undefined
}

describe('getAttributes() tests',() => {

    let expected = {
        "type" : "string",
        "pattern" : "qweasd",
        "enum" : [
            "string1",
            "string2"
        ],
        "default" : "default-string",
        "maxLength" : "3",
        "minLength" : undefined
    }

    test('create new',()=>{
        const wrapper = shallowMount(StringData,{propsData:{isEditing : true}})
        expect(wrapper.vm.$props.isEditing).toEqual(true)

        wrapper.find('[name=pattern]').setValue(expected['pattern'])
        wrapper.find('[name=default-val]').setValue(expected['default'])
        wrapper.find('[name=max-length]').setValue(expected['maxLength'])
        wrapper.findAll('[name=enum]').wrappers[0].setValue('string1')
        wrapper.findAll('[name=enum]').wrappers[0].trigger('keyup')
        wrapper.findAll('[name=enum]').wrappers[1].setValue('string2')
        wrapper.findAll('[name=enum]').wrappers[1].trigger('keyup')
        expect(wrapper.vm.getAttributes()).toEqual(expected)
    })

    test('load avaliable data',() => {
        const wrapper = shallowMount(StringData,{
            propsData: {
                isEditing: true,
                schemaData: schemaData
            }
        })

        expect(wrapper.vm.getAttributes()).toEqual(expected)
        expect(wrapper.vm.getActions().length).toEqual(0)
    })

})


describe('getActions() tests', () => {

    test('attributes changed', () => {
        let wrapper = shallowMount(StringData,{
            propsData: {
                isEditing: true,
                schemaData: schemaData
            }
        })
        let expected = [ { action: 'put',
            key: 'enum',
            value: [ 'new-string1', 'string2' ] },
            { action: 'put', key: 'minLength', value: '10' },
            { action: 'put', key: 'maxLength', value: '100' },
            { action: 'put', key: 'pattern', value: 'new-pattern' },
            { action: 'put', key: 'default', value: 'new-default' } ]


        wrapper.findAll('[name=enum]').wrappers[0].setValue('new-string1')

        wrapper.find('[name=pattern]').setValue('new-pattern')
        wrapper.find('[name=default-val]').setValue('new-default')
        wrapper.find('[name=max-length]').setValue(100)
        wrapper.find('[name=min-length]').setValue(10)

        expect(wrapper.vm.getActions().sort()).toEqual(expected.sort())
    })

    test('enum list changed', () => {
        let wrapper = shallowMount(StringData,{
            propsData: {
                isEditing: true,
                schemaData: schemaData
            }
        })
        let enumWrappers = wrapper.findAll('[name=enum]').wrappers
        let target = enumWrappers[1]
        target.setValue('')
        target.trigger('keyup')
        expect(wrapper.vm.getActions()).toEqual([ { action: 'put', key: 'enum', value: [ 'string1' ] } ])

        target.setValue('new-string2')
        target.trigger('keyup')

        enumWrappers = wrapper.findAll('[name=enum]').wrappers
        enumWrappers[2].setValue('new-string3')
        enumWrappers[2].trigger('keyup')

        expect(wrapper.vm.getActions()).toEqual(
            [{
                action: 'put',
                key: 'enum',
                value: [ 'string1', 'new-string2', 'new-string3' ]
            }]
        )
    })

})
