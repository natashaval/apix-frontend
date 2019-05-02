<template>
    <div>
        <h2>All Layout Repos</h2>
        <ProjectModal></ProjectModal>
        <ProjectsUpload></ProjectsUpload>

        <div v-for="project in projectsData" v-bind:key="project.id">
            <ProjectsCard :project="project" />
        </div>
    </div>
</template>

<script>
    import ProjectsCard from "./projects-components/ProjectsCard";
    import ProjectModal from "./projects-components/ProjectModal";
    import ProjectsUpload from "./projects-components/ProjectsUpload";
    export default {
        name: "ProjectRepo",
        components: {ProjectsUpload, ProjectModal, ProjectsCard},
        methods: {
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            }
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
        },
        created: function () {
          this.$store.dispatch('project/fetchAllProjectsData')
        },
        computed: {
            projectsData : function () {
                return this.$store.getters['project/getProjectList']
            },
        }
    }
</script>

<style scoped>

</style>