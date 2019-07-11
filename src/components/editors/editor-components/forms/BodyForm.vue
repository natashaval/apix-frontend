<template>
    <div>
        <div class="dot-border">
            <div class="form-row">
                <div class="col-11" v-if="isEditing">
                    <div class="form-group">
                        <label class="font-weight-bold">Description:</label>
                        <vue-editor v-model="description"></vue-editor>
                    </div>
                </div>
                <div class="col-11" v-else>
                    <label class="font-weight-bold">Description:</label>
                    <div v-html="description"></div>
                </div>
                <div class="col-1 pr-3 mt-2 mb-2">
                    <button v-if="editable" @click="isEditing = !isEditing"
                            class="float-right round-button btn" v-bind:id="_uid+'-edit-btn'">
                        <i class="fa fa-pencil-alt"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="form-group mt-3">
            <button @click="showHighLevelEditor = !showHighLevelEditor" class="btn btn-primary" style="font-size: 12px;">
                <i class="fas fa-edit"></i> switch editor
            </button>
            <button v-if="editable" v-b-modal="'modal-importer-'+_uid" class="btn btn-success" style="font-size: 12px;margin-left: 1em;">
                <i class="fas fa-download"></i> import from external json
            </button>
        </div>
        <HighLvlJsonEditor ref="root"
                           v-bind:style="{display : isShow(EDITOR_TYPE_HIGH_LEVEL)}"
                           :schema-data="schemaDataWrapper.data" :nameable="false"
                           :deleteable="false"
                           :editable="editable"
                           fixed-name="schema"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>
        <LowLvlJsonEditor ref="lowLvlEditor"
                          v-if="schemaDataWrapper.data !== undefined"
                          v-bind:style="{
                              display : isShow(EDITOR_TYPE_LOW_LEVEL)
                          }"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                          :json-input="schemaDataWrapper.data" class="form-control"/>

        <b-modal :id="'modal-importer-'+_uid" title="Import From External Json" hide-footer>
            <div class="form-group">
                <label class="font-weight-bold">select json file or paste to here</label>
                <input type="file" v-on:change="jsonFileLoaded">
            </div>
            <div class="form-group">
                <button class="btn btn-outline-primary btn-sm" @click="fillWithExampleJson">click for example json</button>

            </div>

            <LowLvlJsonEditor class="form-control"
                              ref="modalJsonInput"
                              v-bind:style="{display: 'block',height: '400px'}"/>
            <button class="mt-3 btn btn-success" @click="()=>{doImport();}">import</button>
        </b-modal>
    </div>
</template>

<script>
    import Vue from "vue";
    import HighLvlJsonEditor from "../inputs/HighLvlJsonEditor";
    import { VueEditor } from 'vue2-editor'
    import ActionBuilderUtil from "@/utils/ActionBuilderUtil";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import JsonOasUtil from "@/utils/JsonOasUtil";
    import LowLvlJsonEditor from "../inputs/LowLvlJsonEditor";
    import {makeToast} from "@/assets/toast";

    export default {
        name: "bodyForm",
        components: {LowLvlJsonEditor, HighLvlJsonEditor,VueEditor},
        mixins : [ChangeObserverMixin],
        props : {
            editable : {
                type : Boolean,
                default : true
            },
            bodyData : {
                type : Object
            },
            parentIsEditing : {//default value dari @isEditing
                type : Boolean
            },
        },
        data : () => ({
            EDITOR_TYPE_HIGH_LEVEL : true,
            EDITOR_TYPE_LOW_LEVEL : false,
            isEditing : false,
            description : '',
            attributesKey : ['description'],
            schemaDataWrapper : {data : undefined},
            showHighLevelEditor : true
        }),
        methods : {
            makeToast,
            doImport : function () {
                try{
                    Vue.delete(this.schemaDataWrapper.data)
                    Vue.set(
                        this.schemaDataWrapper, 'data',
                        JsonOasUtil.toSwaggerOas(this.$refs.modalJsonInput.getJson())
                    )
                    this.$_changeObserverMixin_onDataChanged(true, false)
                    this.$refs.lowLvlEditor._data.isEdited = true
                    this.$bvModal.hide('modal-importer-'+this._uid)
                    this.makeToast('success',true,'Json file imported.')
                }
                catch (e) {
                    this.makeToast('danger',false,'Invalid Json!')
                }
            },
            isShow : function (type){
                switch (type) {
                    case this.EDITOR_TYPE_HIGH_LEVEL:
                        return (this.showHighLevelEditor)?'block':'none'
                    case this.EDITOR_TYPE_LOW_LEVEL:
                        return (!this.showHighLevelEditor)?'block':'none'
                }
            },
            fillWithExampleJson : function(){
                this.$refs.modalJsonInput.setJson({
                    "string1": "",
                    "string2": "myValue",
                    "number1": 1,
                    "number2" :1.2,
                    "obj1" : {
                        "obj-str": "",
                        "obj-num": 2
                    },
                    "array1": [1],
                    "array2": [""],
                    "array3": [{
                        "arr-obj-str" : ""
                    }],
                    "array4":[[
                        {"arr-arr-obj-str" : ""}
                    ]]
                })
            },
            jsonFileLoaded : function(event){
                let file = event.target.files[0]

                let fr = new FileReader()
                fr.onload = e => {
                    try{
                        this.$refs.modalJsonInput.setJson(JSON.parse(e.target.result))
                    }
                    catch (e) {
                        this.makeToast('danger',false,'Invalid Json File!')
                    }
                };
                fr.readAsText(file)

            },
            getData : function () {
                return {
                    description : this.description,
                    schema : this.$refs.root.getData()
                }
            },
            buildQuery : function (requestPointer) {
                let isEdited = false
                let callbacks = []
                let bodyData = this.bodyData

                if(requestPointer._hasActions === undefined){
                    requestPointer._hasActions = true
                    requestPointer._actions = []
                }
                if(this.$refs.lowLvlEditor._data.isEdited){
                    try{
                        let json = this.$refs.lowLvlEditor.getJson()
                        requestPointer._actions.push({
                            action : 'put',
                            key : 'schema',
                            value : json
                        })
                        return () => {
                            Vue.delete(bodyData.schema)
                            Vue.set(bodyData, 'schema', json)
                            this.$refs.lowLvlEditor._data.isEdited = false
                        }
                    }
                    catch (e) {
                        this.loadData()
                        this.makeToast('warning',false,'reload data')
                        return undefined
                    }
                }

                requestPointer._actions = requestPointer._actions.concat(
                    ActionBuilderUtil.createActions(this.bodyData,this._data,this.attributesKey)
                )

                let callback = this.$refs.root.buildQuery(requestPointer)

                if(callback === undefined){
                    delete requestPointer.schema
                }
                else{
                    isEdited = true
                    callbacks.push(callback)
                }

                if(requestPointer._actions.length > 0){
                    isEdited = true
                    callbacks.push(()=>{
                        ActionExecutorUtil.executeActions(bodyData, requestPointer._actions)
                    })
                    requestPointer._hasActions = true
                }
                else{
                    delete requestPointer._actions
                    delete requestPointer._hasActions
                }

                let ref = this.$refs.root
                return (isEdited)? async ()=>{
                    callbacks.forEach(fn => fn())
                    Vue.delete(bodyData.schema)
                    Vue.set(bodyData, 'schema', ref.getData())
                    await this.$nextTick()
                    this.$refs.lowLvlEditor._data.isEdited = false
                } : undefined
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                if(this.bodyData !== undefined){
                    let bd = this.bodyData
                    this.description = (bd.description === undefined)?'':bd.description
                    Vue.delete(this.schemaDataWrapper, 'data')
                    Vue.set(this.schemaDataWrapper, 'data', Object.assign({},this.bodyData.schema))
                    if(this.$refs.lowLvlEditor){
                        this.$refs.lowLvlEditor.setJson(this.schemaDataWrapper.data)
                    }
                }
                else{
                    this.schemaDataWrapper.data = {}
                    this.description = ''
                }

                if(this.parentIsEditing !== undefined){
                    this.isEditing = this.parentIsEditing
                }
                this.$_changeObserverMixin_initObserver(['description','contentTypes.length'])
            },
            reloadData : function () {
                this.loadData()
                this.$refs.root.reloadData()
                if(this.$refs.lowLvlEditor){
                    this.$refs.lowLvlEditor.reloadData()
                }
            }
        },
        watch : {
            bodyData : function () {
                this.loadData()
            },
            showHighLevelEditor : function (after, before) {
                if(after === this.EDITOR_TYPE_HIGH_LEVEL){
                    try{
                        Vue.delete(this.schemaDataWrapper, 'data')
                        Vue.set(this.schemaDataWrapper, 'data', this.$refs.lowLvlEditor.getJson())
                    }
                    catch (e) {
                        this.makeToast('warning',false,'reload data')
                        this.loadData()
                    }
                }
                else{
                    // Vue.delete(this.schemaDataWrapper, 'data')
                    // Vue.set(this.schemaDataWrapper, 'data', this.$refs.root.getData())
                    this.$refs.lowLvlEditor.setJson(this.$refs.root.getData())
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
