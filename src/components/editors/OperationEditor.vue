<template>
    <div>
        <SaveComponent :isEdited="isEdited" :editable="editable"
                       :submit="submit" :cancel="cancel" name="<h3 class=font-weight-bold>Operation Editor</h3>"></SaveComponent>
        <div class="row">
        <div v-if="showEdit" class="col-11">
            <div class="form-group">
                <label class="font-weight-bold">Summary :</label>
                <b-input v-model="summary" class="col"></b-input>
            </div>
            <div class="form-row">
                <div class="form-group col-4">
                    <label class="font-weight-bold">Method :</label>
                    <b-form-group class="form-row mb-2 w-100"
                                  :state="methodState" :invalid-feedback="methodInvalidFeedback">
                        <b-select class="form-control" :state="methodState" trim v-model="method" :options="selectMethodOptions"></b-select>
                    </b-form-group>
                </div>
                <div class="form-group col-8">
                    <label class="font-weight-bold">Path :</label>
                    <b-input class="form-control" v-model="pathApi" disabled></b-input>
                </div>
            </div>
            <div class="form-group">
                <label class="font-weight-bold">Operation Id :</label>
                <b-input v-model="operationId" class="form-control"></b-input>
            </div>
            <div class="form-group">
                <div class="form-group">
                    <label class="font-weight-bold">Description:</label>
                    <vue-editor v-model="description"></vue-editor>
                </div>
            </div>
            <div class="form-group">
                <label class="font-weight-bold">Consumes :</label>
                <v-select multiple v-model="consumes" class="w-100" :options="options"></v-select>
            </div>
            <div class="form-group">
                <label class="font-weight-bold">Produces :</label>
                <v-select multiple v-model="produces" class="w-100" :options="options">
                </v-select>
            </div>
        </div>
        <div v-else class="col-11">
                <div class="row">
                    <p>Summary : {{summary}}</p>
                </div>
                <div class="row">
                    <p>Method :{{method}}</p>
                </div>
                <div class="row">
                    <p>Path : {{pathApi}}</p>
                </div>
                <div class="row">
                    <p>Operation Id :{{operationId}}</p>
                </div>
                <div class="row">
                    <p>Description:</p>
                    <p v-html="description"></p>
                </div>
                <div class="row">
                    <p>Consumes :</p>
                    <p v-for="consume in consumes" v-bind:key="consume">{{consume}}</p>
                </div>
                <div class="row">
                    <p>Produces :</p>
                    <p v-for="produce in produces" v-bind:key="produce">{{produce}}</p>
                </div>
            </div>
            <button v-if="editable" @click="isEditing = !isEditing"
                    class="float-right round-button btn" v-bind:id="_uid+'-edit-btn'">
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>

        <RequestComponent ref="request"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                          :editable="editable"
                          :request-data="requestData" :operation-api="method"/>
        <ResponseComponent ref="response"
                           :responses-data="responsesData"
                           :editable="editable"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>

    </div>
</template>

<script>
    import RequestComponent from "@/components/editors/editor-components/RequestComponent";
    import TreeBuilder from "@/utils/DeepTreeBuilderUtil";
    import * as axios from "axios";
    import { VueEditor } from 'vue2-editor'
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import ResponseComponent from "@/components/editors/editor-components/ResponseComponent";
    import uuidv4 from 'uuid/v4';
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import ActionBuilder from "@/utils/ActionBuilderUtil";
    import vSelect from 'vue-select';
    import {COMPLETE, NOT_FOUND} from "@/stores/consts/FetchStatus";
    import SaveComponent from "./editor-components/SaveComponent";

    export default {
        name: "OperationEditor",
        components: {SaveComponent, ResponseComponent, RequestComponent, VueEditor,vSelect},
        mixins : [ChangeObserverMixin],
        data : () => ({
            isCreateNew : false,
            projectId : undefined,
            sectionApi : undefined,
            pathApi : undefined,
            operationApi : 'get',
            dataUpdated : false,
            isEdited : false,
            isEditing : true,
            aceModel : '{}',
            testModel : {
                name : 'alfian'
            },
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
            pathActionQuery : [],
        }),
        computed : {
            methodState : function (){
                return this.$_changeObserverMixin_isValid('method')
            },
            methodInvalidFeedback : function () {
                return this.$_changeObserverMixin_getErrors('method')[0]
            },
            projectState : function (){
                return this.$store.getters['project/getState']
            },
            modelName : function (){
                return this.testModel.name
            },
            editable : function () {
                let hasEditingPrivilege = this.$store.getters['user/hasEditingPrivilege']
                let projectTeams = this.$store.getters['project/getTeams']
                if (hasEditingPrivilege === undefined && projectTeams) {
                    this.$store.dispatch('user/checkEditingPrivilege', projectTeams);
                    return false
                }
                return hasEditingPrivilege
            },
            showEdit : function () {
                if(!this.editable){
                    return false
                }
                return this.isEditing
            },
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

                        tree = TreeBuilder.buildDeepTree(
                            ['sections',this.sectionApi, 'paths',this.pathApi]
                        )

                        tree.leaf._signature = this.pathData._signature

                        let leaf = tree.leaf.methods = {}
                        leaf._hasActions = true
                        leaf._actions = [{
                            action : 'put',
                            key : this.method,
                            value : data
                        }]
                        callbacks.push(()=>{
                            this.$router.push({
                                name :'operation-editor',
                                params: {sectionApi : this.sectionApi, pathApi : this.pathApi, operationApi : this.method}
                            })
                        })
                        this.pathActionQuery = leaf._actions
                    }
                    else{//jika edit data
                        tree = TreeBuilder.buildDeepTree(this.treeKeys)
                        //jika ganti method
                        if(this.operationApi !== this.method){
                            signaturePointer = this.pathData

                            let tmp = tree.root.sections[this.sectionApi].paths[this.pathApi].methods
                            tmp._hasActions = true
                            let data = this.getData()
                            data._signature = uuidv4()
                            tmp._actions = [
                                {
                                    action : 'delete',
                                    key : this.operationApi
                                },
                                {
                                    action : 'put',
                                    key : this.method,
                                    value : data
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

                            pointer._hasActions = true
                            pointer._actions = this.operationActionQuery


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
                                signaturePointer._signature = response.data.new_signature
                                this.commitChange()
                                callbacks.forEach(fn => fn())
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
            reloadData : function () {
                this.loadData()
                this.$refs.request.reloadData()
                this.$refs.response.reloadData()
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.isEdited = false
                let p = this.$route.params
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi
                this.pathApi = p.pathApi
                this.aceModel = JSON.stringify(this.operationData,null,2)
                if(p.operationApi !== undefined){
                    this.operationApi = p.operationApi
                    this.method = p.operationApi
                    this.isCreateNew = false
                }
                else{
                    this.isCreateNew = true
                    this.isEdited = true
                }
                let od = this.operationData
                if(od !== undefined){
                    this.summary = od.summary
                    this.description = od.description
                    this.operationId = od.operationId
                    this.consumes = od.consumes
                    this.produces = od.produces
                    this.description = od.description
                }
                else{
                    this.summary = ''
                    this.description = ''
                    this.operationId = ''
                    this.consumes = ''
                    this.produces = ''
                    this.description = ''
                }
                this.$_changeObserverMixin_initObserver([
                    'summary',
                    {
                        model : 'method',
                        validator : () => {
                            if(this.pathData === undefined)return []
                            if(this.$route.params.operationApi === this.method)return []
                            let isDuplicate = this.pathData.methods[this.method] !== undefined
                            if(isDuplicate)return ['operation must be unique']
                            return []
                        }
                    },
                    'operationId','description','consumes.length', 'produces.length'
                ])
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
                this.loadData()
            },
            projectState : function () {
                if(
                    (this.projectState === NOT_FOUND) ||
                    (this.projectState === COMPLETE && this.operationData === undefined)
                ){
                    this.$router.push({
                        name :'project-editor',
                        params : {
                            projectId : this.$route.params.projectId
                        }
                    })
                }
            }
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

