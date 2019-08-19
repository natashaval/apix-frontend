<template>
    <div>
        <EditorHeaderComponent :isEdited="isEdited" :editable="$_projectPrivilege_canEdit"
                               :submit="submit" :cancel="cancel" :name="editorTitle"></EditorHeaderComponent>
        <div class="row">
            <div class="col-md-8 pl-4">
                <h4>Github Editor</h4>
            </div>
        </div>
        <div class="row">
            <div v-if="showEdit" class="col-11" style="border-color: crimson">
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
                            <input class="form-control"
                                   v-model="repo"
                                   @input="searchRepo"
                                   placeholder="Search repositories" />
                            <ul v-show="isRepoSearch" class="autocomplete-items">
                                <li v-for="(repoList,r) in filteredRepos" :key="r" @click="setRepo(repoList)">
                                    {{repoList.fullName}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="form-group col-4">
                        <label>Branch: </label>
                        <select v-model="branch" class="form-control">
                            <option v-for="(availBranch,i) in branchList" :key="i">
                                {{availBranch}}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-group ml-3">
                    <label>Path: &nbsp;&nbsp;&nbsp;</label>
                    <div class="autocomplete">
                        <input class="form-control"
                               v-model="path"
                               @input="searchFile"
                               placeholder="Search path" />
                        <ul v-show="isPathSearch" class="autocomplete-items">
                            <li v-for="(file,f) in filteredFile" :key="f" @click="setFile(file)">
                                {{file}}
                            </li>
                        </ul>
                    </div>
                </div>
                <hr />
                <div class="row" style="background-color: ghostwhite;">
                    <div class="form-group col-7 ml-3">
                        <h5 class="font-weight-bold">Push To Github
                            <span><i v-show="pushLoading" class="fa fa-spinner fa-spin"></i></span>
                        </h5>
                        <small>This project OAS will be uploaded to referred file path in Github</small>
                        <input type="text" class="form-control" v-model="message" placeholder="Commit message (required)" required/>
                    </div>
                    <div class="col-4 ml-3">
                        <button class="btn btn-dark mt-2" @click="push" :disabled="isEdited">Push to Github</button>
                    </div>
                </div>
                <div class="row mt-2" style="background-color: ghostwhite;">
                    <div class="col-7 ml-3">
                        <h5 class="font-weight-bold">Pull to Project &nbsp;&nbsp;
                            <span><i v-show="pullLoading" class="fa fa-spinner fa-spin"></i></span>
                        </h5>
                        <small>Oas from Github will be pulled and replaced this project</small>
                    </div>
                    <div class="col-4 ml-3">
                        <button class="btn btn-dark mt-2" @click="pull" :disabled="isEdited">Pull to Project</button>
                    </div>
                </div>

            </div>
        </div>
        <div class="row" v-if="content">
            <div class="col-md-11 m-auto">
                <!--                <vue-editor disabled v-model="content.content"></vue-editor>-->
                <JsonCompareComponent :project-id="projectId"
                                      :owner="owner"
                                      :repo="repo"
                                      :branch="branch"
                                      :path="path"
                ></JsonCompareComponent>
            </div>
        </div>




    </div>
</template>

<script>
    import axios from 'axios'
    import uuidv4 from 'uuid/v4';
    import {BASE_URL} from "../../stores/consts/url";
    import ChangeObserverMixin from "../../mixins/ChangeObserverMixin";
    import ActionBuilderUtil from "../../utils/ActionBuilderUtil";
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";
    import EditorHeaderComponent from "./editor-components/EditorHeaderComponent";
    import ProjectPrivilegeMixin from "../../mixins/ProjectPrivilegeMixin";
    import {makeToast} from "../../assets/toast";
    import JsonCompareComponent from "./editor-components/JsonCompareComponent";

    export default {
        name: "GithubEditor",
        components: {JsonCompareComponent, EditorHeaderComponent, },
        mixins: [ChangeObserverMixin, ProjectPrivilegeMixin],
        data: function(){
            return {
                owner: '',
                repo: '',
                branch: '',
                path: 'README.md',
                sha: '',
                githubJson: {},
                content: {}, // content tidak diganti, langsung dari executor export
                message: '',
                branchList: [],
                fileList: [],
                // initialOas: {},

                isEditing: true,
                isEdited: false,
                gitActions: [],
                attributesKey: [{key : 'owner'},{key : 'repo'}, {key : 'branch'},{key : 'path'}],

                isRepoSearch: false,
                isPathSearch: false,
                filteredRepos: [],
                projectId: undefined,
                commitResponse: {},
                pullResponse: {},
                pullLoading: false,
                pushLoading: false,
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
            filteredFile() {
                return this.fileList.filter(f => f.toLowerCase().includes(this.path.toLowerCase()))
            }
        },
        created() {
            this.$store.dispatch('github/fetchRepos');
        },
        methods: {
            makeToast,
            loadData: function(){
                this.$_changeObserverMixin_unObserve()
                this.projectId = this.$route.params.projectId
                if (this.githubData && this.githubData.owner !== '' && this.githubData.repo !== ''){
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

                this.$_changeObserverMixin_initObserver(['owner','repo', 'branch', 'path'])
            },
            getData: function(){
                let res = {};
                res.owner = this.owner;
                res.repo = this.repo;
                res.branch = this.branch;
                res.path = this.path;
                this.githubJson = res
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
                if (this.githubData) payload.githubProject._signature = this.githubData._signature
                else payload.githubProject._signature = uuidv4();

                console.log('Payload: ', payload);


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
                this.pushLoading = true
                console.log('push to github')
                axios.put(BASE_URL + '/github/api/repos/' + this.owner + '/' + this.repo + '/contents/' + this.path,
                    {
                        message: this.message,
                        projectId: this.projectId,
                        branch: (this.branch == '') ? 'master' : this.branch
                    })
                    .then((response) => {
                        this.commitResponse = response.data
                        console.log(this.commitResponse)
                        this.makeToast('success', response.data.success, "Success push to github -> " + response.data.message);
                        this.pushLoading = false
                    })
                    .catch((e) => {
                        console.error(e);
                        this.makeToast('danger', e.response.data.success, e.response.data.message + ": " + e.response.data.errors);
                        this.pushLoading = false
                    })
            },
            pull: function(){
                let self = this
                let projectId = this.$route.params.projectId
                console.log(projectId)
                self.pullLoading = true

                self.$toast.question('Are you sure to pull OAS (this will replace all current project)?',
                    'Confirmation', {
                        timeout: 20000,
                        close: false,
                        overlay: true,
                        toastOnce: true,
                        id: 'question',
                        zindex: 999,
                        position: 'center',
                        buttons: [
                            ['<button><b>Yes</b></button>', (instance, toast) => {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                                console.log('tekan Yes di pull')

                                axios.post(BASE_URL + '/github/api/repos/' + self.owner + '/' + self.repo + '/contents/' + self.path + '?projectId=' + projectId,
                                    this.getData())
                                    .then((response) => {
                                        console.log('berhasil pull project')
                                        self.pullResponse = response.data
                                        self.pullLoading = false
                                        self.makeToast('success', response.data.success, response.data.message, 2000);
                                        self.$store.dispatch('project/fetchProjectData',projectId);
                                        setTimeout(() => {
                                            self.$router.push({
                                                name: 'project-editor',
                                                params: {projectId: projectId}
                                            })
                                        }, 2200);
                                    }).catch((e) => {
                                    console.error(e);
                                    self.pullLoading = false
                                    self.makeToast('danger', e.response.data.success, e.response.data.message);
                                })

                            }, true],
                            ['<button>No</button>', function (instance, toast) {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            }]
                        ]
                    })
            },
            fetchBranchList: function () {
                if (this.githubData !== undefined) {
                    axios.get(BASE_URL + '/github/api/repos/' + this.owner + '/' + this.repo + '/branches')
                        .then((response) => {
                            // let master = ['master']
                            // this.branchList = master.concat(response.data)
                            let branches = response.data
                            if (branches.indexOf("master") > 0){
                                branches.splice(branches.indexOf("master"), 1)
                                branches.unshift("master")
                            }
                            this.branchList = branches
                        })
                        .catch((e) => {
                            console.error(e)
                        })
                }
                else {
                    console.log('GithubAPI still empty!')
                }
            },
            fetchFileList: function () {
                if (this.githubData !== undefined) {
                    let tree = ''
                    if (this.branch === '') tree = 'master'
                    else tree = this.branch
                    axios.get(BASE_URL + '/github/api/repos/' + this.owner + '/' + this.repo + '/git/trees/' + tree)
                        .then((response) => {
                            this.fileList = response.data
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
                    axios.get(BASE_URL + '/github/api/repos/' + this.owner + '/' + this.repo + '/contents/' + this.path,
                        {
                            params: { ref: this.branch }
                        }
                    )
                        .then((response) => {
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
                // this.fetchOas();
            },
            revertEditable: function(){
                this.isEditing = !this.isEditing;
                this.cancel();
            },
            searchRepo: function(){
                this.isRepoSearch = true
                this.filterResults();
            },
            searchFile: function(){
                this.isPathSearch = true;
                this.fetchFileList();
            },
            filterResults: function() {
                if (this.reposData) {
                    this.filteredRepos = this.reposData.filter(rep => rep.name.toLowerCase().includes(this.repo.toLowerCase()));
                }
                else return null;
            },
            dump: function () {
                console.log(this.getActions());
            },
            setRepo: function(result){
                this.repo = result.name;
                this.owner = result.ownerName;
                this.isRepoSearch = false;

                this.fetchBranchList();
                this.fetchFileList();
            },
            setFile: function(result) {
                this.isPathSearch = false;
                this.path = result;
            }
        },
        watch: {
            $route: function () {
                this.loadData();
            },
            owner: function(newOwner, oldOwner){
                if (oldOwner == '') return this.ownerData.login
            },
            githubData : function () {
                this.loadData()
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
