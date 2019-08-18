<template>
    <div>
        <EditorHeaderComponent :isEdited="isEdited" :editable="$_projectPrivilege_canEdit" class="w-100"
                               :submit="submit" :cancel="cancel" :name="editorTitle"></EditorHeaderComponent>
        <div class="row dot-border" style="margin-left: 0.1em;margin-right: 0.5em;">
            <div v-if="isEditing" class="col-11 pl-1">
                <div class="form-group">
                    <label class="font-weight-bold">Name:</label>
                    <b-form-group class="mb-2 w-100"
                                  :state="sectionState" :invalid-feedback="sectionInvalidFeedback">
                        <b-input class="form-control w-100" :state="sectionState" trim v-model="name" name="section-input"></b-input>
                    </b-form-group>
                </div>
                <div class="form-group">
                    <label class="font-weight-bold">Description:</label>
                    <vue-editor v-model="description" name="section-description"></vue-editor>
                </div>
            </div>
            <div v-else class="col-11 pl-1">
                <h4 class="font-weight-bold">Section:</h4>
                <h5>{{name}}</h5>
                <h4 class="font-weight-bold">Description:</h4>
                <div v-html="description"></div>
            </div>
            <div class="col-1">
                <button v-if="$_projectPrivilege_canEdit" @click="isEditing = !isEditing"
                        class="float-right round-button btn mt-2" v-bind:id="_uid+'-edit-btn'">
                    <i class="fa fa-pencil-alt"></i>
                </button>
            </div>

        </div>

    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin"
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import DeepTreeBuilderUtil from "@/utils/DeepTreeBuilderUtil";
    import { VueEditor } from 'vue2-editor'
    import * as axios from "axios"
    import {BASE_PROJECT_URL} from "@/stores/consts/url";
    import uuidv4 from 'uuid/v4';
    import {COMPLETE, NOT_FOUND} from "@/stores/consts/FetchStatus";
    import EditorHeaderComponent from "./editor-components/EditorHeaderComponent";
    import ProjectPrivilegeMixin from "@/mixins/ProjectPrivilegeMixin";
    import KeyCheckerUtil from "@/utils/KeyCheckerUtil";
    import {makeToast} from "@/assets/toast";

    export default {
        name: "SectionEditor",
        components: {EditorHeaderComponent, VueEditor},
        mixins : [ChangeObserverMixin, ProjectPrivilegeMixin],
        data: function(){
            return {
                projectId: undefined,
                name: '',
                description: '',
                sectionApi: '',
                isEdited: false,
                isEditing: false,
                isCreateNew: false,
                attributesKey: [{key : 'name'},{key : 'description'}],
            }
        },
        computed : {
            sectionState : function () {
                return this.$_changeObserverMixin_isValid('name')
            },
            sectionInvalidFeedback : function (){
                return this.$_changeObserverMixin_getErrors('name')[0]
            },
            projectFetchState : function (){
                return this.$store.getters['project/getState']
            },
            editorTitle : function (){
                let name = (this.sectionApi)?this.sectionApi:'New Section'
                return '<h4 class=font-weight-bold><i class="fas fa-folder-open"></i> '+name+'</h4>'
            },
            sectionData(){
                if(this.sectionApi){
                    return this.$store.getters['project/getSectionData'](this.sectionApi)
                }
                return undefined
            },
            projectData() {
                return this.$store.getters['project/getProjectData']
            }
        },
        methods: {
            makeToast,
            loadData: function() {
                this.$_changeObserverMixin_unObserve()
                this.isEdited = false
                this.isEditing = false
                let p = this.$route.params
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi

                if (p.sectionApi === undefined){
                    this.isCreateNew = true
                    this.isEdited = true
                    this.isEditing = true
                    this.name = ''
                    this.description = ''
                }
                else if(this.sectionData){
                    this.isCreateNew = false
                    this.name = this.sectionData.info.name
                    this.description = this.sectionData.info.description
                }
                this.$_changeObserverMixin_initObserver([{
                    model : 'name',
                    validator : () => {
                        if(this.name){
                            if(this.name === this.sectionApi)return []
                            let sections = this.projectData.sections
                            if(sections){
                                for(let section in sections){
                                    if(section === this.name){
                                        return ['Section name must be unique']
                                    }
                                }
                            }
                            let validatorResult = KeyCheckerUtil.validateKey(this.name)
                            if(!validatorResult.isValid){
                                return [validatorResult.message]
                            }

                            return []
                        }
                        return ['name can\'t be empty']
                    },
                }, 'description'])
            },
            //override
            $_changeObserverMixin_onDataChanged : function (after,before) {
                this.isEdited = true
            },
            getData: function(){
              let res = {}
              res.name = this.name
              res.description = this.description
              return res
            },
            submit: function(){
                if(!this.$_changeObserverMixin_allIsValid()){
                    this.makeToast('danger', false, 'Can\'t submit due to invalid input!')
                    return
                }

                this.isEdited = false

                let tree = undefined
                let callbacks = []
                let sectionQuery = [] // refer to PathEditor
                if (this.isCreateNew){ // refer to Definition Editor create new Definitions
                    tree = DeepTreeBuilderUtil.buildDeepTree(['sections'])
                    tree.root._signature = this.projectData._signature
                    let data = this.getData()
                    data._signature = uuidv4()
                    tree.leaf._actions = [{
                        action: 'put',
                        key: this.name,
                        value: {
                            info: data,
                            _signature : uuidv4(),
                            paths:{}
                        }
                    }]

                    callbacks.push(() => {
                        ActionExecutorUtil.executeActions(this.projectData.sections, tree.leaf._actions)
                    })
                }
                else { // refer to Path Editor edit path, because also change path name in Side Bar
                    tree = DeepTreeBuilderUtil.buildDeepTree(['sections'])

                    if (this.sectionApi !== this.name) {
                        let tmp = tree.leaf._actions = [{
                            action: 'rename',
                            key: this.sectionApi,
                            newKey: this.name
                        }]
                        callbacks.push(() => {
                            ActionExecutorUtil.executeActions(this.projectData.sections, tmp)
                        })
                        tree.root._signature = this.projectData._signature // jika rename section, maka refer to project data signature

                        sectionQuery.push({
                            action: 'put',
                            key: 'name',
                            value: this.name
                        })
                    }

                    if (this.description !== this.sectionData.info.description){
                        sectionQuery.push({
                            action: 'put',
                            key: 'description',
                            value: this.description
                        })
                    }

                    tree.leaf[this.name] = {}
                    tree.leaf = tree.leaf[this.name].info = {
                        _actions: sectionQuery
                    }

                    //copy reference of current section data
                    //because sectionData can be changed before callback called
                    let target = this.sectionData
                    callbacks.push(() => {
                        ActionExecutorUtil.executeActions(target.info, sectionQuery)
                    })

                    if (tree.root._signature === undefined) tree.leaf._signature = this.sectionData.info._signature

                }

                console.log('Tree: ', tree)

                axios.put(BASE_PROJECT_URL+'/'+this.projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            if (tree.root._signature !== undefined) {// terjadi rename sections
                                this.projectData._signature = response.data.new_signature
                            }
                            else {
                                this.sectionData.info._signature = response.data.new_signature
                            }
                            callbacks.forEach(fn => fn())
                            this.$router.push({
                                name :'section-editor',
                                params: {sectionApi : this.name}
                            })
                        }
                    }
                ).catch(error => {
                    console.log(error)
                    this.makeToast('danger', error.response.data.success, error.response.data.message + ' ,Please refresh the page.')
                })
                return tree.root
            },
            cancel: function(){
                this.isEdited = false
                this.loadData()
            },
        },
        mounted() {
            this.loadData()
        },
        watch : {
            $route: function () {
                this.loadData()
            },
            sectionData: function () {
                this.loadData()
            },
            projectState : function () {
                if(
                    (this.projectFetchState === NOT_FOUND) ||
                    (this.projectFetchState === COMPLETE && this.sectionData === undefined && !this.isCreateNew)
                ){
                    this.$router.push({
                        name :'project-editor',
                        params : {
                            projectId : this.$route.params.projectId
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
