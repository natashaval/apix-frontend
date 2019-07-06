import {createLocalVue, shallowMount} from '@vue/test-utils';
import ProjectModule from "@/stores/modules/ProjectModule"
import OperationEditor from "@/components/editors/OperationEditor"
import Vuex from "vuex";
import BootstrapVue from "bootstrap-vue";
import ApixUtil from "../../../src/utils/ApixUtil";

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.use(Vuex)


describe('create new test', () => {

    let wrapper
    let $route = {
        params : {
            projectId : 'UUID-as-projectId',
            sectionApi : 'sectionX',
            pathApi : 'pathX'
        }
    }

    const store = new Vuex.Store({
        modules: {
            project: {
                namespaced : true,
                state : {
                    project : {
                    }
                },
                getters: ProjectModule.getters
            }
        }
    })
    beforeEach(() => {
        wrapper = shallowMount(OperationEditor,{
            computed : {
                $_projectPrivilege_userTeam : ()=>['MyTeam'],
                $_projectPrivilege_canEdit : ()=>true,
                pathData : ()=>({_signature : 'signature',methods : {}})
            },
            localVue,
            store,
            stubs : {
                'route-link' : true,
                'vue-editor' : true,
                RequestComponent : {
                    render : ()=>{},
                    methods : {
                        getData : ()=>({}),
                        buildQuery : ()=>undefined
                    }
                },
                ResponseComponent : {
                    render : ()=>{},
                    methods : {
                        getData : ()=>({}),
                        buildQuery : ()=>undefined
                    }
                }
            },
            mocks : {$route : $route}
        })
    })

    test('test getData()', () => {
        let expected = {
            summary : 'operation summary',
            description: 'operation description',
            operationId: 'operation id',
            request : {},
            responses : {},
            consumes: ['application/json'],
            produces: ['application/json']
        }

        wrapper.find('[name="operation-summary"]').setValue(expected.summary)
        wrapper.find('[name="operation-id"]').setValue(expected.operationId)
        wrapper.vm.$data.description = expected.description
        wrapper.vm.$data.consumes = expected.consumes
        wrapper.vm.$data.produces = expected.produces
        expect(ApixUtil.isEqualObject(wrapper.vm.getData(), expected)).toEqual(true)
    })

    test('test submit', () => {

        let expected = {
            "sections": {
                "sectionX": {
                    "paths": {
                        "pathX": {
                            "methods": {
                                "_hasActions": true,
                                "_actions": [
                                    {
                                        "action": "put",
                                        "key": "put",
                                        "value": {
                                            "summary": "new summary",
                                            "description": "new description",
                                            "operationId": "new operationId",
                                            "request": {},
                                            "responses": {},
                                            "consumes": [
                                                "application/json"
                                            ],
                                            "produces": [
                                                "application/json"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
        wrapper.find('[name="operation-summary"]').setValue('new summary')
        wrapper.find('[name="operation-id"]').setValue('new operationId')
        wrapper.vm.$data.description = 'new description'
        wrapper.vm.$data.consumes = ['application/json']
        wrapper.vm.$data.produces = ['application/json']
        wrapper.vm.$data.method = 'put'


        // console.log(JSON.stringify(wrapper.vm.operationData,null,4))
        // wrapper.vm.getActions()
        // console.log(JSON.stringify(wrapper.vm.submit(),null,4))
        expect(ApixUtil.isEqualObject(wrapper.vm.submit(), expected,['_signature'])).toBeTruthy()

    })

})


describe('editing tests',()=>{
    const store = new Vuex.Store({
        modules: {
            project: {
                namespaced : true,
                state : {
                    project : {
                        sections : {
                            sectionX : {
                                paths : {
                                    pathX : {
                                        methods : {
                                            post : {
                                                summary : 'operation summary',
                                                description: 'operation description',
                                                operationId: 'operation id',
                                                request : {},
                                                responses : {},
                                                consumes: ['application/json'],
                                                produces: ['application/json']
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                getters: ProjectModule.getters
            }
        }
    })
    let $route = {
        params : {
            projectId : 'UUID-as-projectId',
            sectionApi : 'sectionX',
            pathApi : 'pathX',
            operationApi : 'post'
        }
    }

    let wrapper
    beforeEach(() => {
        wrapper = shallowMount(OperationEditor, {
            computed: {
                $_projectPrivilege_userTeam: () => ['MyTeam'],
                $_projectPrivilege_canEdit: () => true
            },
            localVue,
            store,
            stubs: {
                'route-link': true,
                'vue-editor': true,
                RequestComponent: {
                    render: () => {
                    },
                    methods: {
                        getData: () => ({}),
                        buildQuery : () => ({})
                    }
                },
                ResponseComponent: {
                    render: () => {
                    },
                    methods: {
                        getData: () => ({}),
                        buildQuery : () => ({})
                    }
                }
            },
            mocks: {$route: $route}
        })
        wrapper.find('[id="' + wrapper.vm._uid + '-edit-btn' + '"]').trigger('click')
    })

    test('test get query after edited',() => {
        let expected = {
            "sections": {
                "sectionX": {
                    "paths": {
                        "pathX": {
                            "methods": {
                                "post": {},
                                "_hasActions": true,
                                "_actions": [
                                    {
                                        "action": "delete",
                                        "key": "post"
                                    },
                                    {
                                        "action": "put",
                                        "key": "get",
                                        "value": {
                                            "summary": "new summary",
                                            "description": "operation description",
                                            "operationId": "new operationId",
                                            "request": {},
                                            "responses": {},
                                            "consumes": [
                                                "application/json"
                                            ],
                                            "produces": [
                                                "application/json"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
        wrapper.vm.$data.method = 'get'
        wrapper.find('[name="operation-summary"]').setValue('new summary')
        wrapper.find('[name="operation-id"]').setValue('new operationId')

        expect(ApixUtil.isEqualObject(wrapper.vm.submit(), expected, ['_signature'])).toBeTruthy()
    })

    test('test get query when not edited',()=>{
        let expected = {
            "sections": {
                "sectionX": {
                    "paths": {
                        "pathX": {
                            "methods": {
                                "post": {
                                    "request": {},
                                    "responses": {}
                                }
                            }
                        }
                    }
                }
            }
        }

        expect(ApixUtil.isEqualObject(wrapper.vm.submit(), expected)).toBeTruthy()
    })

})
