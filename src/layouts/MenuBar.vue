<template>
    <div class="d-block">
<!--        Is Profile Loaded: {{isProfile}}-->
<!--        is Authenticated: {{isAuthenticated}}-->
        <b-navbar toggleable="lg" type="dark" variant="dark" fixed="top">
            <b-navbar-brand href="#"><i class="fas fa-fire-alt"></i> APIX</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse" class="justify-content-between"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav v-if="isAuthenticated">
                    <b-nav-item :to="{name: 'project-repo'}" name="menu-projects">Projects</b-nav-item>
                    <!--<b-nav-item :to="{name: 'project-server'}" id="menu-server">Server</b-nav-item>-->
                    <b-nav-item :to="{name: 'team-list'}" name="menu-teams">Teams</b-nav-item>
                    <b-nav-item :to="{name:'user-viewer'}" v-if="isAdmin" id="menu-users">Users</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav v-if="isAuthenticated" class="ml-auto px-2">
                    <b-nav-text id="profile-username"><i class="far fa-user-circle"></i> {{profile.username}}</b-nav-text>
                    <b-nav-item id="profile-logout" @click="logout" class="ml-3">Logout</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav v-else-if="!isAuthenticated" class="ml-auto">
                    <b-nav-item id="profile-login" :to="{name: 'auth-login'}">Login</b-nav-item>
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
                return this.$store.getters['auth/isAuthenticated']
            },
            isProfile(){
                return this.$store.getters['user/isProfileLoaded']
            },
            isAdmin(){
                if(typeof this.profile.roles === 'undefined' || !this.isProfile) return false;
                else return this.profile.roles.includes('ROLE_ADMIN') || this.profile.roles.includes('ADMIN');
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
        }
    }
</script>

<style scoped>

</style>