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

    export default {
        name: "RequestComponent",
        components: {PropertyForm, BodyForm},
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
                let request = requestBodyPointer
                this.$refs.headers.getChangedData(request.headers = {})
                this.$refs.queryParams.getChangedData(request.queryParams = {})
                if(this.$refs.body !== undefined){
                    this.$refs.body.getChangedData(operationPointer,request.schema = {})
                }
            }
        }
    }
</script>

<style scoped>
    .green-frame{
        border: 1px solid green;
    }
</style>