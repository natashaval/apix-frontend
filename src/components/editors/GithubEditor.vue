<template>
    <div>
        GithubEditor
        {{githubData}}
        <div class="existRepo">
            Owner: <span class="badge badge-secondary">{{githubData.owner}}</span>
            Repo: <input class="input-group" v-model="githubData.repo" @change="fetchBranchList">
            Branch:
            <select v-model="githubData.branch" @change="fetchInitialOas">
                <option v-for="(availBranch,i) in branchList" :key="i">
                    {{availBranch}}
                </option>
            </select>
            Selected Branch: {{githubData.branch}}

            <hr />
            <input v-model="githubData.path" @change="fetchInitialOas"/>
            <i v-show="oasLoading" class="fa fa-spinner fa-spin"></i>
            <vue-editor v-model="initialOas.content"></vue-editor>
            <!--<p>{{initialOas.content}}</p>-->


        </div>

        <div class="changeRepo">

        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import { VueEditor } from 'vue2-editor'
    import {BASE_URL} from "../../stores/actions/const";

    export default {
        name: "GithubEditor",
        components: {VueEditor},
        data: function(){
            return {
                // repo: this.githubData.repo,
                // selectedBranch: this.githubData.branch,
                branchList: [],
                oasLoading: false,
                initialOas: {}
            }
        },
        computed : {
            githubData() {
                return this.$store.getters['project/getGithubData']
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
        },
        created() {
            this.fetchBranchList();
            this.fetchInitialOas();
        },
        methods: {
            fetchBranchList: function () {
                axios.get(BASE_URL + 'github/api/repos/' + this.githubData.owner + '/' + this.githubData.repo + '/branches')
                    .then((response) => {this.branchList = response.data})
                    .catch((e) => {console.error(e)})
            },
            fetchInitialOas: function() {
                this.oasLoading = true;
                axios.get(BASE_URL + 'github/api/repos/' + this.githubData.owner + '/' + this.githubData.repo + '/contents/' + this.githubData.path,
                    {params: {
                        ref: this.githubData.branch
                        }}
                )
                    .then((response) => {
                        this.oasLoading = false;
                        this.initialOas = response.data
                    })
                    .catch((e) => {console.error(e)})
            }
        }
    }
</script>

<style scoped>

</style>