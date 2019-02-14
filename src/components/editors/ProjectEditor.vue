<template>
    <div>
        <h1>project id : {{projectId}}</h1>
        <div v-if="apiData.info !== undefined">
            <h1>Project editor: {{apiData.info.title}} </h1>
            <DescriptionComponent :apiData="apiData"></DescriptionComponent>

        </div>
    </div>
</template>

<script>
    import DescriptionComponent from "./editor-components/DescriptionComponent";

    export default {
        name: "ProjectEditor",
        components: {DescriptionComponent},
        computed : {
            apiData : function () {
                return this.$store.getters['project/getProjectData']
            }
        },
        props : ['projectId'],
        created(){
        }
    }
</script>

<style scoped>

</style>