<template>
    <div>
        <ul v-if="isEdited">
            <li><button @click="submit">Save</button></li>
            <li><button @click="cancel">Cancel</button></li>
        </ul>
        <div>
            <div class="row">
                <label class="col-2">Summary :</label>
                <b-input v-model="summary" class="col"></b-input>
            </div>
            <div class="row">
                <div class="col-4">
                    <label class="col-4">Method :</label>
                    <b-select class="col-8" v-model="method" :options="selectMethodOptions"></b-select>
                    <p v-if="!$_changeObserverMixin_isValid('method')" class="error-message">operation must be unique</p>
                </div>
                <div class="col-8">
                    <label class="col-5 float-left">Path :</label>
                    <b-input class="col-7" v-model="pathApi" disabled></b-input>
                </div>
            </div>
            <div class="row">
                <label class="col-2">Operation Id :</label>
                <b-input v-model="operationId" class="col"></b-input>
            </div>
            <div class="row">
                <label>Description:</label>
                <vue-editor v-model="description"></vue-editor>
            </div>
            <div class="row">
                <label>Consumes :</label>
                <v-select multiple v-model="consumes" class="w-100" :options="options">
                </v-select>
            </div>
            <div class="row">
                <label>Produces :</label>
                <v-select multiple v-model="produces" class="w-100" :options="options">
                </v-select>
            </div>

        </div>
        <h1>method : {{operationApi}}</h1>
        <div v-if="dataUpdated">
            <h2>data Updated</h2>
        </div>
                          <!--:$_changeObserverMixin_parent="$_changeObserverMixin_this"-->
        <RequestComponent ref="request"
                          :is-create-new="isCreateNew"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                          :request-data="requestData" :operation-api="method"/>
        <ResponseComponent ref="response"
                           :responses-data="responsesData"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>

    </div>
</template>

<script>
    import RequestComponent from "./editor-components/RequestComponent";
    import TreeBuilder from "@/utils/DeepTreeBuilderUtil";
    import * as axios from "axios";
    import { VueEditor } from 'vue2-editor'
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import ResponseComponent from "./editor-components/ResponseComponent";
    import uuidv4 from 'uuid/v4';
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";
    import ActionBuilder from "../../utils/ActionBuilderUtil";
    import vSelect from 'vue-select'

    export default {
        name: "OperationEditor",
        components: {ResponseComponent, RequestComponent,VueEditor,vSelect},
        mixins : [ChangeObserverMixin],
        data : () => ({
            isCreateNew : false,
            projectId : undefined,
            sectionApi : undefined,
            pathApi : undefined,
            operationApi : 'get',
            dataUpdated : false,
            isEdited : false,

            selectMethodOptions : [
                {text : 'GET', value : 'get'},
                {text : 'POST', value : 'post'},
                {text : 'PUT', value : 'put'},
                {text : 'DELETE', value : 'delete'},
                {text : 'PATCH', value : 'patch'},
                {text : 'HEAD', value : 'head'},
                {text : 'OPTIONS', value : 'options'}
            ],
            path : '',
            method : 'get',
            description : '',
            summary : '',
            operationId : '',
            options : [
                'application/json',
                'multipart/form-data',
                'application/xml'
            ],
            consumes : [],
            produces : [],
            attributesKey : [
                {key : 'operationId'},
                {key : 'summary'},
                {key : 'description'},
                {key : 'consumes'},
                {key : 'produces'}
            ],

            operationActionQuery : [],
            pathActionQuery : []
        }),
        computed : {
            treeKeys : function () {
                return [
                    'sections',this.sectionApi,
                    'paths',this.pathApi,
                    'methods',this.operationApi
                ]
            },
            pathData : function () {
                return this.$store.getters['project/getPathData'](this.sectionApi,this.pathApi)
            },
            operationData : function () {
                if(this.isCreateNew)return undefined
                return this.$store.getters['project/getOperationData'](this.sectionApi,this.pathApi,this.operationApi)
            },
            requestData : function () {
                let od = this.operationData
                return (od === undefined)?undefined : od.request
            },
            responsesData : function () {
                let od = this.operationData
                return (od === undefined)?undefined : od.responses
            },
            consumesData : function () {
                return (this.operationData === undefined)?[]:this.operationData.consumes
            },
            producesData : function () {
                return (this.operationData === undefined)?[]:this.operationData.produces
            }
        },
        methods : {
            getData : function () {
                let res = {}
                res.summary = this.summary
                res.description = this.description
                res.operationId = this.operationId
                res.request = this.$refs.request.getData()
                res.responses = this.$refs.response.getData()
                res.consumes = this.consumes
                res.produces = this.produces
                return res
            },
            getActions : function () {
                return ActionBuilder.createActions(this.operationData, this._data, this.attributesKey)
            },
            commitChange : function () {
                ActionExecutorUtil.executeActions(this.operationData, this.operationActionQuery)
                ActionExecutorUtil.executeActions(this.pathData.methods, this.pathActionQuery)
            },
            submit : function () {
                try{

                    if(!this.$_changeObserverMixin_allIsValid()){
                        console.log('can\'t submit due to unvalid field')
                        return
                    }


                    let callbacks = []
                    let signaturePointer = undefined
                    let tree = undefined
                    if(this.isCreateNew){//jika baru dibuat
                        signaturePointer = this.pathData

                        let data = this.getData()
                        data._signature = uuidv4()

                        tree =TreeBuilder.buildDeepTree(
                            ['sections',this.sectionApi, 'paths',this.pathApi]
                        )

                        tree.leaf._signature = this.pathData._signature

                        let leaf = tree.leaf.methods = {}
                        leaf._hasActions = true
                        leaf._actions = [{
                            action : 'put',
                            key : this.operationApi,
                            value : data
                        }]

                        this.pathActionQuery = leaf._actions
                    }
                    else{//jika edit data
                        tree = TreeBuilder.buildDeepTree(this.treeKeys)
                        //jika ganti method
                        if(this.operationApi !== this.method){
                            signaturePointer = this.pathData

                            let tmp = tree.root.sections[this.sectionApi].paths[this.pathApi].methods
                            tmp._hasActions = true
                            tmp._actions = [
                                {
                                    action : 'delete',
                                    key : this.operationApi
                                },
                                {
                                    action : 'put',
                                    key : this.method,
                                    value : this.getData()
                                }
                            ]
                            callbacks.push(()=>{
                                this.$router.push({
                                    name :'operation-editor',
                                    params: {sectionApi : this.sectionApi, pathApi : this.pathApi, operationApi : this.method}
                                })
                            })
                            this.pathActionQuery = tmp._actions
                            tree.root.sections[this.sectionApi].paths[this.pathApi]._signature = this.pathData._signature
                        }
                        else{
                            signaturePointer = this.operationData

                            let pointer = tree.leaf
                            pointer._signature = this.operationData._signature

                            this.operationActionQuery = this.getActions()

                            // if(this.operationActionQuery.length > 0){
                            pointer._hasActions = true
                            pointer._actions = this.operationActionQuery
                            // }else{
                            //     point
                            // }

                            let callback = this.$refs.request.buildQuery(tree.leaf,pointer.request = {})
                            if(callback === undefined){
                                delete pointer.request
                            }
                            else{
                                callbacks.push(callback)
                            }

                            callback = this.$refs.response.buildQuery(pointer.responses = {})
                            if(callback === undefined){
                                delete pointer.responses
                            }
                            else{
                                callbacks.push(callback)
                            }



                            if(pointer._actions.length === 0){
                                delete pointer._actions
                                delete pointer._hasActions
                            }
                        }

                    }//end else
                    console.log(tree)
                    axios.put('http://localhost:8080/projects/'+this.projectId,tree.root).then(
                        (response) => {
                            if(response.status === 200){
                                callbacks.forEach(fn => fn())
                                signaturePointer._signature = response.data.new_signature
                                this.commitChange()
                                this.reloadData()
                            }
                        }
                    ).catch(function (error) {
                        console.log(error);
                    })


                    this.isEdited = false

                }
                catch (e) {
                    console.log(e)
                }
            },
            cancel : function () {
                this.reloadData()
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.isEdited = false
                let p = this.$route.params
                //jika create new
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi
                this.pathApi = p.pathApi

                if(p.operationApi !== undefined){
                    this.operationApi = p.operationApi
                    this.method = p.operationApi
                }
                else{
                    this.isCreateNew = true
                }
                let od = this.operationData
                if(od !== undefined){
                    this.summary = od.summary
                    this.description = od.description
                    this.operationId = od.operationId
                    this.consumes = od.consumes
                    this.produces = od.produces
                    if(this.description !== undefined && this.description[0] !== '<'){
                        this.description = '<p>'+this.description+'</p>'
                    }
                }
                this.$_changeObserverMixin_initObserver([
                    'summary',
                    {
                        model : 'method', validator : () => {
                            if(this.pathData === undefined)return true
                            if(this.$route.params.operationApi === this.method)return true
                            console.log('#return '+this.pathData.methods[this.method] === undefined)
                            return this.pathData.methods[this.method] === undefined
                        }
                    },
                    'operationId','description','consumes.length', 'produces.length'
                ])

            },
            reloadData : function () {
                this.loadData()
                this.$refs.request.reloadData()
                this.$refs.response.reloadData()
            },
            //override
            $_changeObserverMixin_onDataChanged : function (after,before) {
                this.isEdited = true
            }

        },
        watch : {
            $route : function () {
                this.loadData()
            },
            operationData : function (after,before) {
                if(before === undefined){
                    this.loadData()
                }
            },

        },
        mounted() {
            this.loadData()
        },

    }
</script>

<style>
    .error-message{
        color : red;
    }
</style>

<style scoped>

</style>

