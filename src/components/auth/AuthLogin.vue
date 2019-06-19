<template>
    <div class="col-md-6 offset-md-3">
        <form class="login" @submit.prevent="login">
            <h1>Login</h1>
            <div v-if="authStatus == 'loading' ">
                <b-spinner small label="Small Spinner"></b-spinner>
            </div>
            <div v-if="authStatus == 'error' ">
                <div class="alert alert-danger">Invalid Username or Password</div>
            </div>
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

</style>