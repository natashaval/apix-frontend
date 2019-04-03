import { shallowMount } from "@vue/test-utils";
import NumericData from "@/components/editors/editor-components/inputs/typedatas/NumericData"

let schemaData = {
    "type" : "number",
    "required" : false,
    "description" : "qnumber desc",
    "example" : "22",
    "format" : "double",
    "enum" : [
        "1.0",
        "2.0",
        "3.0"
    ],
    "default" : 22.3,
    "maximum" : 3,
    "minimum" : 2
}

describe('getAttributes() tests',() => {

    let expected = {
        "type" : "number",
        "format" : "double",
        "enum" : [
            "1.0",
            "2.0",
            "3.0"
        ],
        "default" : "22.3",
        "maximum" : "3",
        "minimum" : "2"
    }

    test('create new',() => {
        const wrapper = shallowMount(NumericData,{
            propsData:{
                isEditing : true,
                numericType : 'number'
            }
        })
        expect(wrapper.vm.$props.isEditing).toEqual(true)

        wrapper.find('[name=default-val]').setValue(expected['default'])
        wrapper.find('[name=maximum]').setValue(expected['maximum'])
        wrapper.find('[name=minimum]').setValue(expected['minimum'])
        wrapper.findAll('[name=format] option').wrappers.forEach(option => {
            if(option.html().includes('value="double"')){
                option.setSelected()
            }
        })

        wrapper.findAll('[name=enum]').wrappers[0].setValue('1.0')
        wrapper.findAll('[name=enum]').wrappers[0].trigger('keyup')
        wrapper.findAll('[name=enum]').wrappers[1].setValue('2.0')
        wrapper.findAll('[name=enum]').wrappers[1].trigger('keyup')
        wrapper.findAll('[name=enum]').wrappers[2].setValue('3.0')
        wrapper.findAll('[name=enum]').wrappers[2].trigger('keyup')

        expect(wrapper.vm.getAttributes()).toEqual(expected)
    })

    test('load avaliable data',() => {
        const wrapper = shallowMount(NumericData,{
            propsData: {
                numericType : 'number',
                schemaData: schemaData
            }
        })

        expect(wrapper.vm.getAttributes()).toEqual(expected)
        expect(wrapper.vm.getActions().length).toEqual(0)
    })

})


describe('getActions() tests', () => {

    test('attributes changed', () => {
        let wrapper = shallowMount(NumericData,{
            propsData: {
                isEditing: true,
                numericType : 'number',
                schemaData: schemaData
            }
        })
        let expected = [ { action: 'put', key: 'enum', value: [ '123', '2.0', '3.0' ] },
            { action: 'put', key: 'minimum', value: '10' },
            { action: 'put', key: 'maximum', value: '100' },
            { action: 'put', key: 'default', value: '123.4' } ]


        wrapper.findAll('[name=enum]').wrappers[0].setValue('123')

        wrapper.find('[name=default-val]').setValue('123.4')
        wrapper.find('[name=maximum]').setValue(100)
        wrapper.find('[name=minimum]').setValue(10)

        // console.log(wrapper.vm.getActions())
        expect(wrapper.vm.getActions().sort()).toEqual(expected.sort())
    })

    test('enum list changed', () => {
        let wrapper = shallowMount(NumericData,{
            propsData: {
                isEditing : true,
                schemaData: schemaData,
                numericType : "number"
            }
        })
        let enumWrappers = wrapper.findAll('[name=enum]').wrappers
        let target = enumWrappers[1]
        target.setValue('')
        target.trigger('keyup')
        expect(wrapper.vm.getActions()).toEqual([ { action: 'put', key: 'enum', value: [ '1.0', '', '3.0' ] } ])
        target.setValue('2.34')
        target.trigger('keyup')

        enumWrappers = wrapper.findAll('[name=enum]').wrappers
        enumWrappers[2].setValue('3.45')
        enumWrappers[2].trigger('keyup')

        expect(wrapper.vm.getActions().sort()).toEqual(
            [ { action: 'put', key: 'enum', value: [ '1.0', '2.34', '3.45' ] } ]
        )

    })


})
