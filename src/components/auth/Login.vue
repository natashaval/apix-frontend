<template>
    <div>
        <form class="login" @submit.prevent="login">
            <h1>Login</h1>
            <label>Username</label>
            <input type="text" v-model="username" class="form-control" required/>
            <label>Password</label>
            <input type="password" v-model="password" class="form-control" required/>
            <hr />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
    import {AUTH_REQUEST, AUTH_LOGOUT} from "../../stores/actions/auth";

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
                this.$store.dispatch ('auth/' + AUTH_REQUEST, {username, password})
                    .then(() => {
                        this.$router.push({path: '/sampahlogin'})
                    }, (err) => {
                        console.log('login', err)
                    })

            }
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
        },
        created() {
            // to reset login status
            this.$store.dispatch('auth/' + AUTH_LOGOUT)
        }
    }
</script>

<style scoped>

</style>