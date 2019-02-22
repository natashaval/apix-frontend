<template>
    <!--nanti dilanjutkan-->
    <div>
        <!--<b-form-select v-model="selected" :options="options"/>-->
        <DataTypeInput :schemaData="bodyData.schema"/>
    </div>
</template>

<script>
    import DataTypeInput from "./inputs/DataTypeInput";
    export default {
        name: "bodyForm",
        components: {DataTypeInput},
        props : ['bodyData'],
        data() {
            return {
                isEditMode : false,
                selected : null,
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