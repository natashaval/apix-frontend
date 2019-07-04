<template>
    <div>
        <label class="font-weight-bold">Response :</label>
        <b-card no-body>
            <b-tabs vertical card pills nav-wrapper-class="w-15">
                <b-tab v-for="(response, i) in responseList" :key="i.id" @click="setActiveView(i)">
                    <div slot="title">
                        <span ref="codeTabs">
                            {{response.code}}
                        </span>
                        <button class="btn-circle" v-if="editable" @click="deleteChild(i)" size="sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>

                    <ResponseForm v-bind:style="{display: (i === activeIndex)?'block':'none'}"
                                  ref="responseForm"
                                  :editable="editable"
                                  :component-idx="i"
                                  :is-duplicate-code="isDuplicateCode"
                                  :notify-change-status-code="notifyChangeStatusCode"
                                  :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                  :response-data="response.data" :response-code="response.code" class="w-100"/>

                </b-tab>

                <template slot="tabs">
                    <b-nav-item v-if="editable" @click.prevent="addResponse">
                        <small><i class="fas fa-plus"></i> Add</small>
                    </b-nav-item>
                </template>
                <div slot="empty" class="text-center text-muted">
                    There are no response http code available <br />
                </div>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
    import HttpStatusCode from "@/consts/HttpStatusCode";
    import ResponseForm from "./forms/ResponseForm";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";

    export default {
        name: "ResponseComponent",
        components: {ResponseForm},
        mixins : [ChangeObserverMixin],
        props : {
            responsesData : {
                type : Object
            },
            editable : {
                type : Boolean,
                default : true
            }
        },
        data : () => ({
            activeIndex : 0,
            componentId : 0,
            responseList : [],
            optionList : HttpStatusCode,
            actionsQuery : [],
            commitChangeCallback : [],
            codeTabsRef: null
        }),
        computed : {
            operationApi : function () {
                return this.$route.params.operationApi
            }
        },
        methods : {
            getData : function () {
                let res = {}
                let len = this.responseList.length
                for(let i = 0; i < len; i++){
                    res[this.responseList[i].code]  = this.$refs.responseForm[i].getData()
                }
                return res
            },
            setActiveView : function (i) {
                this.activeIndex = i
            },
            addResponse : function () {
                this.responseList.push({code : "200"})
                this.activeIndex = this.responseList.length-1
                setTimeout(()=>{
                    this.$refs.codeTabs[this.activeIndex].click()
                },10)
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
            reloadData : function(){
                this.loadData()
                this.$refs.responseForm.forEach(form => form.reloadData())
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
            buildQuery : function (responsesPointer) {
                this.commitChangeCallback = []

                let isEdited = false

                let rl = this.responseList
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
            },
            isDuplicateCode : function (i) {
                let count = 0
                this.responseList.forEach(response => {
                    if(response.code === this.responseList[i].code)count++
                })
                return count !== 1
            }
        },
        watch : {
            responsesData : function (after, before) {
                this.loadData()
            }
        },
        mounted() {
            this.loadData()
        }

    }
</script>

<style scoped>
    @import "../../../assets/css/app.css";
</style>
