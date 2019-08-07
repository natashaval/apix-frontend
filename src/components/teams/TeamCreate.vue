<template>
    <div>
        <div class="row mb-3">
            <div class="">
                <b-button v-if="isInvite || isRemove" :to="{name: 'team-viewer', params: {name: teamInvite.name }}" size="sm" variant="outline-secondary">
                    <i class="fas fa-angle-left"></i> Back</b-button>
                <b-button v-else :to="{name: 'team-list'}" size="sm" variant="outline-secondary">
                    <i class="fas fa-angle-left"></i> Back
                </b-button>
            </div>

            <div class="col-md-11 mt-2">
                <form id="create-team" @submit.prevent="submit" @reset="reset" v-if="show">
                    <div class="row">
                        <div class="col-md-6 col-sm-4">
                            <div v-if="isInvite">
                                <h3>Invite Members of <span class="font-italic">{{ teamInvite.name }}</span></h3>
                            </div>
                            <div v-else-if="isRemove">
                                <h3>Remove Members from <span class="font-italic">{{ teamInvite.name }}</span></h3>
                            </div>
                            <div v-else>
                                <h3>Create Team</h3>
                            </div>
                        </div>
                        <div class="col-md-1 mb-2">
                            <button type="submit" id="create-submit"
                                    class="btn btn-info">Submit</button>
                        </div>
                        <div class="col-md-1 mb-2">
                            <!--                    <label for="create-submit" class="invisible">Reset</label>-->
                            <button type="reset" id="create-reset"
                                    class="btn btn-outline-secondary">Reset</button>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6 mb-2">
                            <label for="create-name">Name: </label>
                            <input v-if="isInvite || isRemove" type="text" class="form-control" :placeholder="teamInvite.name" readonly />
                            <input v-else type="text" class="form-control" v-model="name" id="create-name" required />
                        </div>
                        <div class="form-group col-md-2 mb-2">
                            <label for="create-access">Access: </label>
                            <input v-if="isInvite || isRemove" type="text" class="form-control" :placeholder="teamInvite.access.toLowerCase()" readonly/>
                            <select v-else v-model="access" id="create-access" class="form-control">
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <label>Member List: </label>
                        <div class="input-group mb-2 form-row">
                            <input class="form-control col-md-8 ml-2" type="text"
                                   v-model="searchUser" placeholder="Search member name ..."/>
                            <div class="input-group-append">
                                <span class="input-group-text"><i class="fa fa-search"></i> </span>
                            </div>
                        </div>
                        <div class="col-md-12 custom-control custom-checkbox">
                            <ul class="ul-user">
                                <li v-for="(username, i) in filterUser" :key="i">
                                    <input type="checkbox" class="custom-control-input"
                                           :id="username" :value="username"
                                           v-model="selectedMember" />
                                    <label class="custom-control-label"
                                           :for="username">{{username}}</label>
                                </li>
                            </ul>
                        </div>
                    </div>
<!--                    <span>Selected Members: {{selectedMember}}</span>-->
                </form>
            </div>
        </div>
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
                access: 'PUBLIC',
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
            teamInvite: Object,
            isInvite: Boolean,
            isRemove: Boolean
        },
        computed: {
            filterUser() {
                if (!this.users) return null;
                let filterUser = this.dump()
                return filterUser.filter(rep => rep.toLowerCase().includes(this.searchUser.toLowerCase()))
            },
            profile() {
                return this.$store.getters['user/getProfile']
            },
        },
        methods: {
            makeToast,
            loadUsers: function(){
                axios.get(BASE_URL + '/admin/users').then((response) => {
                    this.users = response.data
                }).catch((e) => {
                    console.error(e);
                })
            },
            createPayload: function () {
                let res = {}
                if (this.isInvite || this.isRemove ) {
                    res.teamName = this.teamInvite.name
                    res.members = this.selectedMember
                    res.invite = false
                    return res
                }
                else {
                    res.teamName = this.name
                    res.access = this.access
                    res.creator = this.profile.username
                    res.members = this.selectedMember
                    return res
                }
            },
            submit: function () {
                let payload = this.createPayload()
                if (this.isInvite) { // invite members to team
                    console.log('invite', payload);
                    axios.put(BASE_URL + '/teams/' + payload.teamName + '/invite', payload).then((res) => {
                        this.makeToast('success', res.data.success, res.data.message)
                        for (let i = 0; i < payload.members.length; i++) {
                            this.teamInvite.members.push({
                                username: payload.members[i],
                                grant: false
                            })
                        }
                        setTimeout(() => {
                            console.log('habis invite', this.teamInvite);
                            this.selectedMember = []
                        }, 1000);
                    }).catch((e) => {
                        console.error(e)
                        this.makeToast('danger', e.response.data.success, e.response.data.message)
                    })
                }
                else if (this.isRemove) { // remove members from team
                    console.log('remove', payload);
                    axios.put(BASE_URL + '/teams/' + payload.teamName + '/remove', payload).then((res) => {
                        this.makeToast('success', res.data.success, res.data.message)
                        let membersArray = this.teamInvite.members
                        for (let i = 0; i < payload.members.length; i++) {
                            membersArray.splice(membersArray.findIndex(u => u.username === payload.members[i]), 1)
                        }
                        setTimeout(() => {
                            console.log('habis remove apakah berhasil', this.teamInvite);
                            this.selectedMember = []
                        }, 1000);
                    }).catch((e) => {
                        console.error(e)
                        this.makeToast('danger', e.response.data.success, e.response.data.message)
                    })
                }
                else { //create new team
                    axios.post(BASE_URL + '/teams', payload).then((res) => {
                        this.makeToast('success', res.data.success, res.data.message)
                        // this.reset();
                    }).catch((e) => {
                        console.error(e)
                        this.makeToast('danger', e.response.data.success, e.response.data.message)
                    })
                }
                return payload
            },
            reset: function(evt){
                evt.preventDefault();
                this.name = ''
                this.access = 'PUBLIC'
                this.searchUser = ''
                this.selectedMember = []

                this.show = false
                // reset validation state
                this.$nextTick(() => {
                    this.show = true
                })
            },
            dump: function () {
                // evt.preventDefault()
                let userList = this.users.map(user => user.username)
                var idxCreator = userList.indexOf(this.profile.username)
                if (idxCreator !== -1) userList.splice(idxCreator, 1);
                if (this.isInvite && this.teamInvite) {
                    let memberList = this.teamInvite.members.map(member => member.username)
                    let res = userList.filter(x => !memberList.includes(x))
                    return res
                }
                if (this.isRemove && this.teamInvite){
                    let memberList = this.teamInvite.members.map(member => member.username)
                    memberList.splice(memberList.indexOf(this.profile.username), 1)
                    return memberList
                }
                return userList
            }
        },
        created(){
            this.loadUsers();
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
