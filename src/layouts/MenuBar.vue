<template>
    <div>
        Is Profile Loaded: {{isProfile}}
        is Authenticated: {{isAuthenticated}}

        <b-navbar toggleable="lg" type="light" variant="light">
            <b-navbar-brand href="#">APIX</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse" class="justify-content-between"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav v-if="isAuthenticated">
                    <b-nav-item :to="{name: 'project-repo'}">Projects</b-nav-item>
                    <b-nav-item href="#" v-if="isAdmin">User Management</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav v-if="isAuthenticated" class="ml-auto">
                    <b-nav-item :to="{name: 'user-profile'}">{{profile.username}}</b-nav-item>
                    <b-nav-item @click="logout">Logout</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav v-else-if="!isAuthenticated" class="ml-auto">
                    <b-nav-item href="#">Login</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
    import {AUTH_LOGOUT} from "../stores/actions/auth";
    import {USER_REQUEST} from "../stores/actions/user";

    export default {
        name: "MenuBar",
        computed: {
            profile() {
                if (!this.isProfile) {
                    this.$store.dispatch('user/' + USER_REQUEST)
                    // return undefined;
                }
                return this.$store.getters['user/getProfile']
            },
            isAuthenticated () {
                console.log(this.$store.getters['auth/isAuthenticated'])
                return this.$store.getters['auth/isAuthenticated']
            },
            isProfile(){
                return this.$store.getters['user/isProfileLoaded']
            },
            isAdmin(){
                if(typeof this.profile.roles === 'undefined' || !this.isProfile) return false;
                else return this.profile.roles.includes('ROLE_ADMIN');
            }
        },
        methods: {
            logout: function () {
                this.$store.dispatch('auth/' + AUTH_LOGOUT).then(() => {
                    this.$router.push({path: '/login'});
                }, (err) => {
                    console.log('login', err)
                })
            }
        },
        /*
        watch: {
            isProfile() {
                    if(!this.isProfile()) this.$store.dispatch('user/' + USER_REQUEST)
            }
        }
        */

    }
</script>

<style scoped>

</style>