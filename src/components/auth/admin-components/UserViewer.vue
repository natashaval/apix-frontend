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
<!--                <b-badge pill variant="secondary" v-if="data.value.includes('ROLE_USER')">User</b-badge>-->
                <b-badge pill variant="secondary" v-else>User</b-badge>
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
<!--                                <li>id: {{row.item.id}}</li>-->
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
                    {
                        key: 'actions',
                        label: 'Actions'
                    }
                ]

            }
        },
        computed: {
            users() {
                return this.$store.getters['admin/getUsers']
            }
        },
        methods: {
            makeToast,
            rowAdmin(item, type){
                if(!item) return
                if(item.roles.includes('ROLE_ADMIN')) return 'table-info'
            },
            onDelete(id){
                let idx = this.users.findIndex(x => x.id == id)
                let self = this

                self.$toast.question('Are you sure to delete this user?',
                    'Confirmation', {
                        timeout: 20000,
                        close: false,
                        overlay: true,
                        toastOnce: true,
                        id: 'delete',
                        zindex: 999,
                        position: 'center',
                        buttons: [
                            ['<button><b>Yes</b></button>', (instance, toast) => {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                axios.delete(BASE_URL + '/admin/users/' + id).then((response) => {
                                    self.makeToast('danger', response.data.success, response.data.message)
                                    self.users.splice(idx, 1)
                                }).catch((e) => {
                                    console.error(e);
                                    alert(e.response.data.message);
                                })

                            }, true],
                            ['<button>No</button>', function (instance, toast) {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            }]
                        ]
                    })
            },

        },
        created() {
            if (this.users.length == 0) {
                this.$store.dispatch('admin/fetchAllUsersData')
                console.log('dispatch user')
            }
            else {
                console.log('already there')
            }
        }
    }
</script>

<style scoped>

</style>
