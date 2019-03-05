<template>
    <div>
        <!--body-->
        <div v-if="bodyData.schema !== undefined" class="dot-border">
            <h1>Body</h1>
            <b-form-select v-model="contentType" :options="options"/>
            <div class="row">
                <div style="margin-left: 15px">
                    <label>Description:</label>
                </div>
                <div class="col">
                    <vue-editor style="height: 100px;" v-model="description"></vue-editor>
                </div>
            </div>
            <DataTypeInput ref="root" :schema-data="bodyData.schema" :name-able="false"
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
            }
        },
        data : () => ({
            description : '',
            isEditMode : false,
            contentType : 'application/json',
            in : 'body',
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
        methods : {
            buildQuery : function (operationPointer,requestBodyPointer) {
                let isEdited = false
                let requestBody = operationPointer.requestBody

                let actions = ActionBuilderUtil.createActions(
                    this.bodyData,this._data,this.attributesKey
                )
                if(actions.length !== 0){
                    isEdited = true
                    requestBody._actions = actions
                    requestBody._hasActions = true
                    if(this.in !== this.bodyData.in){
                        if(operationPointer._hasActions === undefined){
                            operationPointer._hasActions = true
                            operationPointer._actions = []
                        }

                        operationPointer._actions.push({
                            key : 'consumes',
                            value : [this.contentType]
                        })
                    }
                }

                let callback = this.$refs.root.buildQuery(requestBodyPointer)

                if(callback !== undefined){
                    isEdited = true
                    this.commitChangeCallback.push(callback)
                }

                if(requestBodyPointer._actions !== undefined){
                    if(requestBodyPointer._actions.length === 0){
                        delete requestBodyPointer._actions
                        delete requestBodyPointer._hasActions
                    }
                    else{
                        this.actionsQuery = requestBodyPointer._actions
                    }
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
                this.$_changeObserverMixin_initObserver(['in','description'])
            },
            reloadData : function () {
                this.loadData()
                this.$refs.root.reloadData()
            }
        },
        mounted() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>