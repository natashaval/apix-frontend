<template>
    <div>
        <b-container fluid>
            <h3>Project Table List</h3>
            <b-row class="my-3" no-gutters>
                <b-col class="mx-0">
                    <ProjectModal></ProjectModal>
                </b-col>
            </b-row>

            <b-row>
                <b-col md="12">
                    <!--<ProjectsTable></ProjectsTable>-->
                    <ProjectsTablePagination></ProjectsTablePagination>
                </b-col>
            </b-row>

        </b-container>
    </div>
</template>

<script>
    import ProjectModal from "./projects-components/ProjectModal";
    import ProjectsTable from "./projects-components/ProjectsTable";
    import ProjectsTablePagination from "./projects-components/ProjectsTablePagination";
    export default {
        name: "ProjectsList",
        components: {ProjectsTablePagination, ProjectsTable, ProjectModal}
    }
</script>

<style scoped>

</style>