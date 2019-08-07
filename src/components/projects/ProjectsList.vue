<template>
    <div>
        <b-container fluid>
            <h3>Project Table List</h3>
            <b-row class="my-3" no-gutters>
                <b-col class="mx-0">
                    <b-button v-b-modal="'project-modal'" variant="primary" class="mr-2">New Project</b-button>
                    <b-button v-b-modal="'project-import'" variant="secondary">Import Projects</b-button>
                    <b-modal id="project-import"
                             hide-footer
                             title="Files Upload"
                             size="lg">
                        <ProjectImport @onImportComplete="onImportComplete"></ProjectImport>
                    </b-modal>
                    <b-modal id="project-modal" ref="modal" size="lg"
                             title="Create New Project"
                             hide-footer
                             header-bg-variant="info">

                        <ProjectCreate></ProjectCreate>
                    </b-modal>
                </b-col>
            </b-row>

            <b-row>
                <b-col md="12">
                    <ProjectsTablePagination ref="projectTable"></ProjectsTablePagination>
                </b-col>
            </b-row>

        </b-container>
    </div>
</template>

<script>
    import ProjectCreate from "./projects-components/ProjectCreate";
    import ProjectImport from "./projects-components/ProjectImport";
    import ProjectsTablePagination from "./projects-components/ProjectsTablePagination";
    import {makeToast} from "@/assets/toast";

    export default {
        name: "ProjectsList",
        components: {ProjectsTablePagination, ProjectCreate, ProjectImport},
        methods : {
            makeToast,
            onImportComplete : function () {
                // this.$bvModal.hide('project-import')
                // this.makeToast('success', true, 'import success')
                this.$refs.projectTable.fetchData()
            }
        }
    }
</script>

<style scoped>

</style>
