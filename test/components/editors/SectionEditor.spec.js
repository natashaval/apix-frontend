import {createLocalVue, mount} from '@vue/test-utils';
import SectionEditor from "@/components/editors/SectionEditor";
import ApixUtil from "@/utils/ApixUtil";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import UserModule from "@/stores/modules/UserModule";
const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        project: {
            namespaced : true,
            state : {
                project : {
                }
            },
            getters: UserModule.getters
        }
    }
})
describe('create new tests', () => {
    let $route = {
        params : {
            projectId : 'UUID-as-projectId'
        }
    }

    let wrapper

    beforeEach(() => {
        wrapper = mount(SectionEditor,{
            computed : {
                projectData(){
                    return {_signature : 'mySignature'}
                },
                $_projectPrivilege_userTeam : ()=>['MyTeam'],
                $_projectPrivilege_canEdit : ()=>true
            },
            localVue,
            store,
            stubs: ['router-link','vue-editor'],
            mocks : {$route : $route}
        })
    })

    test('should create new query when submitted',()=>{
        wrapper.vm.$data.name = 'MySection'
        wrapper.vm.$data.description = '<p>myDescription</p>'

        let expected = {
            _signature : 'mySignature',
            sections : {
                _actions : [{
                    action : 'put',
                    key : 'MySection',
                    value : {
                        info : {
                            name : 'MySection',
                            description : '<p>myDescription</p>'
                        },
                        paths : {}
                    }
                }]
            }
        }
        let res = wrapper.vm.submit()
        expect(ApixUtil.isEqualObject(res, expected,['_signature'])).toBeTruthy()
    })
})

describe('edit tests', () => {
    let $route = {
        params : {
            projectId : 'UUID-as-projectId',
            sectionApi : 'sectionX'
        }
    }

    let wrapper
    beforeEach(() => {

        wrapper = mount(SectionEditor,{
            localVue,
            store,
            computed : {
                projectData(){
                    return {
                        _signature : 'projectSignature',
                        sections : {
                            sectionX : {
                                info : {
                                    name : 'sectionX',
                                    description : '<p>myDescription</p>',
                                    _signature : 'infoSignature'
                                },
                                paths : {},
                                _signature : 'sectionSignature'
                            }
                        }
                    }
                },
                sectionData(){
                    return {
                        info : {
                            name : 'sectionX',
                            description : '<p>myDescription</p>',
                            _signature : 'infoSignature'
                        },
                        paths : {},
                        _signature : 'sectionSignature'
                    }
                },
                $_projectPrivilege_userTeam : ()=>['MyTeam'],
                $_projectPrivilege_canEdit : ()=>true

            },
            stubs: ['router-link','vue-editor'],
            mocks : {$route : $route},
            data : ()=>({
                isEditing : true
            })
        })
        wrapper.find('[id="'+wrapper.vm._uid+'-edit-btn"]').trigger('click')
    })

    test('shouldn\'t create query when not updated',()=>{
        expect(ApixUtil.isEqualObject(wrapper.vm.submit(),
            {
                "sections": {
                    "sectionX": {
                        "info": {
                            "_actions": [],
                            "_signature": "infoSignature"
                        }
                    }
                }
            },['_signature'])).toBeTruthy()
    })

    test('should create update query when edited',()=>{
        wrapper.vm.$data.name = 'sectionXY'
        let expected = {
            _signature : 'projectSignature',
            sections : {
                _actions : [{
                    action : 'rename',
                    key : 'sectionX',
                    newKey : 'sectionXY'
                }],
                sectionXY: {
                    info : {
                        _actions : [{
                            action : 'put',
                            key : 'name',
                            value : 'sectionXY'
                        }]
                    }
                }
            }
        }

        expect(ApixUtil.isEqualObject(wrapper.vm.submit(),
            expected,['_signature'])).toBeTruthy()
    })

})
