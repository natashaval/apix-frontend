<template>
    <div>
        <ul v-if="isEdited">
            <li><button @click="submit">Save</button></li>
            <li><button @click="cancel">Cancel</button></li>
        </ul>
        <div class="row" v-if="isEditing">
            <div class="col-11">
                <div class="form-group">
                    <label>Title:</label>
                    <input name="title" v-model="title">
                </div>
                <div class="form-group">
                    <label>Version:</label>
                    <input name="version" v-model="version">
                </div>
                <div class="form-group">
                    <label>Host:</label>
                    <input name="host" v-model="host">
                </div>
                <div class="form-group">
                    <label>Base Url:</label>
                    <input name="baseUrl" v-model="basePath">
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <vue-editor name="description" v-model="description"></vue-editor>
                </div>
            </div>
            <div class="col-1">
                <button v-if="editable" @click="isEditing = !isEditing"
                        class="float-right round-button btn" v-bind:id="_uid+'-edit-btn'">
                    <i class="fa fa-pencil-alt"></i>
                </button>
            </div>

        </div>
        <div class="row" v-else>
            <div class="col-11">
                <h1>{{title}}</h1>
                <h3>v {{version}}</h3>
                <h3>Host: {{host}}</h3>
                <h3>Base Url: {{basePath}}</h3>
                <div v-html="description"></div>
            </div>
            <div class="col-1">
                <button v-if="editable" @click="isEditing = !isEditing"
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

    export default {
        name: "ProjectEditor",
        components: {VueEditor},
        mixins : [ChangeObserverMixin],
        props : ['projectId'],
        data : ()=>({
            title : '',
            description : '<p></p>',
            host: '',
            basePath: '',
            version: '',
            isEdited : false,
            isEditing : false
        }),
        computed : {
            apiData : function () {
                return this.$store.getters['project/getProjectData']
            },
            editable : function () {
                let hasEditingPrivilege = this.$store.getters['user/hasEditingPrivilege']
                if(hasEditingPrivilege === undefined)return false
                return hasEditingPrivilege
            },
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

                axios.put('http://localhost:8080/projects/'+this.projectId,tree).then(
                    (response) => {
                        if(response.status === 200){
                            this.apiData._signature = response.data.new_signature
                            callbacks.forEach(fn => fn())
                            this.loadData()
                        }
                    }
                ).catch(function (error) {
                    console.log(error)
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
