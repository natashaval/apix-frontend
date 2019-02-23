<template>
    <!--nanti dilanjutkan-->
    <div>
        <!--query param-->
        <div v-if="bodyData.headers !== undefined">
            <h1>ini headers</h1>
            <DataTypeInput v-for="(value,name) in bodyData.headers" v-bind:key="name" :schemaData="value"/>
        </div>
        <div v-if="bodyData.queryParams !== undefined">
            <h1>ini query param</h1>
            <DataTypeInput v-for="(value,name) in bodyData.queryParams" v-bind:key="name" :schemaData="value"/>
        </div>
        <!--body-->
        <div v-if="bodyData.schema !== undefined">
            <h1>ini body</h1>
            <b-form-select v-model="selected" :options="options"/>
            <DataTypeInput :schemaData="bodyData.schema"
                           :projectId="projectId"/>
        </div>
    </div>
</template>

<script>
    import DataTypeInput from "./inputs/DataTypeInput";
    export default {
        name: "bodyForm",
        components: {DataTypeInput},
        props : ['bodyData','projectId'],
        data() {
            return {
                isEditMode : false,
                selected : 'application/json',
                options : [
                    {value : 'application/json', text : 'application/json'},
                    {value : 'inputs-data', text : 'multipart/inputs-data'}
                ]
            };
        }
    }
</script>

<style scoped>

</style>