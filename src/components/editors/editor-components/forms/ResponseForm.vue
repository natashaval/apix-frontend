<template>
    <div>
        <div class="form-row w-100">
            <b-form-group v-if="isEditing" class="col-11"
                          :invalid-feedback="selectedCodeInvalidFeedback"
                          :state="selectedCodeState">
                <b-select v-model="selectedCode" :state="selectedCodeState" :options="statusOptions"/>
            </b-form-group>
            <div v-else class="col-11">
                <p>Status Code : {{selectedCode}}</p>
            </div>
            <div class="col-1 float-right">
                <div class="float-right">
                    <button v-if="editable" @click="isEditing = !isEditing" class="round-button btn mt-auto" style="margin-left:auto; margin-right:0;">
                        <i class="fa fa-pencil-alt"></i>
                    </button>
                </div>
            </div>
        </div>
        <div>
            <p class="font-weight-bold">Headers: </p>
            <PropertyForm ref="headers"
                          :editable="editable"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                          :schemas-data="headersData"/>
        </div>
        <div>
            <p class="font-weight-bold mr-3 mt-3">Body: </p>
            <p v-if="editable && !hasBody" @click="hasBody = true"
                    class="text-primary btn-text" style="font-size: 15px"><i class="fas fa-plus"></i> Add</p>
            <p v-if="editable && hasBody" @click="hasBody = false"
                    class="text-primary btn-text" style="font-size: 15px"><i class="fas fa-plus"></i> Delete</p>
            <BodyForm v-if="hasBody" :body-data="responseData" ref="body"
                      :editable="editable"
                      :$_changeObserverMixin_parent="$_changeObserverMixin_this"
            />
        </div>
    </div>
</template>

<script>
    import HttpStatusCode from "@/consts/HttpStatusCode"
    import BodyForm from "./BodyForm"
    import PropertyForm from "./PropertyForm"
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin"

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
            },
            editable : {
                type : Boolean,
                default : true
            }
        },
        data : () => ({
            isEditing : false,
            isCreateNew : false,
            selectedCode : '',
            initCode : '',
            commitChangeCallback : [],
            hasBody : false
        }),
        computed : {
            selectedCodeState : function () {
                return  this.$_changeObserverMixin_isValid('selectedCode')
            },
            selectedCodeInvalidFeedback : function(){
                return  this.$_changeObserverMixin_getErrors('selectedCode')[0]
            },
            headersData : function () {
                if(this.responseData === undefined){
                    return undefined
                }

               return (this.responseData.headers === undefined)?undefined:this.responseData.headers
            },
            statusOptions : function () {
                return HttpStatusCode.map(statusData => {
                    return {text : statusData.code+' - '+statusData.description,
                        value : statusData.code,
                        disabled: (statusData.disabled !== undefined) ? true : false }
                })
            }
        },
        methods : {
            //fungsi callback dari $watch.selectedCode -> jika ada response code yang sama maka error
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
            reloadData : function (){
                this.loadData()
                this.$refs.headers.reloadData()
                if(this.hasBody) this.$refs.body.reloadData()
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                if(this.responseData !== undefined){
                    this.isCreateNew = false
                    let rd = this.responseData
                    if(rd.schema !== undefined){
                        this.hasBody = true
                    }
                    this.description = rd.description
                }
                else{
                    this.isCreateNew = true
                    this.hasBody = false
                    this.description = ''
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
            getData : function () {
                let res = {}
                if(this.hasBody)res = this.$refs.body.getData()
                res.description = this.description
                res.headers = this.$refs.headers.getData()
                return res
            },
            buildQuery : function (responsesPointer) {
                if(this.isCreateNew){
                    responsesPointer._actions.push({
                        action : 'put',
                        key : this.selectedCode,
                        value : this.getData()
                    })
                    return undefined
                }
                else{
                    let isEdited = false
                    let callback = undefined
                    let codePointer = responsesPointer[this.selectedCode] = {}
                    codePointer._hasActions = true
                    codePointer._actions = []
                    if(this.initCode !== this.selectedCode){
                        responsesPointer._actions.push({
                            action : 'rename',
                            key : this.initCode,
                            newKey : this.selectedCode
                        })
                        isEdited = true
                    }

                    let rd = this.responseData
                    if(rd.headers === undefined){
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
                    else{
                        if(rd.schema){
                            responsesPointer._actions.push({
                                action: 'put',
                                key : 'description',
                                value : ''
                            })
                            codePointer._actions.push({
                                action: 'delete',
                                key: 'schema'
                            })
                            isEdited = true
                        }
                    }

                    if(codePointer._hasActions && codePointer._actions.length === 0){
                        delete codePointer._actions
                        delete codePointer._hasActions
                    }

                    if(!isEdited){
                        delete responsesPointer[this.selectedCode]
                    }


                    return (isEdited)?this.commitChange : undefined
                }
            },
            commitChange : function () {
                this.commitChangeCallback.forEach(fn => fn())
                this.commitChangeCallback.length = 0
            }
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
