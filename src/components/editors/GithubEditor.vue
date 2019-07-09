<template>
    <div>
        <SaveComponent :isEdited="isEdited" :editable="$_projectPrivilege_canEdit"
                       :submit="submit" :cancel="cancel" :name="editorTitle"></SaveComponent>
        <div class="row">
            <div class="col-md-8 pl-4">
                <h4>Github Editor</h4>
            </div>
            <div class="col-md-4 pr-4">
                <button v-if="$_projectPrivilege_canEdit" @click="isEditing = !isEditing"
                        class="float-right round-button btn mt-2 mr-2" v-bind:id="_uid+'-edit-btn'">
                    <i class="fa fa-pencil-alt"></i>
                </button>
                <button @click="fetchOas" class="float-right btn round-button mt-2 mr-2" type="button"
                        data-toggle="tooltip" data-placement="bottom" title="Sync with Github"
                >
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
        </div>
        <div class="row">
            <div v-if="showEdit" class="col-11" style="border-color: crimson">
                <!--{{ownerData}}-->
                <div class="form-group ml-3" v-if="ownerData">
                    <label class="font-weight-bold">Owner : &nbsp;</label>
                    <span class="badge badge-secondary">
                        {{owner}}
                    </span>
                </div>
                <div class="row">
                    <div class="form-group col-7 ml-3">
                        <label>Repo: </label>
                        <div class="autocomplete">
                            <input class="form-control" v-model="repo" @input="searchRepo" placeholder="Search repositories" />
                            <ul v-show="isRepoSearch" class="autocomplete-items">
                                <li v-for="(repoList,r) in filteredRepos" :key="r" @click="setRepo(repoList)">
                                    {{repoList.fullName}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="form-group col-4">
                        <label>Branch: </label>
                        <select v-model="branch" class="form-control" @change="fetchOas">
                            <option v-for="(availBranch,i) in branchList" :key="i">
                                {{availBranch}}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-group ml-3">
                    <label>Path: &nbsp;&nbsp;&nbsp;</label>
                    <span><i v-show="oasLoading" class="fa fa-spinner fa-spin"></i></span>
                    <input v-model="path" class="form-control col-md-11" @change="fetchOas"/>
                </div>
                <div class="row">
                    <div class="form-group col-7 ml-3">
                        <label>Commit message: </label>
                        <input type="text" class="form-control" v-model="message" />
                    </div>
                    <div class="form-group col-4 ml-3">
                        <label class="invisible">Push to Github: </label><br />
                        <button class="btn btn-dark ml-3" @click="push">Push to Github</button>
                    </div>
                </div>
                <div clas="row">
                    <div class="col-8" v-if="commitResponse.commitDate">
                        <div class="alert alert-primary" role="alert">
                            Project is successfully push to Github -> {{commitResponse.message}}
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="col-11">
                <div class="row">
                    <!--{{ ownerData }}-->
                    <div class="col-md-12 ml-3" v-if="ownerData">
                        <p class="font-weight-bold">Owner :  <span class="badge badge-secondary">{{owner}}</span></p> <br />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-5 ml-3">
                        <p class="font-weight-bold">Repo: {{repo}}</p>
                    </div>
                    <div class="col-md-5">
                        <p class="font-italic">Branch: {{branch}}</p><br />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 ml-3">
                        <p class="font-weight-bold">Path: {{ path }} &nbsp;
                        <span><i v-show="oasLoading" class="fa fa-spinner fa-spin"></i></span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
        <div class="row" v-if="content">
            <div class="col-md-11 m-auto">
                <vue-editor disabled v-model="content.content"></vue-editor>
            </div>
        </div>


    </div>
</template>

<script>
    import axios from 'axios'
    import uuidv4 from 'uuid/v4';
    import { VueEditor } from 'vue2-editor'
    import {BASE_URL} from "../../stores/actions/const";
    import ChangeObserverMixin from "../../mixins/ChangeObserverMixin";
    import ActionBuilderUtil from "../../utils/ActionBuilderUtil";
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";
    import SaveComponent from "./editor-components/EditorHeaderComponent";
    import ProjectPrivilegeMixin from "../../mixins/ProjectPrivilegeMixin";
    import {makeToast} from "../../assets/toast";

    export default {
        name: "GithubEditor",
        components: {SaveComponent, VueEditor},
        mixins: [ChangeObserverMixin, ProjectPrivilegeMixin],
        data: function(){
            return {
                owner: '',
                repo: '',
                branch: '',
                path: 'README.md',
                content: {}, // content tidak diganti, langsung dari executor export
                message: '',
                branchList: [],
                oasLoading: false,
                // initialOas: {},

                isEditing: false,
                isEdited: false,
                gitActions: [],
                attributesKey: [{key : 'owner'},{key : 'repo'}, {key : 'branch'},{key : 'path'}],

                isRepoSearch: false,
                filteredRepos: [],
                projectId: undefined,
                commitResponse: {}
            }
        },
        computed : {
            editorTitle : function (){
                return '<h4><i class="fab fa-github-alt"></i> ' + this.path+'</h4>';
            },
            showEdit : function () {
                if(!this.$_projectPrivilege_canEdit){
                    return false
                }
                return this.isEditing
            },
            githubData() {
                return this.$store.getters['project/getGithubData']
            },
            projectData : function () {
                return this.$store.getters['project/getProjectData']
            },
            ownerData() {
                if (!this.isOwner) {
                    this.$store.dispatch('github/fetchOwner')
                }
                return this.$store.getters['github/getOwner']
            },
            isOwner(){
                return this.$store.getters['github/isOwnerLoaded']
            },
            reposData() {
                return this.$store.getters['github/getRepos']
            },
        },
        created() {
            this.$store.dispatch('github/fetchRepos');
        },
        methods: {
            makeToast,
            loadData: function(){
                this.$_changeObserverMixin_unObserve();
                this.projectId = this.$route.params.projectId;
                // if (this.githubData !== null) {
                if (this.githubData.owner !== '' && this.githubData.repo !== ''){
                    console.log('github ada')
                    this.owner = this.githubData.owner;
                    this.repo = this.githubData.repo;
                    this.branch = this.githubData.branch;
                    this.path = this.githubData.path;
                    this.fetchInitial();
                }
                else {
                    if (this.isOwner){
                        console.log('ada owner')
                        this.owner = this.ownerData.login
                    }
                    else {console.log('there nothing you can do')}
                }

                this.$_changeObserverMixin_initObserver(['owner','repo', 'branch', 'path', 'message'])
            },
            getData: function(){
                let res = {};
                res.owner = this.owner;
                res.repo = this.repo;
                res.branch = this.branch;
                res.path = this.path;
                return res;
            },
            getActions: function(){
                let action = {
                    owner: '',
                    repo: '',
                    branch: '',
                    path: '',
                }
                if (this.githubData) return ActionBuilderUtil.createActions(this.githubData,this._data,this.attributesKey)
                else return ActionBuilderUtil.createActions(action, this._data, this.attributesKey);
            },
            commitChange: function(){
                ActionExecutorUtil.executeActions(this.githubData, this.gitActions)
            },
            //override
            $_changeObserverMixin_onDataChanged : function (after,before) {
                this.isEdited = true
            },
            cancel:function () {
                this.loadData()
                this.isEdited = false
            },
            submit: function(){
                console.log('submit tree githubProject') // refer to DefinitionEditor & PathEditor
                this.isEdited = false

                let payload = {
                    githubProject: {
                        _actions: [],
                        _hasActions: false,
                        _signature: ''
                    },
                    // _signature: ''
                }
                let callbacks = []
                this.gitActions = []

                this.gitActions = this.getActions()
                console.log('Edit github link', this.gitActions)

                // console.log('============ has Actions ============', this.gitActions)
                payload.githubProject._actions = this.gitActions
                payload.githubProject._hasActions = true
                if (this.githubData) payload.githubProject._signature = this.githubData._signature
                else payload.githubProject._signature = uuidv4();

                console.log('Pendek: ', payload);


                axios.put('http://localhost:8080/projects/'+this.projectId, payload).then(
                    (response) => {
                        if(response.status === 200){
                            console.log('berhasil diganti')
                            this.githubData._signature = response.data.new_signature
                            this.commitChange()
                            this.loadData()
                            callbacks.forEach(fn => fn())
                            this.makeToast('success', response.data.success, response.data.message);
                        }
                    }
                ).catch(error => {
                    this.makeToast('danger', error.response.data.success, error.response.data.message + ' , Please refresh the page.')
                })


            },
            push: function () {
                let branchPush = ''
                if (this.branch == '') branchPush = 'master'
                else branchPush = this.branch
                axios.put(BASE_URL + '/github/api/repos/' + this.owner + '/' + this.repo + '/contents/' + this.path,
                    {
                        message: this.message,
                        projectId: this.projectId,
                        sha: this.content.sha,
                        branch: branchPush
                    })
                    .then((response) => {
                        this.commitResponse = response.data
                        console.log(this.commitResponse)
                        this.makeToast('success', response.data.success, "Success push to github -> " + response.data.message);
                        this.$nextTick(() => {
                            this.fetchOas();
                        })

                    })
                    .catch((e) => {
                        console.error(e);
                        this.makeToast('danger', e.response.data.success, e.response.data.message + e.response.data.errors[0]);
                    })
            },
            fetchBranchList: function () {
                if (this.githubData !== undefined) {
                    axios.get(BASE_URL + '/github/api/repos/' + this.owner + '/' + this.repo + '/branches')
                        .then((response) => {
                            let master = ['master']
                            this.branchList = master.concat(response.data)
                        })
                        .catch((e) => {
                            console.error(e)
                        })
                }
                else {
                    console.log('GithubAPI still empty!')
                }
            },
            fetchOas: function() {
                // if (this.githubData !== undefined) {
                if (this.githubData.repo !== ''){
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
                            this.content = response.data
                        })
                        .catch((e) => {
                            console.error(e)
                        })
                }
                else {
                    console.log("this fetchoas githubapi still empty")
                }
            },

            fetchInitial: function(){
                this.fetchBranchList();
                this.fetchOas();
            },
            revertEditable: function(){
                this.isEditing = !this.isEditing;
                this.cancel();
            },
            searchRepo: function(){
                this.isRepoSearch = true
                this.filterResults();
            },
            filterResults: function() {
                this.filteredRepos = this.reposData.filter(rep => rep.name.toLowerCase().includes(this.repo.toLowerCase()));
            },
            dump: function () {
                console.log(this.getActions());
            },
            setRepo: function(result){
                this.repo = result.name;
                this.owner = result.ownerName;
                this.isRepoSearch = false;

                this.fetchInitial();
            }
        },
        watch: {
            $route: function () {
                this.loadData();
                this.fetchOas();
            }
        },
        mounted() {
            this.loadData();
        }
    }
</script>

<style scoped>
    /*https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete*/
    .autocomplete {
        position: relative;
        /*display: inline-block;*/
    }
    .autocomplete-items {
        position: absolute;
        background-color: white;
        border: 1px solid #d4d4d4;
        border-top: none;
        z-index: 99;
        top: 100%;
        left: 0;
        right: 0;
    }
</style>
