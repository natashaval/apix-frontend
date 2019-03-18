<template>
    <div>
        <!--body-->
        <div class="dot-border">
            <h1>Body</h1>
            <b-button @click="isEditing = !isEditing" class="float-right round-button">
                <i class="fa fa-pencil-alt"></i>
            </b-button>
            <div class="row" v-if="isEditing">
                <b-form-select v-model="contentType" :options="options"/>
                <div style="margin-left: 15px">
                    <label>Description:</label>
                </div>
                <div class="col">
                    <vue-editor style="height: 100px;" v-model="description"></vue-editor>
                </div>
            </div>
            <div v-else>
                <div>Content Type : {{contentType}}</div>
                <div v-html="description"></div>
            </div>
            <DataTypeInput ref="root"
                           :schema-data="(bodyData !== undefined)?bodyData.schema:undefined" :name-able="false"
                           :delete-able="false"
                           :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
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

    export default {
        name: "bodyForm",
        components: {DataTypeInput,VueEditor},
        mixins : [ChangeObserverMixin],
        props : {
            bodyData : {
                type : Object
            },
            parentIsEditing : {//default value dari @isEditing
                type : Boolean
            },
        },
        data : () => ({
            description : '',
            isEditMode : false,
            contentType : 'application/json',
            in : 'body',
            isEditing : false,
            options : [
                {value : 'application/json', text : 'application/json'},
                {value : 'multipart/form-data', text : 'multipart/form-data'}
            ],
            attributesKey : [
                {key : 'description'},
                {key : 'in'},
                {keyBefore : 'name', keyAfter: 'in'}
            ],
            commitChangeCallback : [],
            actionsQuery : []
        }),
        computed : {

        },
        methods : {
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

                let callback = this.$refs.root.buildQuery(requestPointer)

                if(callback === undefined){
                    delete requestPointer.schema
                }
                else{
                    isEdited = true
                    this.commitChangeCallback.push(callback)
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
                if(this.bodyData !== undefined){
                    let bd = this.bodyData
                    this.in = bd.in
                    switch (this.in) {
                        case 'body':
                            this.contentType = 'application/json'
                            break
                        case 'formData':
                            this.contentType = 'multipart/form-data'
                    }
                    this.description = (bd.description === undefined)?'':bd.description
                }
                if(this.parentIsEditing !== undefined){
                    this.isEditing = this.parentIsEditing
                }
                this.$_changeObserverMixin_initObserver(['in','description'])
            },
            reloadData : function () {
                this.loadData()
                this.$refs.root.reloadData()
            }
        },
        watch : {
            contentType : function () {
                switch (this.contentType) {
                    case 'application/json':
                        this.in = 'body'
                        break
                    case 'multipart/form-data':
                        this.in = 'formData'
                        break
                }
            },
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