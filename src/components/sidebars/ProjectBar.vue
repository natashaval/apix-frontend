<template>
    <div v-if="apiData.info !== undefined" class="my-1">
        <h4 @click="projectClick" class="text-center">{{apiData.info.title}}</h4>
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