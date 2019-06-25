import {createLocalVue, shallowMount, mount} from '@vue/test-utils';
import PathEditor from "@/components/editors/PathEditor";
import ProjectModule from "@/stores/modules/ProjectModule";
import ApixUtil from "@/utils/ApixUtil";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)

describe('create new tests', () => {
    let $route = {
        params : {
            projectId : 'UUID-as-projectId',
            sectionApi : 'sectionX'
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

    let wrapper

    beforeEach(() => {
        wrapper = mount(PathEditor,{
            computed : {
                sectionData(){
                    return {
                        paths :{},
                        _signature : '123'
                    }
                },
                editable: () => true
            },
            localVue,
            store,
            stubs: ['router-link','vue-editor'],
            mocks : {$route : $route}
        })
    })

    test('should create new query when submitted',()=>{
        wrapper.find('[name="path-input"]').setValue('/baseurl/{id1}')
        expect(wrapper.vm.$data.variables.length).toEqual(1)

        let expected = {
            "sections": {
                "sectionX": {
                    "_signature": "<random UUID>",
                    "paths": {
                        "_actions": [
                            {
                                "action": "put",
                                "key": "/baseurl/{id1}",
                                "value": {
                                    "description": "<p></p>",
                                    "pathVariables": {
                                        "id1": {
                                            "type": "string",
                                            "enum": [],
                                            "name": "id1"
                                        }
                                    },
                                    "_signature": "<random UUID>"
                                }
                            }
                        ],
                        "_hasActions": true
                    }
                }
            }
        }
        let res = wrapper.vm.submit()
        expect(ApixUtil.isEqualObject(res, expected,['_signature'])).toEqual(true)
    })
});
describe('edit tests', () => {
    let $route = {
        params : {
            projectId : 'UUID-as-projectId',
            sectionApi : 'sectionX',
            pathApi : '/hello/{var1}/world/{var2}/{var3}'
        }
    }


    let wrapper
    beforeEach(() => {
        const store = new Vuex.Store({
            modules: {
                project: {
                    namespaced : true,
                    state : {
                        project : {
                            sections : {
                                sectionX : {
                                    paths : {
                                        '/hello/{var1}/world/{var2}/{var3}' : {
                                            pathVariables : {
                                                var1 : {
                                                    type : 'string',
                                                    name : 'var1'
                                                },
                                                var2 : {
                                                    type : 'string',
                                                    name : 'var2'
                                                },
                                                var3 : {
                                                    type : 'string',
                                                    name : 'var3'
                                                }
                                            }
                                        }
                                    },
                                    _signature : '123'
                                }
                            }
                        }
                    },
                    getters: ProjectModule.getters
                }
            }
        })
        wrapper = mount(PathEditor,{
            computed : {
                editable: () => true
            },
            localVue,
            store,
            stubs: ['router-link','vue-editor'],
            mocks : {$route : $route}
        })
    })

    test('should update form when variables added',()=>{
        wrapper.find('[name="path-input"]').setValue('/hello/{var1}/world/{var2}/{var3}/{var4}')
        expect(wrapper.vm.$data.variables.length).toEqual(4)
        expect(wrapper.vm.$data.variables[3].name).toEqual('var4')

        wrapper.find('[name="path-input"]').setValue('/{var0}/hello/{var1}/world/{var2}/{var3}/{var4}')
        expect(wrapper.vm.$data.variables.length).toEqual(5)
        expect(wrapper.vm.$data.variables[0].name).toEqual('var0')

    })

    test('should update form when variables deleted',()=>{
        wrapper.find('[name="path-input"]').setValue('/hello/{var1}/world/{var3}')
        expect(wrapper.vm.$data.variables.length).toEqual(2)
        expect(wrapper.vm.$data.variables[0].name).toEqual('var1')
        expect(wrapper.vm.$data.variables[1].name).toEqual('var3')
    })

    test('should update form when variable renamed',()=>{
        wrapper.find('[name="path-input"]').setValue('/hello/{id}/world/{var2}/{var3}')
        expect(wrapper.vm.$data.variables.length).toEqual(3)
        expect(wrapper.vm.$data.variables[0].name).toEqual('id')
        expect(wrapper.vm.$data.variables[1].name).toEqual('var2')
        expect(wrapper.vm.$data.variables[2].name).toEqual('var3')

        let expected = {
            "sections": {
                "sectionX": {
                    "_signature" : '123',
                    "paths": {
                        "_actions": [
                            {
                                "action": "rename",
                                "key": "/hello/{var1}/world/{var2}/{var3}",
                                "newKey": "/hello/{id}/world/{var2}/{var3}"
                            }
                        ],
                        "_hasActions": true,
                        "/hello/{id}/world/{var2}/{var3}": {
                            "_actions": [
                                {
                                    "action": "put",
                                    "key": "pathVariables",
                                    "value": {
                                        "var2": {
                                            "type": "string",
                                            "enum": [],
                                            "name": "var2"
                                        },
                                        "var3": {
                                            "type": "string",
                                            "enum": [],
                                            "name": "var3"
                                        },
                                        "id": {
                                            "type": "string",
                                            "enum": [],
                                            "name": "id"
                                        }
                                    }
                                },
                                {
                                    "action": "put",
                                    "key": "description",
                                    "value": "<p></p>"
                                }
                            ],
                            "_hasActions": true
                        }
                    }
                }
            }
        }
        let res = wrapper.vm.submit()
        expect(ApixUtil.isEqualObject(res, expected,['_signature'])).toEqual(true)
    })

});
