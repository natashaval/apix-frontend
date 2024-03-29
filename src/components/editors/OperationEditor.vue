<template>
    <div class="pb-5">
        <EditorHeaderComponent :isEdited="isEdited" :editable="$_projectPrivilege_canEdit"
                               :submit="submit" :cancel="cancel" :name="editorTitle"></EditorHeaderComponent>
        <div class="form-row w-100 dot-border mb-4">
            <div v-if="showEdit" class="col-11 pl-2">
                <div class="form-group">
                    <label class="font-weight-bold">Summary : </label>
                    <input v-model="summary" class="col form-control" name="operation-summary">
                </div>
                <div class="form-row">
                    <div class="form-group col-3">
                        <label  class="font-weight-bold">Method :</label>
                        <b-form-group class="mb-2 w-100"
                                      :state="methodState" :invalid-feedback="methodInvalidFeedback">
                            <b-select class="form-control w-100" :state="methodState" trim v-model="method"
                                      :options="selectMethodOptions" name="operation-method"></b-select>
                        </b-form-group>
                    </div>
                    <div class="form-group col-9">
                        <label class="font-weight-bold">Path :</label>
                        <b-input class="form-control" v-model="pathApi" disabled></b-input>
                    </div>
                </div>
                <div class="form-group">
                    <label class="font-weight-bold">Operation Id :</label>
                    <input v-model="operationId" class="form-control" name="operation-id"></input>
                </div>
                <div class="form-group">
                    <div class="form-group">
                        <label class="font-weight-bold">Description:</label>
                        <vue-editor v-model="description"></vue-editor>
                    </div>
                </div>
                <div class="form-group">
                    <label class="font-weight-bold">Consumes :</label>
                    <v-select multiple v-model="consumes" class="w-100" :options="options"
                              name="operation-consumes"></v-select>
                </div>
                <div class="form-group">
                    <label class="font-weight-bold">Produces :</label>
                    <v-select multiple v-model="produces" class="w-100" :options="options"
                              name="operation-produces">
                    </v-select>
                </div>
            </div>
            <div v-else class="col-11 pl-3">
                <div class="form-row">
                    <p class="font-weight-bold">Summary : </p>
                    <p class="ml-2">{{summary}}</p>
                </div>
                <div class="form-row">
                    <p class="font-weight-bold">Method : </p>
                    <p class="ml-2">{{method}}</p>
                </div>
                <div class="form-row">
                    <p class="font-weight-bold">Path : </p>
                    <p class="ml-2">{{pathApi}}</p>
                </div>
                <div class="form-row">
                    <p class="font-weight-bold">Operation Id : </p>
                    <p class="ml-2">{{operationId}}</p>
                </div>
                <div class="form-row">
                    <p class="font-weight-bold w-100">Description:</p>
                    <br>
                    <p v-html="description" class="dot-border w-100"></p>
                </div>
                <div class="form-row">
                    <p class="font-weight-bold w-100">Consumes :</p>
                    <p v-for="consume in consumes" v-bind:key="consume" class="mr-2 btn-outline-primary btn btn-sm">{{consume}}</p>
                </div>
                <div class="form-row">
                    <p class="font-weight-bold w-100">Produces :</p>
                    <p v-for="produce in produces" v-bind:key="produce" class="mr-2 btn-outline-primary btn btn-sm">{{produce}}</p>
                </div>
            </div>
            <div class="col-1 pr-0">
                <button v-if="$_projectPrivilege_canEdit" @click="isEditing = !isEditing"
                        class="float-right round-button btn mt-2 mr-2" v-bind:id="_uid+'-edit-btn'">
                    <i class="fa fa-pencil-alt"></i>
                </button>
            </div>
        </div>

        <RequestComponent ref="request"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                          :editable="$_projectPrivilege_canEdit"
                          :request-data="requestData" :operation-api="method"/>
        <ResponseComponent ref="response" class="pl-2"
                           :responses-data="responsesData"
                           :editable="$_projectPrivilege_canEdit"
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
    import EditorHeaderComponent from "./editor-components/EditorHeaderComponent";
    import BadgeGeneratorUtil from "@/utils/BadgeGeneratorUtil";
    import ProjectPrivilegeMixin from "@/mixins/ProjectPrivilegeMixin";
    import {BASE_PROJECT_URL} from "../../stores/consts/url";

    export default {
        name: "OperationEditor",
        components: {EditorHeaderComponent, ResponseComponent, RequestComponent, VueEditor,vSelect},
        mixins : [ChangeObserverMixin, ProjectPrivilegeMixin],
        data : () => ({
            isCreateNew : false,
            projectId : undefined,
            sectionApi : undefined,
            pathApi : undefined,
            operationApi : 'get',
            dataUpdated : false,
            isEdited : false,
            isEditing : false,
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
            pathActionQuery : []
        }),
        computed : {
            editorTitle : function (){
                return '<h4><span class="'
                    + BadgeGeneratorUtil.getBadgeClassOfOperation(this.method)+' mr-3">'+this.method+'</span>'
                    + this.pathApi+'</h4>'
            },
            methodState : function (){
                return this.$_changeObserverMixin_isValid('method')
            },
            methodInvalidFeedback : function () {
                return this.$_changeObserverMixin_getErrors('method')[0]
            },
            projectFetchState : function (){
                return this.$store.getters['project/getState']
            },
            modelName : function (){
                return this.testModel.name
            },
            showEdit : function () {
                if(!this.$_projectPrivilege_canEdit){
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
                res.consumes = (this.consumes === '')?[]:this.consumes
                res.produces = (this.produces === '')?[]:this.produces
                return res
            },
            getActions : function () {
                return ActionBuilder.createActions(this.operationData, this._data, this.attributesKey)
            },
            submit : function () {

                if(!this.$_changeObserverMixin_allIsValid()){
                    this.$bvToast.toast('Can\'t submit due to invalid input', {
                        title: 'Failed',
                        variant: 'danger'
                    })
                    return
                }

                let callbacks = []
                let signaturePointer = undefined
                let operationActions = []
                let pathActions = []
                let tree = undefined
                let operationData = this.operationData
                let pathData = this.pathData

                if(this.isCreateNew){//jika baru dibuat
                    signaturePointer = this.pathData

                    let data = this.getData()
                    data._signature = uuidv4()

                    tree = TreeBuilder.buildDeepTree(
                        ['sections',this.sectionApi, 'paths',this.pathApi]
                    )

                    tree.leaf._signature = this.pathData._signature

                    let leaf = tree.leaf.methods = {}
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
                    pathActions = leaf._actions
                }
                else{//jika edit data
                    tree = TreeBuilder.buildDeepTree(this.treeKeys)
                    //jika ganti method
                    if(this.operationApi !== this.method){
                        signaturePointer = this.pathData

                        let tmp = tree.root.sections[this.sectionApi].paths[this.pathApi].methods
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
                        pathActions = tmp._actions
                        tree.root.sections[this.sectionApi].paths[this.pathApi]._signature = this.pathData._signature
                    }
                    else{
                        signaturePointer = this.operationData

                        let pointer = tree.leaf
                        pointer._signature = this.operationData._signature

                        operationActions = this.getActions()

                        pointer._actions = operationActions


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
                        }
                    }

                }//end else
                console.log(tree)

                callbacks.push(()=>{
                    ActionExecutorUtil.executeActions(operationData, operationActions)
                    ActionExecutorUtil.executeActions(pathData.methods, pathActions)
                })

                axios.put(BASE_PROJECT_URL+'/'+this.projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            signaturePointer._signature = response.data.new_signature
                            callbacks.forEach(fn => fn())
                            this.reloadData()
                        }
                    }
                ).catch(error => {
                    console.error(error)
                    this.$bvToast.toast(error.response.data.message + ' , Please refresh the page.', {
                        title: 'Failed',
                        variant: 'danger'
                    })
                })


                this.isEdited = false
                return tree.root
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
                    this.isEditing = true
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
                    (this.projectFetchState === NOT_FOUND) ||
                    (this.projectFetchState === COMPLETE && this.operationData === undefined && !this.isCreateNew)
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

