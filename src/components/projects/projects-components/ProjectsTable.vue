<template>
    <!--https://bootstrap-vue.js.org/docs/components/table/#responsive-tables-->
    <div>
        <b-container fluid>
            <!--User Interface Controls-->
            <b-row>
                <b-col md="4" class="my-1">
                    <b-form-group label-cols-sm="3" label="Per page" class="mb-0">
                        <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
                    </b-form-group>
                </b-col>

                <b-col md="3" class="my-1 mr-auto">
                    <b-button @click="loadProjects" variant="outline-info" class="float-right">
                        <i class="fas fa-sync-alt"></i> Refresh</b-button>
                </b-col>

                <b-col md="5" class="my-1 justify-content-end">
                    <b-form-group label-cols-sm="2" label="Filter" class="mb-0">
                        <b-input-group>
                            <b-form-input v-model="filter" placeholder="Type to search"></b-form-input>
                            <b-input-group-append>
                                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>

            </b-row>


            <b-table :items="projectFilterByTeam"
                     :fields="fields"
                     :busy="isBusy"
                     :current-page="currentPage"
                     :per-page="perPage"
                     :filter="filter"
                     responsive head-variant="dark" hover small
                     @filtered="onFiltered"
                     class="mt-2"
            >

                <template slot="info.title" slot-scope="row">
                    <!--<small>{{row.item.id}}</small>-->
                    <!--<h3>{{row.item.info.title}}</h3>-->
                    <b-link :to="{name: 'project-editor', params: {projectId: row.item.id} }">{{row.item.info.title}}</b-link>
                </template>

                <template slot="githubProject" slot-scope="row">
                    <a :href="'http://github.com/' + row.item.githubProject.owner + '/' + row.item.githubProject.repo"
                       target="_blank"
                       v-if="row.item.githubProject.repo != ''"
                    >
                        {{row.item.githubProject.owner}}/{{row.item.githubProject.repo}}
                    </a>
                </template>

                <div slot="table-busy" class="text-center text-primary my-1">
                    <h5>
                        <b-spinner class="align-middle m-5" type="grow"
                                   label="Loading ..."></b-spinner>
                        <strong> Loading ... </strong>
                    </h5>
                </div>
            </b-table>

            <b-row>
                <b-col md="12" class="my-1">
                    <b-pagination
                            v-model="currentPage"
                            :total-rows="totalRows"
                            :per-page="perPage"
                            class="my-0"
                            align="center"
                    >
                    </b-pagination>
                </b-col>
                <!--Curr Page: {{currentPage}}-->
                <!--totalRows: {{totalRows}}-->
                <!--perPage: {{perPage}}-->
            </b-row>

        </b-container>
    </div>
</template>

<script>
    import * as axios from "axios";
    import {BASE_PROJECT_URL} from "@/stores/actions/const";

    export default {
        name: "ProjectsTable",
        props: {
            team: {
                type: String,
                required: false
            }
        },
        data: function () {
            return {
                projects: [],
                fields: [
                    {
                        key: 'info.title',
                        label: 'Api Title',
                        sortable: true
                    },
                    {
                        key: 'projectOwner.creator',
                        label: 'Project Owner'
                    },
                    'host',
                    {
                        key: 'githubProject',
                        label: 'Repository',
                    },
                    {
                        key: 'updatedAt',
                        formatter: value => {
                            let d = new Date(value);
                            return d.toLocaleString();
                        },
                        sortable: true
                    }
                ],
                isBusy: false,
                filter: null,
                perPage: 5,
                pageOptions: [5, 15, 30],
                currentPage: 1,
                // totalRows: 1
            }
        },
        methods: {
            loadProjects(){
                this.isBusy = true
                axios.get(BASE_PROJECT_URL +'/'+ 'all/info').then((response) => {
                    this.isBusy = false
                    this.projects = response.data
                });
            },
            toggleBusy(){
                this.isBusy = !this.isBusy;
            },
            onFiltered(filteredItems){
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
        },
        created() {
            this.loadProjects();
        },
        computed: {
            totalRows(){
                return this.projects.length;
            },
            projectFilterByTeam(){
                if (this.team == undefined) return this.projects
                else {
                    return this.projects.filter(u => {
                        return u.teams.includes(this.team)
                    })
                }
            }
        },
    }
</script>

<style scoped>

</style>
