<template>
    <div class="green-frame container" >
        <div>
            <h1>ini headers</h1>
            <PropertyForm ref="headers" :schemas-data="headersData"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>
        </div>
        <div>
            <h1>ini query param</h1>
            <PropertyForm ref="queryParams" :schemas-data="queryParamsData"
                          :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>
        </div>

        <BodyForm v-if="hasBody" ref="body" :body-data="requestData"
                  :$_changeObserverMixin_parent="$_changeObserverMixin_this" style="padding-left: 10%"/>
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
        data : () => ({
            commitChangeCallback : [],
            actionsQuery : [],
        }),
        props : {
            requestData : {
                type : Object
            },
            operationApi : {
                type : String,
                required : true
            },
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
                let callback = this.$refs.headers.buildQuery(request.headers = {})
                if(callback === undefined){
                    delete request.headers
                }
                else{
                    isEdited = true
                    this.commitChangeCallback.push(callback)
                }

                callback = this.$refs.queryParams.buildQuery(request.queryParams = {})
                if(callback === undefined){
                    delete request.queryParams
                }
                else{
                    isEdited = true
                    this.commitChangeCallback.push(callback)
                }

                if(this.$refs.body !== undefined){
                    callback = this.$refs.body.buildQuery(request)
                    if(callback !== undefined){
                        isEdited = true
                        this.commitChangeCallback.push(callback)
                    }


                }
                if(request._actions !== undefined){
                    this.actionsQuery = request._actions
                }
                return (isEdited)?this.commitChange : undefined
            },
            commitChange : function () {
                ActionExecutorUtil.executeActions(this.requestData, this.actionsQuery)
                this.commitChangeCallback.forEach(fn => fn())
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