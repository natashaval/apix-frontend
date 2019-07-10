<template>
    <div class="dot-border pl-2">
        <div class="mb-3">
            <h6 class="font-weight-bold">Headers:</h6>
            <PropertyForm ref="headers" :schemas-data="headersData"
                          :editable="editable"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>
        </div>
        <div class="mb-3">
            <h6 class="font-weight-bold">Query Parameters:</h6>
            <PropertyForm ref="queryParams" :schemas-data="queryParamsData"
                          :editable="editable"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>
        </div>
        <div class="mb-3 pr-1">
            <h6 class="font-weight-bold">Body:</h6>
            <BodyForm v-if="hasBody" ref="body" :body-data="requestData"
                      :editable="editable"
                      :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>
        </div>
    </div>
</template>

<script>
    import BodyForm from "./forms/BodyForm";
    import PropertyForm from "./forms/PropertyForm";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";

    export default {
        name: "RequestComponent",
        mixins : [ChangeObserverMixin],
        components: {PropertyForm, BodyForm},
        props : {
            requestData : {
                type : Object
            },
            operationApi : {
                type : String,
                required : true
            },
            editable : {
                type : Boolean,
                default : true
            }
        },
        computed : {
            hasBody : function () {
                switch (this.operationApi) {
                    case "post":
                    case "put":
                    case "patch":
                        return true
                }
                return false
            },
            headersData : function () {
                let od = this.requestData
                return (od === undefined)?undefined : od.headers
            },
            queryParamsData : function () {
                let od = this.requestData
                return (od === undefined)?undefined : od.queryParams
            },
        },
        methods : {
            buildQuery : function (operationPointer,requestPointer) {
                let isEdited = false
                let request = requestPointer
                let requestData = this.requestData
                let callbacks = []
                let callback = this.$refs.headers.buildQuery(request.headers = {})
                if(callback === undefined){
                    delete request.headers
                }
                else{
                    isEdited = true
                    callbacks.push(callback)
                }

                callback = this.$refs.queryParams.buildQuery(request.queryParams = {})
                if(callback === undefined){
                    delete request.queryParams
                }
                else{
                    isEdited = true
                    callbacks.push(callback)
                }

                if(this.$refs.body !== undefined){
                    callback = this.$refs.body.buildQuery(request)
                    if(callback !== undefined){
                        isEdited = true
                        callbacks.push(callback)
                    }


                }
                if(request._actions !== undefined){
                    callbacks.push(()=>{
                        ActionExecutorUtil.executeActions(requestData, request._actions)
                    })
                }
                return (isEdited)?()=>{callbacks.forEach(fn => fn())} : undefined
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.$_changeObserverMixin_initObserver()
            },
            reloadData : function () {
                this.loadData()
                this.$refs.headers.reloadData()
                this.$refs.queryParams.reloadData()
                if(this.hasBody) this.$refs.body.reloadData()
            },
            getData : function () {
                let res = {}
                if(this.hasBody){
                    res = this.$refs.body.getData()
                }
                res.headers = this.$refs.headers.getData()
                res.queryParams = this.$refs.queryParams.getData()
                return res
            }
        },
        watch : {
            requestData : function () {
                this.loadData()
            }
        },
        mounted() {
            this.loadData()
        }
    }
</script>

<style scoped>
    .green-frame{
        border: 1px solid green;
    }
</style>
