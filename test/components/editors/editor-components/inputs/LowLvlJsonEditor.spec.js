import {createLocalVue, shallowMount} from "@vue/test-utils"
import LowLvlJsonEditor from "@/components/editors/editor-components/inputs/LowLvlJsonEditor"
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import ProjectModule from "@/stores/modules/ProjectModule"
import ApixUtil from "@//utils/ApixUtil"

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        project: {
            namespaced : true,
            state : {
                project : {
                    definitions : {
                        customTypeUUID_1 : {name : 'customTypeName1'},
                        customTypeUIID_2: {name : 'customTypeName2'},
                        customTypeUIID_3: {name : 'customTypeName3'},
                    }
                }
            },
            getters: ProjectModule.getters
        }
    }
})


let $route = {
    params : {
        projectId : 'UUID-as-projectId'
    }
}


describe('general test', () => {
    let wrapper

    let jsonTest = {
        name : 'productDetail',
        type : 'object',
        properties : {
            productId : {
                name : 'productId',
                type : 'string'
            },
            productName : {
                name : 'productName',
                type : 'string'
            }
        }
    }

    beforeEach(()=>{
        wrapper = shallowMount(LowLvlJsonEditor, {
            $route,
            store,
            localVue,
            stubs: ['router-link'],
            mocks : {$route : $route}
        })
    })

    test('should return the same data as input when its not modified',() => {
        wrapper.vm.setJson(jsonTest)
        expect(
            ApixUtil.isEqualObject(wrapper.vm.getJson(), jsonTest)
        ).toBeTruthy()
    })

    test('should return edited object as json text editing result',()=>{
        let editedJson = {
            "name": "productDetail",
            "type": "object",
            "properties": {
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
        }

        wrapper.vm.setJson(jsonTest)
        wrapper.vm.$data.jsonText = JSON.stringify(editedJson)

        expect(ApixUtil.isEqualObject(wrapper.vm.getJson(), editedJson)).toBeTruthy()
    })


})
