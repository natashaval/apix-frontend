<template>
    <div>
        <div v-if="assignNew">
            <div class="col-12">
                <h6>Assign Team *</h6>
                <div class="row">
                    <div class="col-md-8" v-if="!isNewTeam">
                        <select class="form-control" v-model="selectedTeamName" v-if="!assignAllTeam">
                            <option value="" disabled selected>-- Select your team --</option>
                            <option v-for="(myTeam, i) in teamAsCreator" :key="i" :value="myTeam.name">{{myTeam.name}}</option>
                        </select>
                    </div>
                    <div class="col-md-8" v-if="isNewTeam">
                        <input class="form-control" v-model="inputTeamName" placeholder="Input new team name" required />
                    </div>
                    <div class="col-md-4">
                        <b-form-checkbox v-model="isNewTeam" switch>
                            Create new team?
                        </b-form-checkbox>
                    </div>
                </div>

            </div>
        </div>
        <div v-else class="row">
            <div class="col-5">
                <h5>Invite Team to this project</h5>
                <!--<small>You are required to be the creator of the team</small>-->
                <select class="form-control col-10" v-model="selectedTeamName">
                    <option value="" disabled selected>-- Select a team -- </option>
                    <option v-for="(myTeam, i) in teams" :key="i" :value="myTeam.name">{{myTeam.name}}</option>
                </select>
            </div>
            <div class="col-2">
                <button class="btn btn-block btn-info" @click="assignTeam">Assign</button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {BASE_PROJECT_URL, BASE_URL} from "../../../stores/consts/url";
    import {USER_REQUEST} from "../../../stores/actions/user";
    import {makeToast} from "../../../assets/toast";

    export default {
        name: "AssignComponent",
        data: function(){
            return {
                teams: [],
                selectedTeamName: '',
                isNewTeam: false,
                inputTeamName: '',
            }
        },
        props: {
            projectId: String,
            assignNew: {
                type: Boolean,
                default: false
            },
            assignAllTeam: {
                type: Boolean,
                default: false
            }
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
            teamAsCreator(){ // list of team where user is the team leader
                let self = this
                if (!this.teams) return null;
                return this.teams.filter((t) => {
                    return t.creator === self.profile.username
                })
            },
        },
        methods: {
            makeToast,
            loadTeam(){
                axios.get(BASE_URL + "/teams/my-team").then((response) => {
                    this.teams = response.data
                })
                    .catch((e) => {
                        console.error(e)
                    })
            },
            assignTeam(){
                // console.log(this.selectedTeamName)
                axios.post(BASE_PROJECT_URL +'/'+ this.projectId + '/assign', {
                    assignType: 'grant',
                    teamName: this.selectedTeamName
                })
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
