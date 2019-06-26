<template>
    <div class="col-md-6 offset-md-3 login bg-light shadow-lg">
        <form class="login" @submit.prevent="login">
            <!--<h3 style="text-align: center">Login</h3>-->
            <h4 style="text-align: center">
                <!--<i class="fas fa-fire-alt"></i> -->
                <i class="fas fa-sign-in-alt"></i> Sign In
                <!--<b-spinner v-if="authStatus == 'loading'" small label="Small Spinner"></b-spinner>-->
            </h4>
            <br />
            <div v-if="authStatus == 'loading'" class="text-center">
                <b-spinner v-if="authStatus == 'loading' " small label="Small Spinner"></b-spinner>
            </div>
            <div v-if="authStatus == 'error' ">
                <div class="alert alert-danger">Invalid Username or Password</div>
            </div>
            <label>Username</label>
            <input type="text" v-model="username" class="form-control border-top-0 border-left-0 border-right-0" required/>
            <br />
            <label>Password</label>
            <input type="password" v-model="password" class="form-control" required/>
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
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            login: function () {
                const {username, password} = this
                this.$store.dispatch ('auth/' + AUTH_REQUEST, {username, password})
                    .then(() => {
                        // this.$store.dispatch('user/' + USER_REQUEST)
                        this.$router.push({path: '/projects'})

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
    padding-bottom: 0.1em;
    margin-top: 5em;
    margin-bottom: 5em;
    text-align: justify;
}

input {
    border: 0;
    outline: 0;
    background: transparent;
    border-bottom: 1px solid black;
}
</style>