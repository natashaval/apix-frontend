<template>
    <div>
        {{ profile }}

        <div>
            <b-media right-align>
                <b-img slot="aside" blank blank-color="#ccc" width="70" alt="profile picture"></b-img>
                <h4 class="mt-0 mb-1">Hello, {{profile.username}}</h4>
            </b-media>
        </div>

        <div>
            <b-tabs>
                <b-tab title="Team" active>
                    <b-button variant="info" :to="{name: 'team-create'}">Create Team</b-button>

                    <div class="mt-3 mb-3">
                        <h3>Need Confirmation</h3>
                        <b-card-group columns class="mb-3">
                            <TeamCard :teams="ungrantUser" :isGrant="false" @update="loadTeam"></TeamCard>
                        </b-card-group>
                    </div>

                    <div class="mt-3">
                        <h3>My Teams</h3>
                        <b-card-group columns class="mb-3">
                            <TeamCard :teams="grantUser" :isGrant="true"></TeamCard>
                        </b-card-group>
                    </div>
                </b-tab>
                <!--b-tab title="Version">
                    Ongoing version
                </b-tab-->
            </b-tabs>
        </div>
    </div>
</template>

<script>
    import {AUTH_LOGOUT} from "../../stores/actions/auth";
    import {BASE_URL} from "../../stores/actions/const";
    import axios from 'axios'
    import TeamCard from "./team-components/TeamCard";


    export default {
        name: "UserProfile",
        components: {TeamCard},
        data: function(){
            return {
                teams: null,
                dump: false
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

        },
        methods: {
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            logout: function () {
                this.$store.dispatch('auth/' + AUTH_LOGOUT).then(() => {
                    this.$router.push({path: '/login'});
                }, (err) => {
                    console.log('login', err)
                })
            },
            dumpTeam(){
                this.dump = !this.dump;
            },
            loadTeam(){
                axios.get(BASE_URL + "teams/my-team").then((response) => {
                    this.teams = response.data
                }).catch((e) => {
                    console.error(e)
                })
            }
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
        },
        created() {
            this.loadTeam();
        }
    }
</script>

<style scoped>

</style>