<template>
    <div>
        <h2>All Layout Repos</h2>
        <ProjectModal></ProjectModal>

        <b-button variant="secondary" :to="{name: 'project-import'}">Import Projects</b-button>

        <b-card-group deck>
            <div v-for="project in projectsData" v-bind:key="project.id">
                <ProjectsCard :project="project" />
            </div>
        </b-card-group>
    </div>
</template>

<script>
    import ProjectsCard from "./projects-components/ProjectsCard";
    import ProjectModal from "./projects-components/ProjectModal";
    import ProjectsUpload from "./ProjectsUpload";
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