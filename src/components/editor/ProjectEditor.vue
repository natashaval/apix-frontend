<template>
    <div>
        <h1>project id : {{projectId}}</h1>
        <div v-if="apiData.info !== undefined">
            <h1>Project editor: {{apiData.info.title}} </h1>
            <DescriptionForm/>
        </div>
    </div>
</template>

<script>
    import DescriptionForm from "./form/DescriptionForm";
    export default {
        name: "ProjectEditor",
        components: {DescriptionForm},
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