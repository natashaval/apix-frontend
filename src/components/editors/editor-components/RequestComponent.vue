<template>
    <div v-if="bodyData !== undefined" class="green-frame container" >
        <div v-if="bodyData.headers !== undefined">
            <h1>ini headers</h1>
            <PropertyForm ref="headers" :schemaData="bodyData.headers"/>
        </div>
        <div>
            <h1>ini query param</h1>
            <PropertyForm ref="queryParams" :schemaData="bodyData.queryParams"/>
        </div>

        <BodyForm v-if="hasBody" ref="body" :bodyData="operationData.requestBody" style="padding-left: 10%"/>
    </div>
</template>

<script>
    import BodyForm from "./forms/BodyForm";
    import PropertyForm from "./forms/PropertyForm";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";

    export default {
        name: "RequestComponent",
        components: {PropertyForm, BodyForm},
        data : () => ({
            commitChangeCallback : [],
            actionsQuery : []
        }),
        props : [
            'operationData'
        ],
        computed : {
            operationApi : function () {
                return this.$route.params.operationApi
            },
            hasBody : function () {
                switch (this.operationApi) {
                    case "post":
                    case "put":
                    case "patch":
                        return true
                }
                return false
            },
            bodyData : function () {
                return this.operationData.requestBody
            }
        },
        methods : {
            getChangedData : function (operationPointer,requestBodyPointer) {
                let isEdited = false
                let request = requestBodyPointer
                let callback = this.$refs.headers.getChangedData(request.headers = {})
                if(callback !== undefined){
                    isEdited = true
                    this.commitChangeCallback.push(callback)
                }

                callback = this.$refs.queryParams.getChangedData(request.queryParams = {})
                if(callback !== undefined){
                    isEdited = true
                    this.commitChangeCallback.push(callback)
                }

                if(this.$refs.body !== undefined){
                    callback = this.$refs.body.getChangedData(operationPointer, request)
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
                ActionExecutorUtil.executeActions(this.operationData, this.actionsQuery)
                this.commitChangeCallback.forEach(fn => fn())
            }
        }
    }
</script>

<style scoped>
    .green-frame{
        border: 1px solid green;
    }
</style>