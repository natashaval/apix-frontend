<template>
    <div>
        <h1>method : {{operationApi}}</h1>
        <BodyForm v-if="apiData!=null" :apiData="apiData.body"/>
    </div>
</template>

<script>
    import BodyForm from "./editor-components/inputs/BodyForm";
    export default {
        name: "OperationEditor",
        components: {BodyForm},
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