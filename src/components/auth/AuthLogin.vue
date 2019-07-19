<template>
    <div class="col-md-6 offset-md-3 login bg-light shadow-lg">
        <form class="login" @submit.prevent="login">
            <h4 style="text-align: center">
                <i class="fas fa-sign-in-alt"></i> Sign In
            </h4>
            <br />
            <div v-if="authStatus == 'loading'" class="text-center">
                <b-spinner v-if="authStatus == 'loading' " small label="Small Spinner"></b-spinner>
            </div>
            <div v-if="authStatus == 'error' ">
                <div class="alert alert-danger">Invalid Username or Password</div>
            </div>
            <label>Username</label>
            <input type="text" v-model="username" name="username" class="form-control border-top-0 border-left-0 border-right-0" required/>
            <br />
            <label>Password</label>
            <input type="password" v-model="password" name="password" class="form-control" required/>
            <br />
            <button type="submit" class="btn btn-dark btn-lg btn-block">Login</button>
        </form>
    </div>
</template>

<script>
    import {AUTH_REQUEST, AUTH_LOGOUT} from "../../stores/actions/auth";

    export default {
        name: "AuthLogin",
        data: function () {
            return {
                username : "",
                password : ""
            }
        },
        methods: {
            login: function () {
                const {username, password} = this
                this.$store.dispatch ('auth/' + AUTH_REQUEST, {username, password})
                    .then(() => {
                        this.$router.push({path: '/projects'})
                    }, (err) => {
                        console.log('login', err)
                    })
            }
        },
        created() {
            // to reset login status
            this.$store.dispatch('auth/' + AUTH_LOGOUT)
        },
        computed: {
            authStatus() {
                return this.$store.getters['auth/authStatus']
            }
        }
    }
</script>

<style scoped>
.login {
    padding-left: 2em;
    padding-right: 2em;
    padding-top: 0.01em;
    padding-bottom: 0.01em;
    margin-top: 3em;
    margin-bottom: 3em;
    text-align: justify;
}

input {
    border: 0;
    outline: 0;
    background: transparent;
    border-bottom: 1px solid black;
}
</style>