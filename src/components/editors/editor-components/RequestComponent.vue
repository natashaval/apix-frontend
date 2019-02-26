<template>
    <div v-if="bodyData !== undefined" class="green-frame container" >
        <!--query param-->
        <div v-if="bodyData.headers !== undefined">
            <h1>ini headers</h1>
            <DataTypeInput v-for="(value,name) in bodyData.headers" v-bind:key="name" :schemaData="value"/>
        </div>
        <div v-if="bodyData.queryParams !== undefined">
            <h1>ini query param</h1>
            <DataTypeInput v-for="(value,name) in bodyData.queryParams" v-bind:key="name" :schemaData="value"/>
        </div>

        <BodyForm :bodyData="operationData.requestBody"
                  :projectId="projectId" style="padding-left: 10%"/>
    </div>
</template>

<script>
    import BodyForm from "./forms/BodyForm";
    export default {
        name: "RequestComponent",
        components: {BodyForm},
        props : ['operationData','projectId'],
        computed : {
            bodyData : function () {
                return this.operationData.requestBody
            }
        }
    }
</script>

<style scoped>
    .green-frame{
        border: 1px solid green;
    }
</style>