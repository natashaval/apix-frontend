<template>
    <div>
        <!--<b-link to="/admin/new-user">New User</b-link>-->
        <UserCreate></UserCreate>

        <b-table responsive striped hover class="my-2" caption-top
                 :items="users" :fields="fields" primary-key="users.id"
                 head-variant="dark"
                 :tbody-tr-class="rowAdmin"
        >
            <template slot="table-caption">User List</template>
            <template slot="roles" slot-scope="data">
<!--                {{ // (data.value.includes('ROLE_ADMIN') ? 'Admin' : 'User Biasa') }}-->
                <b-badge pill variant="primary" v-if="data.value.includes('ROLE_ADMIN')" class="mr-2">Admin</b-badge>
                <b-badge pill variant="secondary" v-if="data.value.includes('ROLE_USER')">User</b-badge>
            </template>
            <template slot="actions" slot-scope="row">
                <b-button size="sm" @click="row.toggleDetails">
                    {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                </b-button>
            </template>

            <template slot="row-details" slot-scope="row">
                <b-card>
                    <b-row>
                        <b-col md="10">
                            <ul>
<!--                                <li v-for="(valuekey) in row.item" :key="key"> {{key}}: {{value}}</li>-->
                                <li>id: {{row.item.id}}</li>
                                <li>username: {{row.item.username}}</li>
                                <li>roles: {{row.item.roles}}</li>
                                <li>teams: {{row.item.teams}}</li>
                            </ul>
                        </b-col>
                        <b-col md="2">
                            <b-button variant="outline-danger" @click="onDelete(row.item.id)">Delete user?</b-button>
                        </b-col>
                    </b-row>
                </b-card>
            </template>
        </b-table>

    </div>
</template>

<script>
    import UserCreate from "./UserCreate";
    import {BASE_URL} from "../../../stores/actions/const";
    import axios from 'axios';
    import {makeToast} from "../../../assets/toast";

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
                    // {
                    //     key: 'teams'
                    // },
                    {
                        key: 'actions',
                        label: 'Actions'
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
            makeToast,
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            rowAdmin(item, type){
                if(!item) return
                if(item.roles.includes('ROLE_ADMIN')) return 'table-info'
            },
            onDelete(id){
                // console.log(id);
                let idx = this.users.findIndex(x => x.id == id)
                console.log(id, idx);
                axios.delete(BASE_URL + '/admin/users/' + id).then((response) => {
                    this.makeToast('danger', response.data.success, response.data.message)
                    this.users.splice(idx, 1)
                }).catch((e) => {
                    console.error(e);
                })
                // console.log(this.users)
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
