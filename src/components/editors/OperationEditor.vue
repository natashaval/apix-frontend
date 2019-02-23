<template>
    <div>
        <h1>method : {{operationApi}}</h1>
        <RequestComponent v-if="operationData !== undefined"
                          :operationData="operationData"
                          :projectId="projectId"/>
    </div>
</template>

<script>
    import RequestComponent from "./editor-components/RequestComponent";
    export default {
        name: "OperationEditor",
        components: {RequestComponent},
        props : ['projectId','sectionApi','pathApi','operationApi'],
        computed : {
            operationData : function(){
                return this.$store.getters['project/getOperationData'](this.sectionApi,this.pathApi,this.operationApi)
            }
        }
    }
</script>

<style scoped>

</style>