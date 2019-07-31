import {createLocalVue, shallowMount} from "@vue/test-utils";
import BodyForm from "@/components/editors/editor-components/forms/BodyForm"
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
describe('json import tests', ()=>{

    let wrapper
    let uid
    beforeEach(()=>{
        wrapper = shallowMount(BodyForm, {
            localVue,
            store,
            stubs: ['router-link'],
            mocks : {$route : $route}
        })
        uid = wrapper.vm._uid
    })

    test('',()=>{


    })


})
