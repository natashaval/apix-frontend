<template>
    <div>
        <h4 @click="enterProject"> {{project.info.title }}</h4>
        <h6> {{ project.host }} </h6>
        <button @click="deleteProject">Delete</button>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "ProjectsCard",
        props: ['project'],
        methods: {
            enterProject: function () {
                console.log(this.project.id);
                this.$router.push({
                    name :'project-editor',
                    params: {projectId : this.project.id}
                })
            },
            deleteProject: function () {
                if(confirm("Delete this project?")){
                    this.$store.dispatch('project/deleteProjectData', this.project.id);
                    console.log("project deleted!");
                }
                else {
                    console.log("cancel delete project");
                }
            }
        }
    }
</script>

<style scoped>

</style>