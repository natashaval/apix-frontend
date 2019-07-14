import {createLocalVue, mount} from '@vue/test-utils';
import SectionEditor from "@/components/editors/SectionEditor";
import ApixUtil from "@/utils/ApixUtil";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)

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
                }],
                _hasActions : true
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
                            "_hasActions": true,
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
                _hasActions : true,
                sectionXY: {
                    info : {
                        _actions : [{
                            action : 'put',
                            key : 'name',
                            value : 'sectionXY'
                        }],
                        _hasActions : true,
                    }
                }
            }
        }

        expect(ApixUtil.isEqualObject(wrapper.vm.submit(),
            expected,['_signature'])).toBeTruthy()
    })

})
