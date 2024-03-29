<template>
    <div class="dot-border">
        <label class="font-weight-bold">Response :</label>
            <b-tabs vertical card pills nav-wrapper-class="w-15">
                <b-tab v-for="(response, i) in responseList" :key="i.id" @click="setActiveView(i)" class="pr-0">
                    <div slot="title">
                        <span ref="codeTabs">
                            <slot v-if="isDuplicateCode(i)">
                                <span class="text-danger">{{response.code}}</span>
                            </slot>
                            <slot v-else>
                                <span>{{response.code}}</span>
                            </slot>
                        </span>
                        <button class="btn-circle ml-2" v-if="editable" @click="deleteChild(i)" size="sm">
                            <i class="fas fa-trash"></i>
                        </button>
                        <slot v-if="isDuplicateCode(i)">
                            <br>
                            <div class="text-danger w-100" style="font-size: 13px;">must be unique!</div>
                        </slot>
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
            codeTabsRef: null,
            deletedChilds : []
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
                if(childIndex === this.activeIndex){
                    this.setActiveView(this.responseList.length-2)
                    if(this.activeIndex >= 0){
                        setTimeout(()=>{
                            this.$refs.codeTabs[this.activeIndex].click()
                        },10)
                    }
                }
                if(this.responseList[childIndex].data !== undefined){
                    this.deletedChilds.push(this.responseList[childIndex].code)
                }
                this.responseList.splice(childIndex,1)
            },
            reloadData : function(){
                this.loadData()
                if(this.$refs.responseForm){
                    this.$refs.responseForm.forEach(form => form.reloadData())
                }
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.activeIndex = 0
                this.responseList = []
                this.deletedChilds = []
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
                let callbacks = []
                let isEdited = false

                let rl = this.responseList
                responsesPointer._actions = []
                this.deletedChilds.forEach(code => responsesPointer._actions.push({
                    action : 'delete',
                    key : code
                }))
                for(let i in rl){
                    let callback = this.$refs.responseForm[i].buildQuery(responsesPointer)
                    if(callback !== undefined){
                        isEdited = true
                        callbacks.push(callback)
                    }
                }

                if(responsesPointer._actions.length > 0){
                    isEdited = true
                    let responsesData = this.responsesData
                    callbacks.push(()=>{
                        ActionExecutorUtil.executeActions(responsesData, responsesPointer._actions)
                    })
                }

                return (isEdited)?()=>{callbacks.forEach(fn => fn())} : undefined
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
