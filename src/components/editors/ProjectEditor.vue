<template>
    <div>
        <SaveComponent :isEdited="isEdited" :editable="$_projectPrivilege_canEdit"
                       :submit="submit" :cancel="cancel" :name="editorTitle"></SaveComponent>
        <div class="form-row">
            <div class="col-11 pl-3" v-if="isEditing">
                <div class="form-row">
                    <div class="col-8 mb-2 form-group">
                        <label class="font-weight-bold">Title:</label>
                        <input name="title" v-model="title" class="form-control" type="text" placeholder="Project Title">
                    </div>
                    <div class="col-4 mb-2 form-group">
                        <label class="font-weight-bold">Version:</label>
                        <input name="version" v-model="version" class="form-control">
                    </div>
                </div>
                <div class="form-row pl-2">
                    <div class="form-group">
                        <label class="font-weight-bold">Description:</label>
                        <vue-editor name="description" v-model="description"></vue-editor>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-6">
                        <label class="font-weight-bold">Host:</label>
                        <input name="host" v-model="host" class="form-control">
                    </div>
                    <div class="form-group col-6">
                        <label class="font-weight-bold">Base Url:</label>
                        <input name="baseUrl" v-model="basePath" class="form-control">
                    </div>
                </div>
                <div class="form-row mb-4">
                    <div class="col-4 form-group">
                        <label class="font-weight-bold">Contact Name:</label>
                        <input name="contactName" v-model="contactName" class="form-control">
                    </div>
                    <div class="col-4 form-group">
                        <label class="font-weight-bold">Contact Email:</label>
                        <input name="contactEmail" v-model="contactEmail" class="form-control">
                    </div>
                    <div class="col-4 form-group">
                        <label class="font-weight-bold">Contact Url:</label>
                        <input name="contactUrl" v-model="contactUrl" class="form-control">
                    </div>
                </div>

            </div>
            <div class="col-11 pl-3" v-else>
                <div class="dot-border">
                    <h1 class="text-center font-weight-bold">{{title}}</h1>
                    <h3 class="text-center">v {{version}}</h3>
                    <h3 class="text-center">Host: {{host}}</h3>
                    <h3 class="text-center">Base Url: {{basePath}}</h3>
                    <h3 class="text-center" v-if="contactName">Contact Name: {{contactName}}</h3>
                    <h3 class="text-center" v-if="contactEmail">Contact Email: {{contactEmail}}</h3>
                    <h3 class="text-center" v-if="contactUrl">Contact Url: {{contactUrl}}</h3>
                    <div class="dot-border">
                        <h3 class="text-center">Description :</h3>
                        <div v-html="description" class="text-center"></div>
                    </div>
                </div>
            </div>
            <div class="col-1 pr-4 pt-1">
                <button v-if="$_projectPrivilege_canEdit" @click="isEditing = !isEditing"
                        class="float-right round-button btn" v-bind:id="_uid+'-edit-btn'">
                    <i class="fa fa-pencil-alt"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin"
    import {VueEditor} from "vue2-editor"
    import ActionBuilder from "@/utils/ActionBuilderUtil"
    import * as axios from "axios"
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil"
    import {NOT_FOUND} from "@/stores/consts/FetchStatus"
    import SaveComponent from "./editor-components/EditorHeaderComponent"
    import ProjectPrivilegeMixin from "@/mixins/ProjectPrivilegeMixin"
    import {BASE_PROJECT_URL} from "@/stores/actions/const"

    export default {
        name: "ProjectEditor",
        components: {SaveComponent, VueEditor},
        mixins : [ChangeObserverMixin, ProjectPrivilegeMixin],
        props : ['projectId'],
        data : ()=>({
            title : '',
            description : '<p></p>',
            host: '',
            basePath: '',
            version: '',
            contactName: '',
            contactEmail: '',
            contactUrl: '',
            isEdited : false,
            isEditing : false
        }),
        computed : {
            projectState : function (){
                return this.$store.getters['project/getState']
            },
            apiData : function () {
                return this.$store.getters['project/getProjectData']
            },
            editorTitle : function () {
                return '<h4><i class="fas fa-atom"></i> '+ this.title+'</h4>'
            }
        },
        methods: {
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            loadData: function () {
                if(this.apiData && this.apiData.info){
                    this.isEdited = false
                    this.$_changeObserverMixin_unObserve()
                    let p = this.apiData
                    this.title = p.info.title
                    this.description = p.info.description
                    this.host = p.host
                    this.basePath = p.basePath
                    this.version = p.info.version
                    this.$_changeObserverMixin_initObserver(['title','description','host','basePath','version'])
                }
            },
            submit : function () {
                let callbacks = []
                let infoQuery = ActionBuilder.createActions(this.apiData.info, this._data, [
                    'title','version','description'])
                let tree = {
                    _signature: this.apiData._signature
                }

                if(infoQuery.length > 0){
                    tree.info = {
                        _actions: infoQuery,
                        _hasActions: true
                    }
                    callbacks.push(()=>{
                        ActionExecutorUtil.executeActions(this.apiData.info, infoQuery)
                    })
                }

                let apiQuery = ActionBuilder.createActions(this.apiData, this._data, ['basePath','host'])

                if(apiQuery.length > 0){
                    tree._actions = apiQuery
                    tree._hasActions = true
                    ActionExecutorUtil.executeActions(this.apiData, apiQuery)
                }

                axios.put(BASE_PROJECT_URL+'/'+this.projectId,tree).then(
                    (response) => {
                        if(response.status === 200){
                            this.apiData._signature = response.data.new_signature
                            callbacks.forEach(fn => fn())
                            this.loadData()
                        }
                    }
                ).catch(error => {
                    this.$bvToast.toast(error.response.data.message + ' , Please refresh the page.', {
                        title: 'Failed',
                        variant: 'danger'
                    })
                })

            },
            cancel : function () {
                this.isEdited = false
            },
            //override
            $_changeObserverMixin_onDataChanged : function (after,before) {
                this.isEdited = true
            }
        },
        watch : {
            apiData : function () {
                this.loadData()
            },
            projectState : function () {
                if(this.projectState === NOT_FOUND){
                    this.$router.push({
                        name :'project-repo'
                    })
                }
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.setLayout('single-layout');
            });
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
