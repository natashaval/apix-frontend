<template>
    <div>
        <!--<b-link to="/admin/new-user">New User</b-link>-->
        <UserCreate></UserCreate>

        <b-table responsive striped hover class="my-2" caption-top
                 :items="users" :fields="fields">
            <template slot="table-caption">User List</template>
        </b-table>

    </div>
</template>

<script>
    import UserCreate from "./UserCreate";
    export default {
        name: "UserViewer",
        components: {UserCreate},
        data: function(){
            return {
                fields: [
                    {
                        key: 'username',
                        sortable: true
                    },
                    {
                        key: 'roles'
                    },
                    {
                        key: 'teams'
                    },
                    {
                        key: 'id'
                    }
                ]

            }
        },
        computed: {
            users() {
                return this.$store.getters['user/getUsers']
            }
        },
        methods: {
            loadUsers(){

            },
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
        },
        created() {
            if (this.users.length == 0) {
                this.$store.dispatch('user/fetchAllUsersData')
                console.log('dispatch user')
            }
            else {
                console.log('already there')
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
        }
    }
</script>

<style scoped>

</style>