<template>
    <div>
        <b-button v-b-toggle="'collapse-json'" class="m-1" size="sm" variant="outline-info">View Diff</b-button>
        <!--{{projectId}}-->
        <small>Click on each header to view project content</small>
        <b-collapse id="collapse-json">
        <div class="row">
            <div class="col-md-6" v-if="contentProject">
                <h4 @click="exportOas" class="clickable text-info">Project OAS
                    <b-spinner small variant="primary" v-show="exportStatus"></b-spinner>
                </h4>
                <vue-json-pretty
                        :data="contentProject"

                >
                </vue-json-pretty>
            </div>
            <div class="col-md-6" v-if="contentGithub && contentProject">
                <h4 @click="fetchOas" class="clickable text-danger">Project OAS in Github
                    <b-spinner small variant="danger" v-show="oasLoading"></b-spinner>
                </h4>
                <!--<p>{{owner}}</p>-->
                <!--<p>{{repo}}</p>-->
                <!--<p>{{branch}}</p>-->
                <!--<p>{{path}}</p>-->
                <vue-json-compare :oldData="contentProject" :newData="contentGithub"></vue-json-compare>
            </div>
        </div>
        </b-collapse>

    </div>
</template>

<script>
    import vueJsonCompare from 'vue-json-compare'
    import VueJsonPretty from 'vue-json-pretty'
    import axios from 'axios'
    import {BASE_PROJECT_URL, BASE_URL} from "../../../stores/actions/const";
    import {makeToast} from "../../../assets/toast";

    export default {
        name: "JsonCompareComponent",
        components: {
            vueJsonCompare,
            VueJsonPretty
        },
        props: {
            projectId: String,
            owner: String,
            repo: String,
            branch: String,
            path: String
        },
        data: () => {
            return {
                oldData: {
                    a: 1,
                    e: 0
                },
                newData: {
                    a: 2,
                    b: 3
                },
                contentGithub: {},
                fileExportLocation: '',
                exportStatus: false,
                contentProject: {},
                oasLoading: false
            }
        },
        methods: {
            makeToast,
            exportOas: function () {
                let self = this
                self.exportStatus = true
                axios.post(BASE_PROJECT_URL +'/'+ self.projectId + '/export?type=oas-swagger2&format=JSON')
                    .then((response) => {
                        self.makeToast('success', response.data.success, response.data.message)
                        self.fileExportLocation = response.data.file_url
                        // self.exportStatus = false

                        this.viewOas()

                    }).catch((e) => {
                    self.makeToast('danger', e.response.data.success, e.response.data.message)
                    self.exportStatus = false
                })
            },
            viewOas: function () {
                if(this.fileExportLocation !== ''){
                    axios.get(BASE_URL +this.fileExportLocation).then((response) => {
                        this.contentProject = response.data
                        this.exportStatus = false
                    })
                }
            },
            fetchOas: function() {
                // if (this.githubData !== undefined) {
                if (this.repo !== ''){
                    console.log('fetch oas')
                    this.oasLoading = true;
                    axios.get(BASE_URL + '/github/api/repos/' + this.owner + '/' + this.repo + '/contents/' + this.path,
                        {
                            params: {
                                ref: this.branch
                            }
                        }
                    )
                        .then((response) => {
                            this.oasLoading = false;
                            // this.initialOas = response.data
                            this.contentGithub = JSON.parse(response.data.content)
                        })
                        .catch((e) => {
                            console.error(e)
                        })
                }
                else {
                    console.log("this fetchoas githubapi still empty")
                }
            },

        },
        created() {
        }
    }
</script>

<style scoped>
.clickable {
    cursor: pointer;
}
</style>