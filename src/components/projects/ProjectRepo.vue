<template>
    <div>
        <h2>All Layout Repos</h2>
        <router-link to="/projects/5c61963e2fd74228b44ebddd">Swagger PetStore</router-link>
        {{ projectsData }}
    </div>
</template>

<script>
    import ProjectsCard from "./projects-components/ProjectsCard";
    export default {
        name: "ProjectRepo",
        components: {ProjectsCard},
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