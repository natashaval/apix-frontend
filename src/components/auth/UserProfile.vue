<template>
    <div>
        <!--{{ profile }}-->

        <div>
            <b-media right-align>
                <b-img slot="aside" blank blank-color="#ccc" width="70" rounded="circle" alt="profile picture"></b-img>
                <h4 class="mt-0 mb-1">Hello, </h4>
                <h4 class="font-weight-bold font-italic">{{profile.username}}
                    <span class="badge badge-pill badge-primary mr-2" v-if="profile.roles.includes('ROLE_ADMIN')">Admin</span>
                    <span class="badge badge-pill badge-secondary mr-2" v-if="profile.roles.includes('ROLE_USER')">User</span>
                </h4>

            </b-media>
        </div>
    </div>
</template>

<script>
    import {AUTH_LOGOUT} from "../../stores/actions/auth";

    export default {
        name: "UserProfile",
        data: function(){
            return {
            }
        },
        computed: {
            profile() {
                return this.$store.getters['user/getProfile']
            },
            isAuthenticated () {
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
            },
        }
    }
</script>

<style scoped>

</style>
