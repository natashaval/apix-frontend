<template>
    <div>
        <h1>method : {{operationApi}}</h1>
        <DataTypeInput/>
        <!--<BodyForm v-if="apiData.body!=null" :apiData="apiData.body"/>-->
    </div>
</template>

<script>
    // import BodyForm from "./editor-components/inputs/BodyForm";
    import DataTypeInput from "./editor-components/inputs/DataTypeInput";
    export default {
        name: "OperationEditor",
        components: {DataTypeInput},
        props : ['projectId','sectionApi','pathApi','operationApi'],
        computed : {
            apiData : function(){
                return this.$store.getters['project/getOperationData'](this.sectionApi,this.pathApi,this.operationApi)
            }
        }
    }
</script>

<style scoped>

</style>