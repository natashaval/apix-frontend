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
                    <!--b-list-group v-for="team in profile.teams" :key="team">
                        <b-list-group-item :to="{name: '', params: {}} ">{{team}}</b-list-group-item>
                    </b-list-group-->
                    <div class="mt-3">
                        <b-card-group deck class="mb-3">
                            <b-card v-for="team in profile.teams" :key="team"
                                    :title="team" cols="4">
                                <div slot="footer">
                                    <b-button :href="team" variant="primary">Enter</b-button>
                                </div>
                            </b-card>
                        </b-card-group>
                    </div>
                </b-tab>
                <b-tab title="Version">
                    Ongoing version
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
    import {AUTH_LOGOUT} from "../../stores/actions/auth";

    export default {
        name: "UserProfile",
        computed: {
            profile() {
                return this.$store.getters['user/getProfile']
            },
            isAuthenticated () {
                return this.$store.getters['auth/isAuthenticated']
            }
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
            }
        }
    }
</script>

<style scoped>

</style>