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
            <input type="file" v-on:change="jsonFileLoaded">
            <DataTypeInput ref="root"
                           :schema-data="schemaData" :nameable="false"
                           :deleteable="false"
                           :editable="editable"
                           fixed-name="schema"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                            style="margin-top: 130px"/>
        </div>
    </div>
</template>

<script>
    import DataTypeInput from "../inputs/DataTypeInput";
    import { VueEditor } from 'vue2-editor'
    import ActionBuilderUtil from "@/utils/ActionBuilderUtil";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import JsonOasUtil from "@/utils/JsonOasUtil";

    export default {
        name: "bodyForm",
        components: {DataTypeInput,VueEditor},
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
            actionsQuery : []
        }),
        computed : {
            schemaData : function () {
                if(this.dataFromExternal){
                    return this.externalData
                }
                else{
                    if(this.bodyData === undefined)return undefined
                    return this.bodyData.schema
                }
            }
        },
        methods : {
            jsonFileLoaded : function(event){
                let file = event.target.files[0]

                let fr = new FileReader()
                fr.onload = e => {
                    // console.log(parsed(e.target.result))
                    this.externalData = JsonOasUtil.toSwaggerOas(JSON.parse(e.target.result))
                    this.$_changeObserverMixin_onDataChanged()
                    this.dataFromExternal = true
                };
                fr.readAsText(file)

            },
            getData : function () {
                return {
                    description : this.description,
                    in : this.in,
                    name : this.name,
                    schema : this.$refs.root.getData().attributes
                }
            },
            buildQuery : function (requestPointer) {

                let isEdited = false

                requestPointer._actions = ActionBuilderUtil.createActions(
                    this.bodyData,this._data,this.attributesKey
                )
                requestPointer._hasActions = true

                if(this.dataFromExternal){
                    requestPointer._actions.push({
                        action : 'put',
                        key : 'schema',
                        value : this.$refs.root.getData().attributes
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
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.dataFromExternal = false
                if(this.bodyData !== undefined){
                    let bd = this.bodyData
                    this.in = bd.in
                    this.description = (bd.description === undefined)?'':bd.description
                }

                if(this.parentIsEditing !== undefined){
                    this.isEditing = this.parentIsEditing
                }
                this.$_changeObserverMixin_initObserver(['in','description','contentTypes.length'])
            },
            reloadData : function () {
                this.loadData()
                this.$refs.root.reloadData()
            }
        },
        watch : {
            bodyData : function () {
                this.loadData()
            }
        },
        mounted() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
