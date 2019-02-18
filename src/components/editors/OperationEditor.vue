<template>
    <div v-if="apiData !== undefined">
        <h1>method : {{operationApi}}</h1>
        <DataTypeInput :apiData="apiData"/>
    </div>
</template>

<script>
    import DataTypeInput from "./editor-components/inputs/DataTypeInput";

    export default {
        name: "OperationEditor",
        components: {DataTypeInput},
        props : ['projectId','sectionApi','pathApi','operationApi'],
        computed : {
            apiData : function(){
                return this.$store.getters['project/getPathData'](this.sectionApi,this.pathApi,this.operationApi)
            }
        }
    }
</script>

<style scoped>

</style>