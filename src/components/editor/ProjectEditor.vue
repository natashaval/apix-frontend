<template>
    <div>
        <h1>project id : {{projectId}}</h1>
        <div v-if="apiData.info != undefined">
            <h1>Project editor: {{apiData.info.title}} </h1>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ProjectEditor",
        computed : {
            apiData : function () {
                return this.$store.getters['project/getProject']
            }
        },
        props : ['projectId'],
        created(){
        }
    }
</script>

<style scoped>

</style>