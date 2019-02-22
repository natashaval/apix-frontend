<template>
    <div>
        <h4 @click="projectClick"> {{project.info.title }}</h4>
        <h6> {{ project.host }} </h6>
    </div>
</template>

<script>
    export default {
        name: "ProjectsCard",
        props: ['project'],
        methods: {
            projectClick: function () {
                this.$router.push({
                    name :'project-editor',
                    params: {projectId : this.project.id}
                })
            }
        }
    }
</script>

<style scoped>

</style>