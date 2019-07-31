import {createLocalVue, mount} from "@vue/test-utils"
import PropertyForm from "@/components/editors/editor-components/forms/PropertyForm"
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import ProjectModule from "@/stores/modules/ProjectModule"
import ApixUtil from "@/utils/ApixUtil"

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)

let $route = {
    params : {
        projectId : 'UUID-as-projectId'
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
describe('test data load',()=>{

    let wrapper

    beforeEach(() => {
        wrapper = mount(PropertyForm, {
            localVue,
            propsData : {
                schemasData : {
                    "productId": {
                        "name": "productId",
                        "type" : "number",
                        "format" : '32'
                    },
                    "productName": {
                        "name": "productName",
                        "type": "string"
                    },
                    "productDecription" : {
                        "name" : "productDescription",
                        "type" : "string"
                    }
                }
            },
            store,
            stubs: ['router-link'],
            mocks : {$route : $route}
        })
    })

    test('should load all data', () => {
        expect(wrapper.vm.propertiesData.length).toEqual(3)
    })

    test('can add new child and should validate name foreach properties', () => {
        expect(wrapper.vm.isValidName('productId')).toBeTruthy()
        expect(wrapper.vm.isValidName('otherField')).toBeFalsy()

        wrapper.find('[id="'+wrapper.vm._uid+'-add-property"]').trigger('click')
        expect(wrapper.vm.propertiesData.length).toEqual(4)

        let newId = wrapper.vm.$data.propertiesData[3].id

        wrapper.vm.$refs['property-'+newId][0]._data.name = 'productId'
        expect(wrapper.vm.isValidName('productId')).toBeFalsy()

        wrapper.vm.$refs['property-'+newId][0]._data.name = 'otherField'
        expect(wrapper.vm.isValidName('otherField')).toBeTruthy()
    })

    test('can delete property and should build correct json query', () => {
        let newId = wrapper.vm.$data.propertiesData[0].id
        let childEditor = wrapper.vm.$refs['property-'+newId][0]

        wrapper.find('[id="'+childEditor._uid+'-delete-btn"]').trigger('click')
        expect(wrapper.vm.propertiesData.length).toEqual(2)

        let query = {}
        wrapper.vm.buildQuery(query)
        expect(ApixUtil.isEqualObject(query,{
            "_hasActions": true,
            "_actions": [
                {
                    "action": "delete",
                    "key": "productId"
                }
            ]
        })).toBeTruthy()
    })

})
