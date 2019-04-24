<template>
    <div>
        <b-card text-variant="primary"
               :title="project.info.title" :sub-title="project.host">
            <b-button-group>
                <b-button @click="enterProject" variant="outline-primary">Enter</b-button>
                <b-button @click="deleteProject" variant="outline-danger">Delete</b-button>
            </b-button-group>
        </b-card>
    </div>
</template>

<script>

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