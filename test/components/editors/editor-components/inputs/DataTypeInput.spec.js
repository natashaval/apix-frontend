import {createLocalVue, mount} from "@vue/test-utils";
import DataTypeInput from "@/components/editors/editor-components/inputs/DataTypeInput";
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import ProjectModule from "@/stores/modules/ProjectModule";

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)


let $route = {
    params : {
        projectId : 'UUID-as-projectId'
    }
}

describe('create new tests',() => {

    let wrapper
    beforeEach(() => {
        const store = new Vuex.Store({
            modules: {
                project: {
                    namespaced : true,
                    state : {
                        project : {
                            definitions : {
                                customTypeUUID_1 : {name : 'customTypeName1'},
                                customTypeUIID_2: {name : 'customTypeName2'}
                            }
                        }
                    },
                    getters: ProjectModule.getters
                }
            }
        })

        wrapper = mount(DataTypeInput,{
            propsData:{
                parentIsEditing : true,
                nameable : false,
                fixedName : 'schema'
            },
            localVue,
            store,
            stubs: ['router-link'],
            mocks : {$route : $route}
        })

    })

    test('should have selectable custom datatype in type options',() => {
        let uid = wrapper.vm._uid
        let expected = {
            "$ref": "#/definitions/customTypeUIID_2",
            "description": "",
            "example": "",
            "required":false
        }
        let customDataTypeCount = 0
        wrapper.findAll('select[name="'+uid+'-select-type"] option').wrappers.forEach(option => {
            if(option.html().includes('customTypeName')){
                option.setSelected()
                customDataTypeCount++
            }
        })
        expect(customDataTypeCount).toEqual(2)
        let res = {}
        wrapper.vm.buildQuery(res)
        expect(res._actions.length).toEqual(1)
        expect(res._actions[0].value).toEqual(expected)
    })

    test('should render childs and getActions() should return 1 items ' +
        'that contain all data recursively', () => {
        let expected = {
            "name": "schema",
            "attributes": {
                "type": "object",
                "additionalProperties": true,
                "description": "",
                "example": "",
                "required":false,
                "properties": {
                    "number-name": {
                        "type": "number",
                        "enum": [],
                        "format": "",
                        "name": "number-name",
                        "description": "",
                        "example": "",
                        "required":false
                    },
                    "string-name": {
                        "type": "string",
                        "enum": [],
                        "name": "string-name",
                        "description": "",
                        "example": "",
                        "required":false
                    }
                }
            }
        }

        let uid = wrapper.vm._uid
        wrapper.findAll('select[name="'+uid+'-select-type"] option').wrappers.forEach(option => {
            if(option.html().includes('object')){
                option.setSelected()
            }
        })
        wrapper.find({ref : uid+'-add-child-btn'}).trigger('click')
        wrapper.find({ref : uid+'-add-child-btn'}).trigger('click')

        let properties = wrapper.vm.$data.propertiesData

        let uid2 = wrapper.vm.$refs['property-'+properties[0].id][0]._uid
        let uid3 = wrapper.vm.$refs['property-'+properties[1].id][0]._uid


        wrapper.find('[name="'+uid2+'-name"]').setValue('number-name')
        wrapper.findAll('select[name="'+uid2+'-select-type"] option').wrappers.forEach(option => {
            if(option.html().includes('number')){
                option.setSelected()
            }
        })

        wrapper.find('[name="'+uid3+'-name"]').setValue('string-name')
        expect(wrapper.vm.getData()).toEqual(expected)
        let res = {}
        wrapper.vm.buildQuery(res)
        expect(res._actions.length).toEqual(1)
        expect(res._actions[0].value).toEqual(expected.attributes)

    })

})


describe('edit available data tests',() => {
    let wrapper,uid,schemaData
    beforeEach(() => {

        schemaData = {
            "type": "object",
            "additionalProperties" : "true",
            "description" : "",
            "example" : "",
            "properties": {
                "fullName": {
                    "type": "string",
                    "required": false,
                    "description": "",
                    "name": "fullName",
                    "example": "",
                    "enum": [],
                    "default" : "",
                    "maxLength" : "",
                    "minLength" : "",
                    "pattern" : "\\d+"
                },
                "phoneNumber": {
                    "type": "number",
                    "required": false,
                    "description": "qnumber desc",
                    "name": "phoneNumber",
                    "example": "22",
                    "format": "double",
                    "enum": [
                        "1.1",
                        "2.2",
                        "3.3"
                    ],
                    "default": "1.1",
                    "minimum": "1",
                    "maximum": "3"
                }
            }
        }

        const store = new Vuex.Store({
            modules: {
                project: {
                    namespaced : true,
                    state : {
                        project : {
                            definitions : {
                                customTypeUUID_1 : {name : 'customTypeName1'},
                                customTypeUIID_2: {name : 'customTypeName2'}
                            }
                        }
                    },
                    getters: ProjectModule.getters
                }
            }
        })

        wrapper = mount(DataTypeInput,{
            propsData:{
                parentIsEditing : true,
                nameable : false,
                fixedName : 'schema',
                schemaData : schemaData
            },
            localVue,
            store,
            stubs: ['router-link'],
            mocks : {$route : $route}
        })

        uid = wrapper.vm._uid
    })

    test('should return the same data as loaded data if it\'s not edited',() => {
        expect(wrapper.vm.getData().attributes).toEqual(schemaData)
    })

    test('vm.buildQuery() should not build any query if there is no editing',() => {
        let res = {}
        wrapper.vm.buildQuery(res)
        expect(res._actions.length).toEqual(0)
        expect(res.properties).toBeUndefined()
    })

    test('vm.buildQuery() should build queries if the data was edited and it should' +
        ' return function to commit the changes', () => {

        wrapper.find('[name="'+uid+'-description"]').setValue('new-description')

        let res = {}
        let commitFn = wrapper.vm.buildQuery(res)
        expect(res.schema._actions.length).toEqual(1)
        expect(res.schema._actions[0]).toEqual({
            action : 'put',
            key : 'description',
            value : 'new-description'
        })
        expect(res.properties).toBeUndefined()

        let schemaBeforeCommit = Object.assign({}, schemaData)
        commitFn()
        expect(schemaBeforeCommit).not.toEqual(schemaData)
        expect(schemaData.description).toEqual('new-description')

        //make sure only 'description' field changing
        delete schemaBeforeCommit.description
        delete schemaData.description
        expect(schemaBeforeCommit).toEqual(schemaData)

    })

    test('vm.buildQuery() should build queries of childs if they had been edited,' +
        ' and it should return function to commit the changes recursively',() => {
        let properties = wrapper.vm.$data.propertiesData
        let uid2 = wrapper.vm.$refs['property-'+properties[0].id][0]._uid

        wrapper.find('[id="'+uid2+'-edit-btn"]').trigger('click')
        wrapper.find('[id="'+uid2+'-more-attribute"]').trigger('click')
        wrapper.find('[id="'+uid2+'-more-attr-form"]').find('[name=pattern]').setValue('new-pattern')


        let res = {}
        wrapper.vm.buildQuery(res)
        expect(res.schema.properties.fullName._actions.length).toEqual(1)
        expect(res.schema.properties.fullName._actions[0].key).toEqual('pattern')
    })

    test('vm.buildQuery() should build queries of child deleting and renaming',() => {
        let properties = wrapper.vm.$data.propertiesData
        let uid2 = wrapper.vm.$refs['property-'+properties[0].id][0]._uid
        let uid3 = wrapper.vm.$refs['property-'+properties[1].id][0]._uid
        wrapper.find('[id="'+uid2+'-delete-btn"]').trigger('click')

        wrapper.find('[id="'+uid3+'-edit-btn"]').trigger('click')
        wrapper.find('[name="'+uid3+'-name"]').setValue('newName')

        let res = {}
        let callback = wrapper.vm.buildQuery(res)

        let expected = [
            {
                "action": "delete",
                "key": "fullName"
            },
            {
                "action": "rename",
                "key": "phoneNumber",
                "newKey": "newName"
            }
        ]
        expect(callback).toBeInstanceOf(Function)
        expect(res.schema.properties._actions).toEqual(expected)
    })



})
