<template>
    <div class="row my-3">
        <div class="col-5">
            <h5>Assign My Team to this project</h5>
<!--            {{ teamInProject }}-->
            <small>You are required to be the creator of the team</small>
<!--            <div class="row">-->
                <select class="form-control col-10" v-model="selectedTeamName">
                    <option v-for="(myTeam, i) in teamAsCreator" :key="i" :value="myTeam.name">{{myTeam.name}}</option>
                </select>
<!--            </div>-->

        </div>
        <div class="col-2">
            <button class="btn btn-block btn-info" @click="assignTeam">Assign</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {BASE_URL} from "../../../stores/actions/const";
    import {USER_REQUEST} from "../../../stores/actions/user";
    import {makeToast} from "../../../assets/toast";

    export default {
        name: "AssignComponent",
        data: function(){
            return {
                teams: [],
                selectedTeamName: ''
            }
        },
        props: {
            projectId: String,
        },
        computed: {
            isProfile(){
                return this.$store.getters['user/isProfileLoaded']
            },
            profile() {
                if (!this.isProfile) {
                    this.$store.dispatch('user/' + USER_REQUEST)
                }
                return this.$store.getters['user/getProfile']
            },
            teamAsCreator(){
                let self = this
                if (!this.teams) return null;
                return this.teams.filter((t) => {
                    return t.creator === self.profile.username
                })
            },
            teamInProject(){
                return this.$store.getters['project/getTeams']
            }
        },
        methods: {
            makeToast,
            loadTeam(){
                axios.get(BASE_URL + "teams/my-team").then((response) => {
                    this.teams = response.data
                })
                .catch((e) => {
                console.error(e)
            })
            },
            assignTeam(){
                console.log(this.selectedTeamName)
                axios.post(BASE_URL + 'projects/' + this.projectId + '/assign?teamName=' + this.selectedTeamName)
                    .then((response) => {
                    this.makeToast('success', response.data.success, response.data.message)
                    this.$store.dispatch('project/assignTeamToProject', this.selectedTeamName)
                })
                    .catch((e) => {
                        console.error(e);
                        this.makeToast('danger', e.response.data.success, e.response.data.message)
                    })

            }
        },
        mounted() {
            this.loadTeam();
        }
    }
</script>

<style scoped>

</style>