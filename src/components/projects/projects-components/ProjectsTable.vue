<template>
    <!--https://bootstrap-vue.js.org/docs/components/table/#responsive-tables-->
    <div>
        <b-container fluid>
            <!--User Interface Controls-->
            <b-row no-gutters>
                <b-col md="5" class="my-1 mx-0">
                    <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
                        <b-input-group>
                            <b-form-input v-model="filter" placeholder="Type to search"></b-form-input>
                            <b-input-group-append>
                                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>

                <b-col md="3" class="my-1">
                    <b-form-group label-cols-sm="3" label="Per page" class="mb-0">
                        <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
                    </b-form-group>
                </b-col>

<!--                <b-col md="2" class="my-1"></b-col>-->

                <b-col md="2" class="my-1 ml-auto">
                    <b-button @click="loadProjects" variant="outline-info" class="float-right"><i class="fas fa-sync-alt"></i> Refresh</b-button>
                </b-col>
            </b-row>


        <b-table :items="projects"
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
    import {BASE_URL} from "../../../stores/actions/const";

    export default {
        name: "ProjectsTable",
        data: function () {
            return {
                projects: [],
                fields: [
                    {
                        key: 'info.title',
                        label: 'Api Title',
                        sortable: true
                    },
                    'host',
                    'basePath',
                    {
                        key: 'updatedAt',
                        formatter: value => {
                            var d = new Date(value);
                            return d.toLocaleString();
                        }
                    }
                    // {
                    //     key: 'id',
                    //     label: 'Actions'
                    // }
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
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            loadProjects(){
                this.isBusy = true
                axios.get(BASE_URL + 'projects/all/info').then((response) => {
                    console.log('data all info accepted!')
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
            }
        },
        created() {
            this.loadProjects();
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });

            // this.totalRows = this.projects.length;
        },
        computed: {
            totalRows(){
                return this.projects.length;
            }
        }
    }
</script>

<style scoped>

</style>