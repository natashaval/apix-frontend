<template>
    <div>
        <div class="row">
            <div class="col-8">
                <h4>Need Confirmation</h4>
                <small>You are invited as a member of this team</small>
            </div>
            <div class="col-4">
                <b-button variant="info" :to="{name: 'team-create'}"
                          class="my-2 float-right"
                >Create Team</b-button>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <b-card-group columns class="mb-2">
                    <TeamCard :teams="ungrantUser" :isGrant="false" @update="loadTeam"></TeamCard>
                </b-card-group>
            </div>
        </div>

        <div class="row my-2">
            <div class="col-9">
                <h4><i class="fas fa-users"></i> My Teams</h4>
                <small>If you are an owner of a team, it will be indicated by different header color</small>
            </div>
            <div class="col-3">
                <div class="input-group mb-2">
                    <input class="form-control" type="text"
                           v-model="searchTeam" placeholder="Search team name ..."/>
                    <div class="input-group-append">
                        <span class="input-group-text"><i class="fa fa-search"></i> </span>
                    </div>
                </div>
            </div>
        </div>

        <!--{{grantUser}}-->

        <b-card-group columns class="mb-2">
            <TeamCard :teams="filterTeam" :isGrant="true"></TeamCard>
        </b-card-group>
    </div>
</template>

<script>
    import axios from "axios";
    import {BASE_URL} from "../../stores/actions/const";
    import TeamCard from "./team-components/TeamCard";

    export default {
        name: "TeamList",
        components: {TeamCard},
        data: function(){
            return {
                teams: null,
                dump: false,
                searchTeam: ''
            }
        },
        computed: {
            profile() {
                return this.$store.getters['user/getProfile']
            },
            isAuthenticated () {
                return this.$store.getters['auth/isAuthenticated']
            },
            grantUser: function() {
                // https://laracasts.com/discuss/channels/vue/computed-function-is-running-before-data-is-loaded?page=0
                if (!this.teams) return null;
                return  this.teams.filter(u =>
                    u.members.some((members) => members.grant && members.username.includes(this.profile.username))
                );
            },
            ungrantUser: function () {
                if (!this.teams) return null;
                return this.teams.filter((u) =>
                    u.members.some((members) => !members.grant && members.username.includes(this.profile.username))
                );
            },
            filterTeam: function(){
                if (this.searchTeam === '') return this.grantUser
                else {
                    return this.grantUser.filter((u) => u.name.toLowerCase().includes(
                        this.searchTeam.toLowerCase()
                    ))
                }
            }
        },
        methods: {
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            loadTeam(){
                console.log('load team')
                axios.get(BASE_URL + "/teams/my-team").then((response) => {
                    this.teams = response.data
                }).catch((e) => {
                    console.error(e)
                })
            },
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
            this.loadTeam();
        },
    }
</script>

<style scoped>

</style>