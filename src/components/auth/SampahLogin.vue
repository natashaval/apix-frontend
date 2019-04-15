<template>
    <div>
        <h1>INI HABIS DARI LOGIN</h1>
        <span v-if="isAuthenticated">{{profile.username}} | <a @click="logout">Logout</a> </span>
        <h2>This page is protected by auth</h2>
        <a href="https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex">Sctoch.io</a>

        {{ profile }}
    </div>
</template>

<script>
    import {AUTH_LOGOUT} from "../../stores/actions/auth";

    export default {
        name: "SampahLogin",
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