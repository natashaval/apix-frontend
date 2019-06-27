<template>
    <div class="d-block">
<!--        Is Profile Loaded: {{isProfile}}-->
<!--        is Authenticated: {{isAuthenticated}}-->
        <b-navbar toggleable="lg" type="dark" variant="dark" fixed="top">
            <b-navbar-brand href="#"><i class="fas fa-fire-alt"></i> APIX</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse" class="justify-content-between"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav v-if="isAuthenticated">
                    <b-nav-item :to="{name: 'project-repo'}">Projects</b-nav-item>
                    <b-nav-item to="/admin/users" v-if="isAdmin">User Management</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav v-if="isAuthenticated" class="ml-auto px-2">
                    <b-nav-item :to="{name: 'user-profile'}">{{profile.username}}</b-nav-item>
                    <b-nav-item @click="logout">Logout</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav v-else-if="!isAuthenticated" class="ml-auto">
                    <b-nav-item :to="{name: 'auth-login'}">Login</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>

<!--        <nav class="nav navbar-expand-lg navbar-light bg-dark">-->
<!--            <a class="navbar-brand" href="#"><i class="fas fa-fire-alt"></i> APIX</a>-->

<!--            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"-->
<!--                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">-->
<!--                <span class="navbar-toggler-icon"></span>-->
<!--            </button>-->
<!--            <div class="collapse navbar-collapse" id="navbarNav">-->
<!--                <ul class="navbar-nav mr-auto text-white" v-if="isAuthenticated">-->
<!--                    <li class="nav-item">-->

<!--                    </li>-->
<!--                    <li class="nav-item my-2 my-lg-0">-->
<!--                        <a class="nav-link" href="/user/profile">{{profile.username}}</a>-->
<!--                    </li>-->

<!--                </ul>-->

<!--                <ul class="navbar-nav ml-auto" v-else>-->
<!--                    <li class="nav-item">-->
<!--                        <a class="nav-link" href="/login"> Login</a>-->
<!--                    </li>-->
<!--                </ul>-->
<!--            </div>-->
<!--        </nav>-->
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