<template>
    <div>
        <h2>Responses :</h2>
        <div class="row">
            <div class="col-2">
                <ul>
                    <li v-for="(response,i) in responseList" v-bind:key="i" class="row">
                        <button @click="setActiveView(i)">{{response.code}}</button>
                        <b-button @click="deleteChild(i)">
                            <i class="fa fa-trash"></i>
                        </b-button>
                    </li>
                    <button @click="addResponse">Add</button>
                </ul>
            </div>
            <div class="col-10 red-frame">
                <div class="row" v-for="(response,i) in responseList" v-bind:key="response.id">
                    <ResponseForm v-bind:style="{display: (i === activeIndex)?'block':'none'}"
                                  ref="responseForm"
                                  :component-idx="i"
                                  :notify-change-status-code="notifyChangeStatusCode"
                                  :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                                  :response-data="response.data" :response-code="response.code" class="w-100"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import HttpStatusCode from "@/consts/HttpStatusCode";
    import ResponseForm from "./forms/ResponseForm";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import ActionExecutorUtil from "../../../utils/ActionExecutorUtil";

    export default {
        name: "ResponseComponent",
        components: {ResponseForm},
        mixins : [ChangeObserverMixin],
        props : {
            responsesData : {
                type : Object
            }
        },
        data : () => ({
            activeIndex : 0,
            componentId : 0,
            responseList : [],
            optionList : HttpStatusCode,
            actionsQuery : [],
            commitChangeCallback : [],
        }),
        computed : {
            operationApi : function () {
                return this.$route.params.operationApi
            },
        },
        methods : {
            setActiveView : function (i) {
                this.activeIndex = i
            },
            addResponse : function () {
                // this.responseList
                this.responseList.push({code : "200"})
                this.activeIndex = this.responseList.length-1

            },
            notifyChangeStatusCode : function (childIndex, newStatusCode) {
                this.responseList[childIndex].code = newStatusCode
            },
            deleteChild : function (childIndex) {
                if(this.responseList[childIndex].data !== undefined){
                    this.actionsQuery.push({
                        action : 'delete',
                        key : this.responseList[childIndex].code
                    })
                }
                this.responseList.splice(childIndex,1)
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.activeIndex = 0
                this.responseList = []
                this.actionsQuery = []
                for(let respCode in this.responsesData){
                    this.responseList.push({
                        code: respCode,
                        data : this.responsesData[respCode],
                        id : this.componentId++,
                        initCode : respCode,//tidak diubah-ubah, untuk pengecekan apakah terjadi perubahan status code
                    })
                }
                this.$_changeObserverMixin_initObserver(['responseList.length'])
            },
            reloadData : function () {
                this.loadData()
                let responseForms = this.$refs.responseForm
                for(let i in this.responseList){
                    if(responseForms[i] !== undefined) responseForms[i].reloadData()
                }
            },
            buildQuery : function (responsesPointer) {
                this.commitChangeCallback = []

                let isEdited = false

                let isUnique  = (code) => {
                    let count = 0
                    this.responseList.forEach(response => {
                        if(response.code === code)count++
                    })
                    return count === 1
                }

                let rl = this.responseList
                //validasi
                for(let i in rl){
                    if(!isUnique(rl[i].code)){
                        'error'
                        throw 'status code is not unique!'
                    }
                }

                responsesPointer._actions = this.actionsQuery
                responsesPointer._hasActions = true
                for(let i in rl){
                    let callback = this.$refs.responseForm[i].buildQuery(responsesPointer)
                    if(callback !== undefined){
                        isEdited = true
                        this.commitChangeCallback.push(callback)
                    }
                }

                if(responsesPointer._actions.length > 0){
                    isEdited = true
                    this.actionsQuery = responsesPointer._actions
                }

                return (isEdited)?this.commitChange : undefined

            },
            commitChange : function () {
                ActionExecutorUtil.executeActions(this.responsesData, this.actionsQuery)
                this.commitChangeCallback.forEach(fn => fn())
            }
        },
        mounted() {
            this.loadData()
        }

    }
</script>

<style scoped>

</style>