<template>
    <div>
        <b-button v-b-toggle="'collapse-json'" class="m-1" size="sm" variant="outline-info">View Diff</b-button>
        {{projectId}}
        <b-collapse id="collapse-json">
        <div class="row">
            <div class="col-md-6" v-if="contentProject">
                <h4>Project OAS</h4>
                <vue-json-pretty
                        :data="contentProject"
                        @click="exportOas"
                >
                </vue-json-pretty>
            </div>
            <div class="col-md-6" v-if="contentGithub">
                <h4>Project OAS in Github</h4>
                {{github}}
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
            getData: Function,
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
                github: {}
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
                        self.exportStatus = false

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
                    })
                }
            },
            getGithubStructure: function () {
                this.github = this.getData()
            }
        },
        created() {
            this.getGithubStructure()
        }
    }
</script>

<style scoped>

</style>