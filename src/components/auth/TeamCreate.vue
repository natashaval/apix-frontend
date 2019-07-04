<template>
    <div>
        <div class="row mb-3">
            <div class="col-md-1 ">
                <b-button v-if="isInvite" :to="{name: 'team-viewer', params: {name: teamInvite.name }}">
                    <i class="fas fa-angle-left"></i> Back</b-button>
                <b-button v-else variant="outline-info" :to="{name: 'user-profile'}">
                    <i class="fas fa-angle-left"></i> Back
                </b-button>
            </div>
            <div class="col-md-6 mx-0">
                <div v-if="isInvite">
                    <h3>Invite Members of <span class="font-italic">{{ teamInvite.name }}</span></h3>
                </div>
                <div v-else>
                    <h3>Create Team</h3>
                </div>
            </div>
        </div>

        <form id="create-team" @submit.prevent="submit" @reset="reset" v-if="show">
            <!--div class="row" v-show="response.show">
                <div v-if="response.success">
                    <div class="alert alert-primary">{{response.message}}</div>
                </div>
                <div v-else>
                    <div class="alert alert-danger">{{response.message}}</div>
                    <small v-for="(error, i) in response.errors" :key="i">{{error}}</small>
                </div>
            </div>
            <br /-->
            <div class="form-row">
                <div class="form-group col-md-5 mb-2">
                    <label for="create-name">Name: </label>
                    <input v-if="isInvite" type="text" class="form-control" :placeholder="teamInvite.name" readonly />
                    <input v-else type="text" class="form-control" v-model="name" id="create-name" required />
                </div>
                <div class="form-group col-md-3 mb-2">
                    <label for="create-division">Division: </label>
                    <input v-if="isInvite" type="text" class="form-control" :placeholder="teamInvite.division" readonly/>
                    <input v-else type="text" v-model="division" id="create-division" class="form-control" />
                </div>
                <div class="form-group col-md-2 mb-2">
                    <label for="create-access">Access: </label>
                    <input v-if="isInvite" type="text" class="form-control" :placeholder="teamInvite.access" readonly/>
                    <select v-else v-model="access" id="create-access" class="form-control">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div class="form-group col-md-1 mb-2">
                    <label for="create-submit" class="invisible">Submit</label>
                    <button type="submit" id="create-submit"
                            class="btn btn-info btn-block">Submit</button>
                </div>
                <div class="form-group col-md-1 mb-2">
                    <label for="create-submit" class="invisible">Reset</label>
                    <button type="reset" id="create-reset"
                            class="btn btn-outline-danger btn-block">Reset</button>
                </div>

            </div>

            <div class="form-row">
                <label>Member List: </label>
                <div class="input-group mb-2">
                    <input class="form-control" type="text"
                       v-model="searchUser" placeholder="Search member name ..."/>
                    <div class="input-group-append">
                        <span class="input-group-text"><i class="fa fa-search"></i> </span>
                    </div>
                </div>
                <div class="col-md-12 custom-control custom-checkbox">
                    <ul class="ul-user">
                        <li v-for="(user, i) in filterUser" :key="i">
                            <input type="checkbox" class="custom-control-input"
                                   :id="user.username" :value="user.username"
                                   v-model="selectedMember" />
                            <label class="custom-control-label"
                                    :for="user.username">{{user.username}}</label>
                        </li>
                    </ul>
                </div>
            </div>
            <!--<span>Selected Members: {{selectedMember}}</span>-->
        </form>
    </div>
</template>

<script>
    import axios from 'axios'
    import {BASE_URL} from "../../stores/actions/const";
    import {makeToast} from "../../assets/toast.js"

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
                },
                show: true
            }
        },
        props: {
            isInvite: Boolean,
            teamInvite: Object
        },
        created(){
            this.loadUsers();
        },
        methods: {
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            makeToast,
            loadUsers: function(){
                axios.get(BASE_URL + 'admin/users').then((response) => {
                    this.users = response.data
                }).catch((e) => {
                    console.error(e);
                })
            },
            dump: function () {
                let res = {}
                if (!this.isInvite) {
                    res.name = this.name
                    res.access = this.access
                    res.division = this.division
                    res.creator = this.profile.username
                    console.log(res)

                    let members = []
                    members.push({ // add creator as member
                        grant: true,
                        username: this.profile.username
                    })

                    if (this.access == 'public') {
                        for (let i = 0; i < this.selectedMember.length; i++) {
                            let member = {
                                grant: true,
                                username: this.selectedMember[i]
                            }
                            members.push(member)
                        }
                    } else {
                        for (let i = 0; i < this.selectedMember.length; i++) {
                            let member = {
                                grant: false,
                                username: this.selectedMember[i]
                            }
                            members.push(member)
                        }
                    }
                    res.members = members
                    return res
                }
                else {
                    res.name = this.teamInvite.name
                    res.access = this.teamInvite.access
                    res.division = this.teamInvite.division
                    res.creator = this.teamInvite.creator

                    let members = []
                    for (let i=0; i < this.selectedMember.length; i++) {
                        let member =  {
                            username: this.selectedMember[i],
                            grant: false
                        }
                        members.push(member)
                    }
                    res.members = members
                    return res
                }
            },
            submit: function () {
                let payload = this.dump()
                if (!this.isInvite) {
                    axios.post(BASE_URL + 'teams', payload).then((res) => {
                        // this.response.show = true
                        // this.response.success = res.data.success
                        // this.response.message = res.data.message
                        // if (res.data.errors && res.data.errors.length > 0) this.response.errors = res.data.errors
                        this.makeToast('success', res.data.success, res.data.message)
                        // this.reset();
                    }).catch((e) => {
                        console.error(e)
                        this.makeToast('danger', e.response.data.success, e.response.data.message)
                    })
                }
                else {
                    // console.log(payload);

                    axios.put(BASE_URL + 'teams', payload).then((res) => {
                        this.makeToast('success', res.data.success, res.data.message)
                    }).catch((e) => {
                        console.error(e)
                        this.makeToast('danger', e.response.data.success, e.response.data.message)
                    })
                }
            },
            reset: function(evt){
                evt.preventDefault();
                this.name = ''
                this.division = ''
                this.access = 'public'
                this.searchUser = ''
                this.selectedMember = []

                this.show = false
                // reset validation state
                this.$nextTick(() => {
                    this.show = true
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