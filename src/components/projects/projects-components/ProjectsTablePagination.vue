<template>
    <div>
        <div class="row my-2">
            <div class="col-md-4">
                <form class="form-inline">
                    <label class="mr-3">Per page</label>
                    <select class="custom-select form-control" v-model="pageable.size" @change="clickSize()">
                        <option value="5">5</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                    </select>
                </form>
            </div>
            <div class="col-md-2"></div>
            <div class="col-md-6">
                <div class="input-group">
                    <input type="text" v-model="pageable.search" class="form-control" placeholder="Search ..." @change="clickSearch()">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" @click="clickReset()" > <i class="fa fa-times"></i> Reset</button>
                        <button class="btn btn-primary" type="button" @click="clickSearch()"> <i class="fa fa-search"></i> Search</button>
                    </div>
                </div>
            </div>
        </div>
        <table class="table table-hover table-sm">
            <thead class="thead-dark">
            <tr>
                <th @click="setOrderBy('title')">Api Title <span v-html="getSortIcon('title')"></span></th>
                <th @click="setOrderBy('owner')">Project Owner <span v-html="getSortIcon('owner')"></span></th>
                <th @click="setOrderBy('host')">Host <span v-html="getSortIcon('host')"></span></th>
                <th @click="setOrderBy('repository')">Repository <span v-html="getSortIcon('repository')"></span></th>
                <th @click="setOrderBy('updated_at')">Updated At <span v-html="getSortIcon('updated_at')"></span></th>
            </tr>
            </thead>
            <tbody v-if="!isLoading">
            <tr v-for="project in projects" :key="project.id">
                <td>
                    <router-link :to="{name: 'project-editor', params: {projectId: project.id} }">
                        {{project.title}}
                    </router-link>
                </td>
                <td>{{ (project.owner) ? project.owner : '' }}</td>
                <td>{{ (project.host) ? project.host : '' }}</td>
                <td>
                    <a :href="'http://github.com/' + project.githubUsername + '/' + project.repository"
                       target="_blank"
                       v-if="project.repository != ''"
                    >
                        {{project.githubUsername}}/{{project.repository}}
                    </a>
                </td>
                <td>{{ localDate(project.updatedAt) }}</td>
            </tr>
            </tbody>
            <tbody v-else>
                <td class="jumbotron jumbotron-fluid" colspan="5">
                    <div class="container-fluid">
                        <h4 class="text-center">
                            <b-spinner class="align-middle mr-3 my-5" type="grow"
                                       label="Loading ..."></b-spinner>
                            Loading Projects ...</h4>
                    </div>
                </td>
            </tbody>
            <!--https://www.thetechieshouse.com/vue-js-pagination-example-with-bootstrap-server-side-pagination/-->
        </table>

        <div class="row">
            <div class="col-md-4">
                <p class="text-secondary">Showing {{responsePageable.offset + 1}} to {{responsePageable.offset + responsePageable.numberOfElements}} of {{totalElements}} entries
                </p>
            </div>
            <div class="col-md-8">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-end">
                        <li class="page-item" :class="(responsePageable.first) ? 'disabled' : ''">
                            <a class="page-link" href="#" :tabindex="(responsePageable.first) ? '-1' : ''" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span class="sr-only">Previous</span>
                            </a>
                        </li>
                        <li class="page-item" v-for="idx in totalPages" :key="idx"
                            :class="(idx === (responsePageable.pageNumber + 1)) ? 'active' : ''">
                            <a href="#"
                               class="page-link"
                               @click="clickPagination(idx)">
                                {{idx}}
                            </a>
                        </li>
                        <!--</span>-->
                        <li class="page-item" :class="(responsePageable.last) ? 'disabled' : ''">
                            <a class="page-link" href="#" :tabindex="(responsePageable.last) ? '-1' : ''" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span class="sr-only">Next</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import {BASE_PROJECT_URL} from "@/stores/actions/const";

    export default {
        name: "ProjectsTablePagination",
        props: {
          team: {
              type: String,
              required: false
          }
        },
        data: function() {
            return {
                pageable: {
                    page: 0,
                    size: 5,
                    direction: 'desc',
                    sort: 'updated_at',
                    search : ''
                },
                responsePageable: {
                    offset: 0,
                    pageSize: 0,
                    pageNumber: 0,
                    first: false,
                    last: false,
                    numberOfElements: 0
                },
                totalPages: 0,
                totalElements: 0,
                projects: [],
                search: '',
                isLoading: false
            }
        },
        methods: {
            getSortIcon : function(field) {
                if(this.pageable.sort === field){
                   return (this.pageable.direction === 'desc')? '<i class="fas fa-sort-down"></i>':'<i class="fas fa-sort-up"></i>'
                }
                return ''
            },
            setOrderBy : function(orderBy) {
                let isDesc = this.pageable.direction === 'desc'
                if(this.pageable.sort === orderBy){
                    isDesc = !isDesc
                }
                if(isDesc){
                    this.pageable.direction = 'desc'
                }
                else{
                    this.pageable.direction = 'asc'
                }
                this.pageable.sort = orderBy
                this.fetchData()
            },
            fetchData: function() {
                let url
                if (this.team != null) {
                    url = BASE_PROJECT_URL + '/team/' + this.team
                }
                else url = BASE_PROJECT_URL
                if(this.pageable) {
                    this.isLoading = true
                    axios.get(url, {
                        params: this.pageable
                    }).then((response) => {
                        this.projects = response.data.contents
                        this.totalPages = response.data.totalPages
                        this.totalElements = response.data.totalElements
                        this.responsePageable.offset = response.data.offset
                        this.responsePageable.pageSize = response.data.pageSize
                        this.responsePageable.pageNumber = response.data.pageNumber
                        this.responsePageable.numberOfElements = response.data.numberOfElements
                        this.responsePageable.last = response.data.last
                        this.responsePageable.first = response.data.first
                        this.isLoading = false
                    }).catch((e) => {
                        console.error(e);
                        this.isLoading = false
                    })
                }
            },
            localDate: (value) => {
                let d = new Date(value);
                return d.toLocaleString();
            },
            clickPagination: function(idx){
                console.log('click pagination', idx, this.responsePageable.pageNumber)
                this.pageable.page = idx - 1
                this.fetchData()
            },
            clickSize: function() {
                console.log(this.pageable.size)
                this.pageable.page = 0
                this.fetchData()
            },
            clickSearch: function(){
                console.log(this.search)
                this.pageable.page = 0
                this.fetchData()
            },
            clickReset: function () {
                this.pageable.search = ''
                this.pageable.page = 0
                this.pageable.size = 5
                this.fetchData()
            }
        },
        created() {
            this.fetchData();
        }
    }
</script>

<style scoped>

</style>
