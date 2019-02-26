<template>
    <!--nanti dilanjutkan-->
    <div style="background: rgba(229, 228, 231, 0.39);">
        <!--body-->
        <div v-if="bodyData.schema !== undefined">
            <h1>ini body</h1>
            <b-form-select v-model="selected" :options="options"/>
            <div class="row">
                <div style="margin-left: 15px">
                    <label>Description:</label>
                </div>
                <div class="col">
                    <vue-editor style="height: 100px;" v-model="description"></vue-editor>
                </div>
            </div>
            <DataTypeInput :schemaData="bodyData.schema"
                           :projectId="projectId"
                            style="margin-top: 130px"/>
        </div>
    </div>
</template>

<script>
    import DataTypeInput from "../inputs/DataTypeInput";
    import { VueEditor } from 'vue2-editor'

    export default {
        name: "bodyForm",
        components: {DataTypeInput,VueEditor},
        props : ['bodyData','projectId'],
        data() {
            return {
                description : '',
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