<template>
    <div>
        <SaveComponent :isEdited="isEdited"
                       :submit="submit" :cancel="cancel" name="<h3 class=font-weight-bold>Section Editor</h3>"></SaveComponent>
        <div class="row dot-border" style="margin-left: 0.1em;margin-right: 0.5em;">
            <div v-if="isEditing" class="col-11">
                <div class="form-group">
                    <label class="font-weight-bold">Name:</label>
                    <input class="form-control" v-model="name"/>
                </div>
                <div class="form-group">
                    <label class="font-weight-bold">Description:</label>
                    <vue-editor v-model="description"></vue-editor>
                </div>
            </div>
            <div v-else class="col-11">
                <h4 class="font-weight-bold">Section:</h4>
                <h5>{{name}}</h5>
                <h4 class="font-weight-bold">Description:</h4>
                <div v-html="description"></div>
            </div>
            <div class="col-1">
                <button v-if="editable" @click="isEditing = !isEditing"
                        class="float-right round-button btn mt-2" v-bind:id="_uid+'-edit-btn'">
                    <i class="fa fa-pencil-alt"></i>
                </button>
            </div>

        </div>

    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin"
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";
    import DeepTreeBuilderUtil from "../../utils/DeepTreeBuilderUtil";
    import { VueEditor } from 'vue2-editor'
    import * as axios from "axios"
    import {BASE_URL} from "../../stores/actions/const";
    import uuidv4 from 'uuid/v4';
    import {COMPLETE, NOT_FOUND} from "@/stores/consts/FetchStatus";
    import SaveComponent from "./editor-components/SaveComponent";

    export default {
        name: "SectionEditor",
        components: {SaveComponent, VueEditor},
        mixins : [ChangeObserverMixin],
        data: function(){
            return {
                projectId: undefined,
                name: '',
                description: '',
                sectionApi: '',
                isEdited: false,
                isEditing: false,
                isCreateNew: false,
                sectionActions: [],
                sectionRootActions: [],
                attributesKey: [{key : 'name'},{key : 'description'}],
            }
        },
        computed : {
            projectState : function (){
                return this.$store.getters['project/getState']
            },
            editable : function () {
                let hasEditingPrivilege = this.$store.getters['user/hasEditingPrivilege']
                if(hasEditingPrivilege === undefined)return false
                return hasEditingPrivilege
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
                }
                else if(this.sectionData){
                    this.isCreateNew = false
                    this.name = this.sectionData.info.name
                    this.description = this.sectionData.info.description
                }
                this.$_changeObserverMixin_initObserver(['name', 'description'])
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
                this.isEdited = false

                let tree = undefined
                let callbacks = []
                let sectionQuery = [] // refer to PathEditor

                if (this.isCreateNew){ // refer to Definition Editor create new Definitions
                    tree = DeepTreeBuilderUtil.buildDeepTree(['sections'])
                    tree.root._signature = this.projectData._signature
                    let data = this.getData()
                    data._signature = uuidv4()
                    this.sectionRootActions = tree.leaf._actions = [{
                        action: 'put',
                        key: this.name,
                        value: {
                            info: data,
                            _signature : uuidv4(),
                            paths:{}
                        }
                    }]
                    tree.leaf._hasActions = true

                    callbacks.push(() => {
                        ActionExecutorUtil.executeActions(this.projectData.sections, this.sectionRootActions)
                    })
                }
                else { // refer to Path Editor edit path, because also change path name in Side Bar
                    tree = DeepTreeBuilderUtil.buildDeepTree(['sections'])

                    if (this.sectionApi !== this.name) {
                        this.sectionRootActions = tree.leaf._actions = [{
                            action: 'rename',
                            key: this.sectionApi,
                            newKey: this.name
                        }]
                        callbacks.push(() => {
                            ActionExecutorUtil.executeActions(this.projectData.sections, this.sectionRootActions) // TIDAK YAKIN
                        })
                        tree.leaf._hasActions = true
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
                        _actions: sectionQuery,
                        _hasActions: true
                    }

                    callbacks.push(() => {
                        ActionExecutorUtil.executeActions(this.sectionData.info, sectionQuery)
                    })

                    if (tree.root._signature === undefined) tree.leaf._signature = this.sectionData.info._signature

                }

                console.log('Tree: ', tree)

                axios.put(BASE_URL + 'projects/'+this.projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            if (tree.root._signature !== undefined) {
                                this.projectData._signature = response.data.new_signature
                            } // terjadi rename sections
                            else {
                                this.sectionData.info._signature = response.data.new_signature;
                            }
                            callbacks.forEach(fn => fn())
                            this.$router.push({
                                name :'section-editor',
                                params: {sectionApi : this.name}
                            })
                        }
                    }
                ).catch(function (error) {
                    console.log(error);
                })
            },
            cancel: function(){
                console.log('cancel')
                this.isEdited = false
                this.loadData();
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
                    (this.projectState === NOT_FOUND) ||
                    (this.projectState === COMPLETE && this.sectionData === undefined && !this.isCreateNew)
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
