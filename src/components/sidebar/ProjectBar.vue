<template>
    <div v-if="apiData.info !== undefined">
        <h1 @click="projectClick">{{apiData.info.title}}</h1>
    </div>
</template>

<script>
    export default {
        name: "ProjectBar",
        computed : {

        },
        props : ['apiData'],
        methods : {
            projectClick : function(){
                this.$router.push({
                    name :'project-editor',
                    params: {projectId : this.apiData.id}
                })
            }
        }
    }
</script>

<style scoped>

</style>