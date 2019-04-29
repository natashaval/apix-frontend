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

                    <button @click="dumpTeam">{{dump}}</button>
                    <p v-if="dump">TRUE {{grantUser}}</p>
                    <p v-if="!dump"> FALSE {{ ungrantUser }}</p>
                    <!--b-list-group v-for="team in profile.teams" :key="team">
                        <b-list-group-item :to="{name: '', params: {}} ">{{team}}</b-list-group-item>
                    </b-list-group-->

                    <!--div class="mt-3" v-if="ungrantUser.length">
                        <b-card-group deck class="mb-3">
                            INI YANG GRANT FALSE (perlu confirm invitation)
                            {{ ungrantUser }}
                        </b-card-group>
                    </div>

                    <div class="mt-3" v-if="grantUser.length">
                        INI YANG GRANT tRUE
                        <b-card-group deck class="mb-3" v-for="team in grantUser" :key="team.id">
                            <TeamCard :team="team"></TeamCard>
                        </b-card-group>
                        {{ grantUser }}
                    </div-->
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
                return  this.teams.filter(u =>
                    u.members.some((members) => members.grant && members.username.includes(this.profile.username))
                );
            },
            ungrantUser: function () {
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
            }
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
        },
        created() {
            axios.get(BASE_URL + "teams/my-team").then((response) => {
                this.teams = response.data
            }).catch((e) => {
                console.error(e)
            })
        }
    }
</script>

<style scoped>

</style>