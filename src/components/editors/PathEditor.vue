<template>
    <div>
        <EditorHeaderComponent :isEdited="isEdited" :editable="$_projectPrivilege_canEdit"
                               :submit="submit" :cancel="cancel" :name="editorTitle"></EditorHeaderComponent>
        <div class="form-row dot-border ml-1 mr-1">
            <div v-if="isEditing" class="col-11 pl-1">
                <div class="form-group">
                    <label class="font-weight-bold">Name:</label>
                    <b-form-group class="mb-2 w-100"
                                  :state="pathState" :invalid-feedback="pathInvalidFeedback">
                        <b-input class="form-control w-100" :state="pathState" trim v-model="path" name="path-input"
                                 placeholder="/path/{myVariable}/data"></b-input>
                    </b-form-group>
                </div>
                <div class="form-group">
                    <label class="font-weight-bold">Description:</label>
                    <vue-editor v-model="description"></vue-editor>
                </div>
            </div>
            <div v-else class="col-11">
                <h4 class="font-weight-bold">Path:</h4>
                <h5>{{path}}</h5>
                <h4 class="font-weight-bold">Description:</h4>
                <div v-html="description" class="mb-4"></div>
            </div>
            <div class="col-1 pr-2 pt-2">
                <button v-if="$_projectPrivilege_canEdit" @click="isEditing = !isEditing"
                        class="float-right round-button btn" v-bind:id="_uid+'-edit-btn'">
                    <i class="fa fa-pencil-alt"></i>
                </button>
            </div>
        </div>

        <div class="form-row dot-border mt-3 ml-1 mr-1">
            <h6 class="font-weight-bold w-100">Path Variables:</h6>
            <div class="w-100" v-for="(variable,idx) in variables" v-bind:key="variable.name">
                <HighLvlJsonEditor :editable="$_projectPrivilege_canEdit"
                                   :parent-is-editing="false"
                                   :nameable="true"
                                   :deleteable="false"
                                   :schema-data="variable"
                                   :disable-name="true"
                                   :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                   ref="variables"
                                   :component-id="idx"/>
            </div>
        </div>


    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin"
    import HighLvlJsonEditor from "@/components/editors/editor-components/inputs/HighLvlJsonEditor"
    import * as axios from "axios";
    import uuidv4 from 'uuid/v4';
    import { VueEditor } from 'vue2-editor'
    import TreeBuilder from "@/utils/DeepTreeBuilderUtil";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import {COMPLETE, NOT_FOUND} from "@/stores/consts/FetchStatus";
    import EditorHeaderComponent from "./editor-components/EditorHeaderComponent";
    import ProjectPrivilegeMixin from "@/mixins/ProjectPrivilegeMixin";
    import {BASE_PROJECT_URL} from "@/stores/actions/const";
    import KeyCheckerUtil from "@/utils/KeyCheckerUtil";

    export default {
        name: "PathEditor",
        components: {EditorHeaderComponent, VueEditor,HighLvlJsonEditor},
        mixins : [ChangeObserverMixin, ProjectPrivilegeMixin],
        computed : {
            pathState : function () {
                return this.$_changeObserverMixin_isValid('path')
            },
            pathInvalidFeedback : function (){
                return this.$_changeObserverMixin_getErrors('path')[0]
            },
            projectFetchState : function (){
                return this.$store.getters['project/getState']
            },
            sectionData(){
                return this.$store.getters['project/getSectionData'](this.sectionApi)
            },
            pathData() {
                if(this.sectionApi && this.pathApi){
                    return this.$store.getters['project/getPathData'](this.sectionApi,this.pathApi)
                }
                return undefined
            },
            pathVariables() {
                if(this.pathData !== undefined) {
                    return this.pathData.pathVariables
                }
                return undefined
            },
            editorTitle() {
                let name = (this.pathApi)?this.pathApi:'New Path'
                return '<h4 class=font-weight-bold><i class="fas fa-link"></i> '+name+'</h4>'
            }
        },
        data : () => ({
            isEdited : false,
            isEditing : false,
            projectId : undefined,
            sectionApi : undefined,
            pathApi : undefined,//akses param
            path : '',//model edit path
            variables : [],
            description : '<p></p>',
            isCreateNew : false
        }),
        methods : {
            submit : function () {
                this.isEdited = false
                let commitFunctions = []
                let sectionData = this.sectionData
                let pathData = this.pathData
                let pathApi = this.pathApi
                let pathQuery = []
                let tree = TreeBuilder.buildDeepTree(
                    ['sections',this.sectionApi]
                )
                tree.leaf._signature = this.sectionData._signature
                tree.leaf = tree.leaf.paths = {}
                let variableData = {}
                if(this.$refs.variables){
                    this.$refs.variables.forEach(variable => {
                        variableData[variable.name] = variable.getData()
                    })
                }
                let path = this.path
                let getPath = ()=>{
                    if(path[0] !== '/'){
                        return '/'+path
                    }
                    return path
                }

                if(this.isCreateNew){
                    tree.leaf._actions = [{
                        action : 'put',
                        key : getPath(),
                        value : {
                            description : this.description,
                            pathVariables : variableData,
                            _signature : uuidv4(),
                            methods : {}
                        }
                    }]
                    commitFunctions.push(()=>{
                        ActionExecutorUtil.executeActions(sectionData.paths, tree.leaf._actions)
                    })
                }
                else{
                    if(this.pathApi !== this.path){
                        tree.leaf._actions = [{
                            action : 'rename',
                            key : pathApi,
                            newKey : getPath()
                        }]
                        commitFunctions.push(()=>{
                            ActionExecutorUtil.executeActions(sectionData.paths, tree.leaf._actions)
                            this.pathApi = getPath()
                        })
                    }
                    tree.leaf[this.path] = {
                        _actions : pathQuery
                    }


                    pathQuery.push({
                        action : 'put',
                        key : 'pathVariables',
                        value : variableData
                    })

                    if(this.description !== pathData.description){
                        pathQuery.push({
                            action : 'put',
                            key : 'description',
                            value : this.description
                        })
                    }

                    commitFunctions.push(()=>{
                        ActionExecutorUtil.executeActions(sectionData.paths[path], pathQuery)
                    })

                }

                console.log(tree)
                axios.put(BASE_PROJECT_URL+'/'+this.projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            sectionData._signature = response.data.new_signature
                            commitFunctions.forEach(fn => fn())
                            this.$router.push({
                                name :'path-editor',
                                params: {sectionApi : this.sectionApi, pathApi : this.path}
                            })
                            this.loadData()
                        }
                    }
                ).catch(error => {
                    this.$bvToast.toast(error.response.data.message + ' , Please refresh the page.', {
                        title: 'Failed',
                        variant: 'danger'
                    })
                })

                return tree.root
            },
            cancel : function () {
                this.loadData()
                this.isEdited = false
            },
            /**
             * @returns list of variable name(list of string)
             */
            getVars : function () {
                let newVars = this.path.match(/\/\{\w+?(?=\})\}/g)
                if(newVars === null)newVars = []
                return newVars.map(v => {
                    return v.replace('{','').replace('}','').replace('/','')
                }).filter((val,i,self) =>{
                    return self.indexOf(val) === i
                })
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.isEdited = false
                this.isEditing = false
                let p = this.$route.params
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi
                this.pathApi = p.pathApi
                if(p.pathApi === undefined){
                    this.isCreateNew = true
                    this.path = ''
                    this.description = '<p></p>'
                    this.isEdited = true
                    this.isEditing = true
                }
                else{
                    this.isCreateNew = false
                    this.path = this.pathApi
                }

                if(this.pathData){
                    this.description = this.pathData.description
                }
                this.$_changeObserverMixin_initObserver([{
                    model : 'path',
                    validator : () => {
                        if(this.path){
                            if(this.path === this.pathApi)return []
                            let paths = this.sectionData.paths
                            if(paths){
                                for(let path in paths){
                                    if(path === this.path){
                                        return ['Path url must be unique']
                                    }
                                }
                            }
                            let validatorResult = KeyCheckerUtil.validateKey(this.path)
                            if(!validatorResult.isValid){
                                return [validatorResult.message]
                            }

                            return []
                        }
                        return ['Name can\'t be empty']
                    }
                },'description'])
            },
            //override
            $_changeObserverMixin_onDataChanged : function () {
                this.isEdited = true
            }
        },
        watch : {
            $route : function () {
                this.loadData()
            },
            pathData : function(){
                this.loadData()
            },
            //watch computed
            pathVariables : function () {
                let pv = this.pathVariables
                this.variables = []
                if(pv !== undefined){
                    let keys = this.getVars()
                    keys.forEach(key => {
                        if(pv[key] === undefined)return []
                        this.variables.push(pv[key])
                    })
                }
            },
            path : function (after, before) {
                let newVars = this.getVars()
                let newLen = newVars.length
                //jika menghapus
                if(newLen < this.variables.length){
                    this.variables.forEach((variable,i) => {
                        let notExist = -1 === newVars.findIndex(val => val === variable.name)

                        if(notExist){
                            delete this.variables[i]
                        }
                    })
                    this.variables = this.variables.filter(val => val !== undefined)
                }
                else if(newLen > this.variables.length){
                    for(let i = 0; i < newLen; i++){
                        let notExist = this.variables.find(variable => variable.name === newVars[i]) === undefined
                        if(notExist){
                            this.variables.splice(i,0,{
                                name : newVars[i],
                                    type : 'string'
                                }
                            )
                        }
                    }
                }
                else{
                    for(let i = 0; i < newLen; ++i){
                        let key = this.variables[i].name
                        if(key !== newVars[i]){
                            this.variables[i].name = newVars[i]
                        }
                    }
                }
            },
            projectState : function () {
                if(
                    (this.projectFetchState === NOT_FOUND) ||
                    (this.projectFetchState === COMPLETE && this.pathData === undefined && !this.isCreateNew)
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
        }
    }
</script>

<style scoped>

</style>
