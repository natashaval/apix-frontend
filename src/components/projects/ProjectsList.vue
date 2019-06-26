<template>
    <div>
        <h3>Project Table List</h3>
        <ProjectModal></ProjectModal>
        <b-button variant="secondary" :to="{name: 'project-import'}">Import Projects</b-button>

        <ProjectsTable></ProjectsTable>
    </div>
</template>

<script>
    import ProjectModal from "./projects-components/ProjectModal";
    import ProjectsTable from "./projects-components/ProjectsTable";
    export default {
        name: "ProjectsList",
        components: {ProjectsTable, ProjectModal}
    }
</script>

<style scoped>

</style>