<template>
    <div>
        <form class="login" @submit.prevent="login">
            <h1>Login</h1>
            <label>Username</label>
            <input required type="text" v-model="username" />
            <label>Password</label>
            <input required type="password" v-model="password" />
            <hr />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
    import {AUTH_REQUEST} from "../../stores/actions/auth";

    export default {
        name: "Login",
        data: function () {
            return {
                username : "",
                password : ""
            }
        },
        methods: {
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            login: function () {
                const {username, password} = this
                this.$store.dispatch ('auth/AUTH_REQUEST', {username, password})
                    .then(() => {
                        this.$router.push({path: '/sampahlogin'})
                    })

            }
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
        }
    }
</script>

<style scoped>

</style>