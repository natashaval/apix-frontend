<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                Current Page: {{pageable.page}}
                Current Size: {{pageable.size}}
                Current Direction: {{pageable.direction}}
                Current Sort: {{pageable.sort}}
                <hr />
                Total Page: {{totalPages}}
                Total Elements: {{totalElements}}
                {{responsePageable}}
            </div>
        </div>

        <div class="row my-2">
            <div class="col-md-4">
                <form class="form-inline">
                    <label class="mr-3">Per page</label>
                    <select class="custom-select form-control" v-model="pageable.size" @change="clickSize()">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                    </select>
                </form>
            </div>
            <div class="col-md-4"></div>
            <div class="col-md-4">
                <div class="input-group">
                    <input type="text" v-model="search" class="form-control" placeholder="Search ...">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button"> <i class="fa fa-search"></i> </button>
                    </div>
                </div>
            </div>
        </div>
        <table class="table table-hover table-sm">
            <thead class="thead-dark">
            <tr>
                <th>Api Title</th>
                <th>Project Owner</th>
                <th>Host</th>
                <th>Repository</th>
                <th>Updated At</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="project in projects" :key="project.id">
                <td>{{(project.info) ? project.info.title : ''}}</td>
                <td>{{ (project.projectOwner) ? project.projectOwner.name : '' }}</td>
                <td>{{ (project.host) ? project.host : '' }}</td>
                <td>
                    <a :href="'http://github.com/' + project.githubProject.owner + '/' + project.githubProject.repo"
                       target="_blank"
                       v-if="project.githubProject.repo != ''"
                    >
                        {{project.githubProject.owner}}/{{project.githubProject.repo}}
                    </a>
                </td>
                <td>{{ localDate(project.updatedAt) }}</td>
            </tr>
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
                        <!--<span v-for="idx in totalPages" :key="idx">-->
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
    import {BASE_PROJECT_URL} from "../../../stores/actions/const";

    export default {
        name: "ProjectsTablePagination",
        data: function() {
            return {
                pageable: {
                    page: 0,
                    size: 2,
                    direction: 'desc',
                    sort: 'updatedAt',
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
                search: ''
            }
        },
        methods: {
            fetchData: function() {
                if(this.pageable) {
                    axios.get(BASE_PROJECT_URL, {
                        params: this.pageable
                    }).then((response) => {
                        this.projects = response.data.content
                        this.totalPages = response.data.totalPages
                        this.totalElements = response.data.totalElements
                        this.responsePageable.offset = response.data.pageable.offset
                        this.responsePageable.pageSize = response.data.pageable.pageSize
                        this.responsePageable.pageNumber = response.data.pageable.pageNumber
                        this.responsePageable.numberOfElements = response.data.numberOfElements
                        this.responsePageable.last = response.data.last
                        this.responsePageable.first = response.data.first
                    }).catch((e) => {
                        console.error(e);
                    })
                }
            },
            localDate: (value) => {
                let d = new Date(value);
                return d.toLocaleString();
            },
            clickPagination: function(idx){
                console.log(idx, this.responsePageable.pageNumber)
                this.pageable.page = idx - 1
                this.fetchData();
                // console.log((idx == this.responsePageable.pageNumber)? 'sama' : 'beda')
            },
            clickSize: function() {
                console.log(this.pageable.size)
                this.fetchData()
            }
        },
        created() {
            this.fetchData();
        },
        // watch: {
        //     pageable: function(newData, oldData){
        //         console.log(newData, oldData);
        //     }
        // }
    }
</script>

<style scoped>

</style>