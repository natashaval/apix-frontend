<template>
    <div>
        GithubEditor {{projectId}}
        {{githubData}}

        FetchOwner: <small>{{isOwner}}</small> {{ownerData}}

        <div class="row">
            <button class="btn btn-primary float-right" v-if="!isEditing" @click="push">Push to Github</button>
        </div>

        <div class="row">
            <div v-if="showEdit" class="col-11 editRepo">
                <ul v-if="isEdited">
                    <li><button @click="submit">Save</button></li>
                    <li><button @click="cancel">Cancel</button></li>
                </ul>

                Owner: <span class="badge badge-secondary">{{owner}}</span>
                Repo: <input class="input-group" v-model="repo" @input="searchRepo">
                <button @click="dump">Dump!</button>
                <ul v-show="isRepoSearch">
                    <li v-for="(repoList,r) in filteredRepos" :key="r" @click="setRepo(repoList)">
                        {{repoList.fullName}}
                    </li>
                </ul>
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

            <button v-if="editable" @click="revertEditable"
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
    import uuidv4 from 'uuid/v4';
    import ActionBuilderUtil from "../../utils/ActionBuilderUtil";
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";

    export default {
        name: "GithubEditor",
        components: {VueEditor},
        mixins: [ChangeObserverMixin],
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
                isCreateNew: false,
                gitActions: [],
                attributesKey: [{key : 'owner'},{key : 'repo'}, {key : 'branch'},{key : 'path'}],

                isRepoSearch: false,
                filteredRepos: [],
                // attributesKey : [{key : 'owner'},{key : 'repo'}, {key : 'branch'},{key : 'path'}],
                projectId: undefined,
                githubApi: undefined,
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
            // contentData() {
            //     return this.$store.getters['github/getContent']
            // },
            reposData() {
                return this.$store.getters['github/getRepos']
            },
            // filteredRepos: function() {
            //     return this.reposData.filter((u) => {
            //         u.name.toLowerCase().includes(this.repo.toLowerCase())
            //     });
            // }
        },
        created() {
            // this.fetchInitial();
            // if (this.githubData !== undefined) this.fetchFirstOas(); // untuk mendapatkan first content agar bisa di init observe

            this.$store.dispatch('github/fetchRepos');
        },
        methods: {
            loadData: function(){
              // this.isEdited = false;
              // this.fetchFirstOas();
              this.$_changeObserverMixin_unObserve();
              this.projectId = this.$route.params.projectId;
              console.log('mounted load data githubApi', this.githubData)

              // if (this.githubData !== null) {
                if (this.githubData.owner !== '' && this.githubData.repo !== ''){
                  console.log('this.githubData COMPUTED defined')
                  this.owner = this.githubData.owner;
                  this.repo = this.githubData.repo;
                  this.branch = this.githubData.branch;
                  this.path = this.githubData.path;
                  this.isCreateNew = false;
              }
              // if (this.contentData !== undefined) {
              //     this.content = this.contentData
              // }

              //
              // this.fetchBranchList();
              // this.fetchOas();

                    /*
              else if (this.isOwner && (this.githubApi.owner == null || this.githubApi.repo == null)) {
                  console.log('this githubapi isnull and use owner inyytstead')
                  this.owner = this.ownerData.login
                  this.isCreateNew = true
              }
              */

              else {
                  console.log('fallback else')
                    if (this.isOwner){
                        this.owner = this.ownerData.login
                        this.isCreateNew = false
                        console.log('owner is available')
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
                return ActionBuilderUtil.createActions(this.githubData,this._data,this.attributesKey)
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
                // this.isEdited = false

                let pendek = {
                    githubProject: {
                        _actions: [],
                        _hasActions: false,
                        _signature: ''
                    },
                    // _signature: ''
                }
                let callbacks = []
                this.gitActions = []
                let signaturePointer = undefined

                if (this.isCreateNew){
                    console.log('New github link')
                    /* // milik alfian
                    tree = TreeBuilder.buildDeepTree(['githubProject'])
                    signaturePointer = this.projectData
                    tree.root._signature = signaturePointer._signature
                    let data = this.getData()
                    data._signature = uuidv4()
                    this.gitRootActions = tree.root._actions = [{
                        action : 'put',
                        key : 'githubProject',
                        value : data
                    }]
                    tree.leaf._hasActions = true
                    */
                    let data = this.getData()
                    data._signature = uuidv4()

                    pendek._hasActions = true
                    pendek._actions = [{
                        action : 'put',
                        key : 'githubProject',
                        value : data
                    }]
                    signaturePointer = this.projectData
                    pendek._signature = signaturePointer._signature

                    callbacks.push(()=>{
                        ActionExecutorUtil.executeActions(this.githubData, pendek._actions)
                    })

                    callbacks.push(()=>{
                        this.$router.push({
                            name :'github-editor'
                        })
                    })
                }
                else {
                    console.log('Edit github link')
                    this.gitActions = this.getActions()

                    // console.log('============ has Actions ============', this.gitActions)
                    pendek.githubProject._actions = this.gitActions
                    pendek.githubProject._hasActions = true
                    pendek.githubProject._signature = this.githubData._signature

                }

                console.log('Pendek: ', pendek);

                axios.put('http://localhost:8080/projects/'+this.projectId, pendek).then(
                    (response) => {
                        if(response.status === 200){
                            console.log('berhasil diganti')
                            this.githubData._signature = response.data.new_signature
                            this.commitChange()
                            this.loadData()
                            callbacks.forEach(fn => fn())
                        }
                    }
                ).catch(function (error) {
                    console.log(error);
                })




            },
            push: function () {
                console.log('push to github')
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
                if (this.githubData !== undefined) {
                    axios.get(BASE_URL + 'github/api/repos/' + this.owner + '/' + this.repo + '/branches')
                        .then((response) => {
                            this.branchList = response.data
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
                if (this.githubData !== undefined) {
                    this.oasLoading = true;
                    axios.get(BASE_URL + 'github/api/repos/' + this.owner + '/' + this.repo + '/contents/' + this.path,
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
            }
        },
        mounted() {
            this.loadData();

            // this.fetchBranchList();
            // if (this.githubApi !== undefined) this.fetchInitial();
        }
    }
</script>

<style scoped>

</style>