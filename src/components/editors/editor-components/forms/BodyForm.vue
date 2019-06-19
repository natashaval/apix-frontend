<template>
    <div>
        <div class="dot-border">
            <h1>Body</h1>
            <b-button v-if="editable" @click="isEditing = !isEditing" class="float-right round-button">
                <i class="fa fa-pencil-alt"></i>
            </b-button>
            <div class="row" v-if="isEditing">
                <div style="margin-left: 15px">
                    <label>Description:</label>
                </div>
                <div class="col">
                    <vue-editor style="height: 100px;" v-model="description"></vue-editor>
                </div>
            </div>
            <div v-else>
                <div v-html="description"></div>
            </div>
            <div style="margin-top: 30px" class="container">
                <b-button v-b-modal.modal-importer>import from external json</b-button>
                <button @click="showHighLevelEditor = !showHighLevelEditor">change editor</button>
            </div>
            <HighLvlJsonEditor
                    ref="root"
                           v-bind:style="{display : isShow(EDITOR_TYPE_HIGH_LEVEL)}"
                           :schema-data="schemaDataWrapper.data" :nameable="false"
                           :deleteable="false"
                           :editable="editable"
                           fixed-name="schema"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                           style="margin-top: 130px"/>
            <LowLvlJsonEditor
                    v-if="schemaDataWrapper.data !== undefined"
                    v-bind:style="{
                        display : isShow(EDITOR_TYPE_LOW_LEVEL),
                        width:'600px',height: '1000px'
                    }"
                    :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                    ref="lowLvlEditor" :json-input="schemaDataWrapper.data"/>

            <b-modal id="modal-importer" title="Import From External Json" hide-footer>
                <p>select json file or paste to here</p>
                <input type="file" v-on:change="jsonFileLoaded">
                <LowLvlJsonEditor
                        ref="modalJsonInput"
                        v-bind:style="{display: 'block',width:'400px',height: '400px'}"/>
                <b-button class="mt-3" @click="()=>{doImport();$bvModal.hide('modal-importer');}">import</b-button>
            </b-modal>
        </div>
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
            jsonFile : undefined,
            description : '',
            isEditMode : false,
            dataFromExternal : false,
            externalData : undefined,
            in : 'body',
            isEditing : false,
            attributesKey : [
                {key : 'description'},
                {key : 'in'},
                {keyBefore : 'name', keyAfter: 'in'}
            ],
            commitChangeCallback : [],
            actionsQuery : [],
            schemaDataWrapper : {data : undefined},
            showHighLevelEditor : true
        }),
        methods : {
            doImport : function () {
                Vue.delete(this.schemaDataWrapper.data)
                Vue.set(this.schemaDataWrapper, 'data', JsonOasUtil.toSwaggerOas(this.$refs.modalJsonInput.getJson()))
                this.$_changeObserverMixin_onDataChanged()
                this.$refs.lowLvlEditor._data.isEdited = true
                console.log(this.$refs.lowLvlEditor._data)
            },
            isShow : function (type){
                switch (type) {
                    case this.EDITOR_TYPE_HIGH_LEVEL:
                        return (this.showHighLevelEditor)?'block':'none'
                    case this.EDITOR_TYPE_LOW_LEVEL:
                        return (!this.showHighLevelEditor)?'block':'none'
                }
            },
            jsonFileLoaded : function(event){
                let file = event.target.files[0]

                let fr = new FileReader()
                fr.onload = e => {
                    this.$refs.modalJsonInput.setJson(JSON.parse(e.target.result))
                };
                fr.readAsText(file)

            },
            getData : function () {
                return {
                    description : this.description,
                    in : this.in,
                    name : this.name,
                    schema : this.$refs.root.getData()
                }
            },
            buildQuery : function (requestPointer) {
                let isEdited = false
                if(this.$refs.lowLvlEditor.isEdited){
                    let json = this.$refs.lowLvlEditor.getJson()
                    requestPointer._actions = [{
                        action : 'put',
                        key : 'schema',
                        value : json
                    }]
                    this.commitChangeCallback.push(()=>{
                        Vue.delete(this.bodyData.schema)
                        Vue.set(this.bodyData, 'schema', json)
                    })
                    return this.commitChange
                }

                requestPointer._actions = ActionBuilderUtil.createActions(
                    this.bodyData,this._data,this.attributesKey
                )
                requestPointer._hasActions = true

                if(this.dataFromExternal){
                    requestPointer._actions.push({
                        action : 'put',
                        key : 'schema',
                        value : this.$refs.root.getData()
                    })
                }
                else{
                    let callback = this.$refs.root.buildQuery(requestPointer)

                    if(callback === undefined){
                        delete requestPointer.schema
                    }
                    else{
                        isEdited = true
                        this.commitChangeCallback.push(callback)
                    }
                }

                if(requestPointer._actions.length > 0){
                    isEdited = true
                    this.actionsQuery = requestPointer._actions
                    requestPointer._hasActions = true
                }
                else{
                    delete requestPointer._actions
                    delete requestPointer._hasActions
                }

                return (isEdited)?this.commitChange : undefined
            },
            commitChange : function () {
                ActionExecutorUtil.executeActions(this.bodyData, this.actionsQuery)
                this.commitChangeCallback.forEach(fn => fn())
                if(!this.$refs.lowLvlEditor.isEdited){
                    Vue.delete(this.bodyData.schema)
                    Vue.set(this.bodyData, 'schema', this.$refs.root.getData())
                }
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.dataFromExternal = false
                if(this.bodyData !== undefined){
                    let bd = this.bodyData
                    this.in = bd.in
                    this.description = (bd.description === undefined)?'':bd.description
                    this.schemaDataWrapper.data = Object.assign({},this.bodyData.schema)
                    this.bodyData.schema.original = true
                }

                if(this.parentIsEditing !== undefined){
                    this.isEditing = this.parentIsEditing
                }
                this.$_changeObserverMixin_initObserver(['in','description','contentTypes.length'])
            },
            reloadData : function () {
                this.loadData()
                this.$refs.root.reloadData()
                this.$refs.lowLvlEditor.reloadData()
            }
        },
        watch : {
            bodyData : function () {
                this.loadData()
            },
            showHighLevelEditor : function (after, before) {
                if(after === this.EDITOR_TYPE_HIGH_LEVEL){
                    this.schemaDataWrapper.data = this.$refs.lowLvlEditor.getJson()
                }
                else{
                    this.schemaDataWrapper.data = this.$refs.root.getData()
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
