<template>
    <div>
        <div class="row">
            <div v-if="isEditing" class="col">
                <b-select v-model="selectedCode" :options="statusOptions"/>
                <p v-for="(error,i) in $_changeObserverMixin_getErrors('selectedCode')"
                   v-bind:key="i"
                   class="error-message">{{error}}</p>
            </div>
            <div v-else class="col">
                <p>Status Code : {{selectedCode}}</p>
            </div>
            <b-button @click="isEditing = !isEditing" class="float-right round-button">
                <i class="fa fa-pencil-alt"></i>
            </b-button>
        </div>
        <div>
            <button @click="hasHeaders = true">Add Header</button>
            <PropertyForm v-if="hasHeaders" ref="headers"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                          :schemas-data="headersData"/>
        </div>
        <div>
            <button @click="hasBody = true">Add Body</button>
            <BodyForm v-if="hasBody" :body-data="responseData" ref="body"
                      :$_changeObserverMixin_parent="$_changeObserverMixin_this"
            />
        </div>
    </div>
</template>

<script>
    import HttpStatusCode from "@/consts/HttpStatusCode";
    import BodyForm from "./BodyForm";
    import PropertyForm from "./PropertyForm";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";

    export default {
        name : "ResponseForm",
        components: {PropertyForm, BodyForm},
        mixins : [ChangeObserverMixin],
        props : {
            responseCode : {
                type : String,
                required : true
            },
            responseData : {
                type : Object
            },
            componentIdx : {
                type : Number,
                required : true
            },
            notifyChangeStatusCode : {
                type : Function,
                required : true
            },
            isDuplicateCode : {
                type : Function,
                required : true
            }
        },
        data : () => ({
            isEditing : false,
            selectedCode : '',
            initCode : '',
            hasBody : false,
            hasHeaders : false,
            commitChangeCallback : [],
            actionsQuery : []
        }),
        computed : {
            headersData : function () {
                if(this.responseData === undefined){
                    return undefined
                }

               return (this.responseData.headers === undefined)?undefined:this.responseData.headers
            },
            statusOptions : function () {
                return HttpStatusCode.map(statusData => {
                    return {text : statusData.code+' - '+statusData.description, value : statusData.code}
                })
            }
        },
        methods : {
            //fungsi callback dari $watch.selectedCode
            //tidak ditulis di dalam 'watch : {}' karna kita perlu mengaktifkan observer setelah semua data terload
            //sedangkan 'watch : {}' ditrigger sebelum data diload
            watchSelectedCode : function () {
                this.notifyChangeStatusCode(this.componentIdx,this.selectedCode)

                //karna watcher cuma boleh 1, maka code dari ChangeObserverMixin dicopy kesini
                if(!this.$_changeObserverMixin_wasTriggered && this.$_changeObserverMixin_parent !== undefined){
                    this.$_changeObserverMixin_unObserve()
                    this.$_changeObserverMixin_parent.onDataChanged()
                }
                this.$_changeObserverMixin_wasTriggered = true
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                if(this.responseData !== undefined){
                    let rd = this.responseData
                    if(rd.schema !== undefined){
                        this.hasBody = true
                    }

                    if(rd.headers){
                        this.hasHeaders = true
                    }

                    this.description = rd.description
                }

                if(this.responseCode !== undefined){
                    this.selectedCode = this.responseCode
                    this.initCode = this.responseCode
                }
                this.$watch('selectedCode',this.watchSelectedCode)
                this.$_changeObserverMixin_initObserver([{
                    model : 'selectedCode',
                    callback : this.watchSelectedCode,
                    validator : () => {
                        if(this.isDuplicateCode(this.componentIdx)){
                            return ['response code must be unique']
                        }
                        return []
                    }
                }])
            },
            getActions : function () {
                if(this.responseData === undefined)return []

                //cuma 1 yang perlu dicek, maka tidak usah pakai ActionBuilderUtil.js
                if(this.responseData.description !== this.description){
                    return [{
                        action : 'put',
                        key : 'description',
                        value : this.description
                    }]
                }
                else{
                    return []
                }
            },
            getData : function () {
                let res = {}
                if(this.hasBody)res = this.$refs.body.getData()
                res.description = this.description

                if(this.hasHeaders)res.headers = this.$refs.headers.getData()
                return res
            },
            buildQuery : function (responsesPointer) {
                let isEdited = false
                let callback = undefined
                if(this.responseData === undefined){
                    responsesPointer._actions.push({
                        action : 'put',
                        key : this.selectedCode,
                        value : this.getData()
                    })
                    return undefined
                }
                let codePointer = responsesPointer[this.selectedCode] = {}
                this.actionsQuery = codePointer._actions = this.getActions()
                codePointer._hasActions = true
                if(this.initCode !== this.selectedCode){
                    responsesPointer._actions.push({
                        action : 'rename',
                        key : this.initCode,
                        newKey : this.selectedCode
                    })
                    isEdited = true
                }

                if(this.hasHeaders){
                    let rd = this.responseData
                    if(rd === undefined || rd.headers === undefined){
                        codePointer._actions.push({
                            action : 'put',
                            key : 'headers',
                            value : this.$refs.headers.getData()
                        })
                        isEdited = true
                    }
                    else{
                        callback = this.$refs.headers.buildQuery(codePointer.headers = {})
                        if(callback === undefined){
                            delete codePointer.headers
                        }else{
                            isEdited = true
                            this.commitChangeCallback.push(callback)
                        }
                    }
                }

                if(this.hasBody){
                    callback = this.$refs.body.buildQuery(codePointer)
                    if(callback === undefined){
                        delete codePointer.schema
                    }
                    else{
                        isEdited = true
                        this.commitChangeCallback.push(callback)
                    }
                }

                if(codePointer._hasActions !== undefined && codePointer._actions.length === 0){
                    delete codePointer._actions
                    delete codePointer._hasActions
                }

                if(!isEdited){
                    delete responsesPointer[this.selectedCode]
                }

                return (isEdited)?this.commitChange : undefined
            },
            commitChange : function () {
                ActionExecutorUtil.executeActions(this.responseData, this.actionsQuery)
                this.commitChangeCallback.forEach(fn => fn())
            },
        },
        watch : {
            responseData : function () {
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
