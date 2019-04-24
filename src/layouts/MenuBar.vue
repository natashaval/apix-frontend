<template>
    <div>
        <b-navbar toggleable="lg" type="light" variant="light">
            <b-navbar-brand href="#">APIX</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse" class="justify-content-between"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav v-if="isAuthenticated">
                    <b-nav-item :to="{name: 'project-repo'}">Projects</b-nav-item>
                    <b-nav-item href="#" v-if="profile.roles.includes('ROLE_ADMIN')">User Management</b-nav-item>
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

    export default {
        name: "MenuBar",
        computed: {
            profile() {
                return this.$store.getters['user/getProfile']
            },
            isAuthenticated () {
                console.log(this.$store.getters['auth/isAuthenticated'])
                return this.$store.getters['auth/isAuthenticated']
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