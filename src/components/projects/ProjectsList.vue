<template>
    <div>
        <b-container fluid>
            <h3>Project Table List</h3>
            <b-row class="my-3" no-gutters>
                <b-col md="2" class="mx-0">
                    <ProjectModal></ProjectModal>
                </b-col>
                <b-col md="2" class="mx-0">
                    <b-button variant="secondary" :to="{name: 'project-import'}" class="float-left">Import Projects</b-button>
                </b-col>
                <b-col md="8"></b-col>
            </b-row>

            <b-row>
                <b-col md="12">
                    <ProjectsTable></ProjectsTable>
                </b-col>
            </b-row>

        </b-container>
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