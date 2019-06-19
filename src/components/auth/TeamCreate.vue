<template>
    <div>
        <form class="create-team" @submit.prevent="submit">
        <div class="row">
            <div class="col-md col-sm-1">
                <button type="submit" class="btn btn-outline-info">Submit</button>
            </div>
        </div>
        <div class="row" v-show="response.show">
            <div v-if="response.success">
                <div class="alert alert-primary">{{response.message}}</div>
            </div>
            <div v-else>
                <div class="alert alert-danger">{{response.message}}</div>
                <small v-for="(error, i) in response.errors" :key="i">{{error}}</small>
            </div>
        </div>
        <br />
        <div class="row">
            <div class="col-md-12">
                Name: <input type="text" v-model="name" required />
                Division: <input type="text" v-model="division" />
                Access:
                <select v-model="access">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>
        </div>

        <div class="row">
            Member List:
            <input class="form-control" v-model="searchUser" placeholder="Search member name ..."/>
            <div class="col-12">
                <ul class="ul-user">
                    <li v-for="(user, i) in filterUser" :key="i">
                        <input type="checkbox" :id="user.username" :value="user.username" v-model="selectedMember"/>
                        <label :for="user.username">{{user.username}}</label>
                    </li>
                    <!--<input type="checkbox" id="user.username" value="user.username" v-model="selectedMember" />-->
                </ul>
            </div>
        </div>

        <span>Selected Members: {{selectedMember}}</span>
        </form>
    </div>
</template>

<script>
    import axios from 'axios'
    import {BASE_URL} from "../../stores/actions/const";

    export default {
        name: "TeamCreate",
        data: function(){
            return {
                name: '',
                division: '',
                access: 'public',
                users: [],
                searchUser: '',
                selectedMember: [],
                response: {
                    show: false,
                    success: false,
                    message: '',
                    errors: []
                }
            }
        },
        created(){
            this.loadUsers();
        },
        methods: {
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            loadUsers: function(){
                axios.get(BASE_URL + 'admin/users').then((response) => {
                    this.users = response.data
                }).catch((e) => {
                    console.error(e);
                })
            },
            dump: function () {
                let res = {}
                res.name = this.name
                res.access = this.access
                res.division = this.division
                res.creator = this.profile.username
                console.log(res)

                let members = []
                if (this.access == 'public') {
                    for (let i=0; i < this.selectedMember.length; i++) {
                        let member = {
                            grant: true,
                            username: this.selectedMember[i]
                        }
                        members.push(member)
                    }
                }
                else {
                    for (let i=0; i < this.selectedMember.length; i++) {
                        let member = {
                            grant: false,
                            username: this.selectedMember[i]
                        }
                        members.push(member)
                    }
                }
                res.members = members
                return res
            },
            submit: function () {
                console.log('submit create team')
                let payload = this.dump()
                axios.post(BASE_URL + 'teams', payload).then((res) => {
                    console.log('finish axios post create team')
                    this.response.show = true
                    this.response.success = res.data.success
                    this.response.message = res.data.message
                    if (res.data.errors && res.data.errors.length > 0) this.response.errors = res.data.errors
                })
            }
        },
        computed: {
            filterUser() {
                if (!this.users) return null;
                return this.users.filter(rep => rep.username.toLowerCase().includes(this.searchUser.toLowerCase()));
            },
            profile() {
                return this.$store.getters['user/getProfile']
            },
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
        }
    }
</script>

<style scoped>
ul.ul-user {
    column-count: 3;
    column-gap: 2rem;
    list-style: none;
    text-align: left;
}
</style>