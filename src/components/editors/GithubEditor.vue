<template>
    <div>
        GithubEditor {{projectId}}
        {{githubApi}}

        <div class="row">
            <div v-if="showEdit" class="col-11 editRepo">
                <ul v-if="isEdited">
                    <li><button @click="submit">Push</button></li>
                    <li><button @click="cancel">Cancel</button></li>
                </ul>

                Owner: <span class="badge badge-secondary">{{owner}}</span>
                Repo: <input class="input-group" v-model="repo" @change="fetchInitial">
                Branch:
                <select v-model="branch" @change="fetchOas">
                    <option v-for="(availBranch,i) in branchList" :key="i">
                        {{availBranch}}
                    </option>
                </select>
                Selected Branch: {{branch}}

                <hr />
                <input v-model="path" @change="fetchOas"/>
                <i v-show="oasLoading" class="fa fa-spinner fa-spin"></i>
                <p>current sha: {{content.sha}}</p>
                Commit message: <input type="text" class="form-control" v-model="message" />
                <div v-if="commitResponse.commitDate">Has been updated!
                    {{commitResponse}}
                </div>
                Preview:
                <vue-editor disabled v-model="content.content"></vue-editor>
            </div>

            <div v-else class="col-11 existRepo">
                Owner: <span class="badge badge-secondary">{{owner}}</span>
                Repo: {{repo}}
                Branch: {{branch}}

                <hr />
                <div class="row">
                    Path: <input v-model="path" class="form-control-plaintext" readonly/>
                </div>
                <div class="row">
                    Content: <vue-editor disabled v-model="content.content"></vue-editor>
                </div>
            </div>

            <button v-if="editable" @click="isEditing = !isEditing"
                    class="col-1 btn float-right">
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import { VueEditor } from 'vue2-editor'
    import {BASE_URL} from "../../stores/actions/const";
    import ChangeObserverMixin from "../../mixins/ChangeObserverMixin";

    export default {
        name: "GithubEditor",
        components: {VueEditor},
        mixins: [ChangeObserverMixin],
        data: function(){
            return {
                owner: '',
                repo: '',
                branch: '',
                path: '',
                content: {}, // content tidak diganti, langsung dari executor export
                message: '',
                branchList: [],
                oasLoading: false,
                // initialOas: {},

                isEditing: false,
                isEdited: false,
                // attributesKey : [{key : 'owner'},{key : 'repo'}, {key : 'branch'},{key : 'path'}],
                projectId: undefined,
                githubApi: {},
                commitResponse: {}
            }
        },
        computed : {
            editable : function () {
                let hasEditingPrivilege = this.$store.getters['user/hasEditingPrivilege']
                if(hasEditingPrivilege === undefined)return false
                return hasEditingPrivilege
            },
            showEdit : function () {
                if(!this.editable){
                    return false
                }
                return this.isEditing
            },
            // githubData() {
            //     return this.$store.getters['project/getGithubData']
            // },
            ownerData() {
                if (!this.isOwner) {
                    this.$store.dispatch('github/fetchOwner')
                }
                return this.$store.getters['github/getOwner']
            },
            isOwner(){
                return this.$store.getters['github/isOwnerLoaded']
            },
            // contentData() {
            //     return this.$store.getters['github/getContent']
            // }
        },
        created() {
            // this.fetchInitial();
            // if (this.githubData !== undefined) this.fetchFirstOas(); // untuk mendapatkan first content agar bisa di init observe
            this.loadApi();
        },
        methods: {
            loadData: function(){
              this.isEdited = false;
              // this.fetchFirstOas();
              this.$_changeObserverMixin_unObserve();
              if (this.githubApi !== undefined) {
                  this.owner = this.githubApi.owner;
                  this.repo = this.githubApi.repo;
                  this.branch = this.githubApi.branch;
                  this.path = this.githubApi.path;
              }
              // if (this.contentData !== undefined) {
              //     this.content = this.contentData
              // }

              this.fetchBranchList();
              this.fetchOas();

              this.$_changeObserverMixin_initObserver(['owner','repo', 'branch', 'path', 'message'])
            },
            loadApi: function(){
                let p = this.$route.params
                this.projectId = p.projectId
                this.githubApi = p.githubApi
            },
            //override
            $_changeObserverMixin_onDataChanged : function (after,before) {
                this.isEdited = true
            },
            cancel:function () {
                this.loadData()
            },
            submit:function () {
                console.log('github submit')
                axios.put(BASE_URL + 'github/api/repos/' + this.owner + '/' + this.repo + '/contents/' + this.path,
                    {
                        message: this.message,
                        projectId: this.projectId,
                        sha: this.content.sha
                    })
                    .then((response) => {
                        this.commitResponse = response.data
                        console.log(this.commitResponse)
                    })
                    .catch((e) => {console.error(e)})
            },
            fetchBranchList: function () {
                axios.get(BASE_URL + 'github/api/repos/' + this.owner + '/' + this.repo + '/branches')
                    .then((response) => {
                        this.branchList = response.data
                    })
                    .catch((e) => {console.error(e)})
            },
            fetchOas: function() {
                this.oasLoading = true;
                axios.get(BASE_URL + 'github/api/repos/' + this.owner + '/' + this.repo + '/contents/' + this.path,
                    {params: {
                        ref: this.branch
                        }}
                )
                    .then((response) => {
                        this.oasLoading = false;
                        // this.initialOas = response.data
                        this.content = response.data
                    })
                    .catch((e) => {console.error(e)})

            },
            /*
            fetchFirstOas: function(){
                this.oasLoading = true;
                // this.$store.dispatch('github/fetchOas', {
                //     owner: this.githubApi.owner,
                //     repo: this.githubApi.repo,
                //     branch: this.githubApi.branch,
                //     path: this.githubApi.path
                // })

                axios.get(BASE_URL + 'github/api/repos/' + this.githubApi.owner + '/' + this.githubApi.repo + '/contents/' + this.githubApi.path,
                    {params: {
                            ref: this.githubApi.branch
                        }}
                )
                    .then((response) => {
                        this.oasLoading = false;
                        // this.initialOas = response.data
                        this.content = response.data
                    })
                    .catch((e) => {console.error(e)})
            },
            */
            fetchInitial: function(){
                this.fetchBranchList();
                this.fetchOas();
            }
        },
        watch: {
            $route: function () {
                this.loadData();
            }
        },
        mounted() {
            this.loadData();
            // this.fetchBranchList();
            this.fetchInitial();
        }
    }
</script>

<style scoped>

</style>