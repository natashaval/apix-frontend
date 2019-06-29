<template>
    <div class="container-fluid">
        <!--{{team}}-->
        <!--<div class="row">-->
        <!--<div class="col-md-6">-->

        <div class="row">
            <!--<label class="col-md-2">Team: </label>-->
            <div class="col-md-12 bg-info text-light">
                <!--<input type="text" readonly v-model="team.name" id="create-name" class="form-control-plaintext" />-->
                <p class="font-weight-bold" style="font-size: 1.5em;">
                    <i class="fas fa-users"></i>
                    Team {{team.name}}</p>
            </div>
        </div>
        <div class="form-row">
            <label for="create-division" class="col-md-2">Division: </label>
            <div class="col-md-6">
                <input type="text" readonly v-model="team.division" id="create-division" class="form-control-plaintext" />
            </div>
        </div>
        <div class="form-row">
            <label class="col-md-2">Access: </label>
            <div class="col-md-6">
                <span class="badge badge-primary" v-if="team.access == 'public'">Public</span>
                <span class="badge badge-dark" v-if="team.access == 'private'">Private</span>
            </div>
        </div>
        <div class="form-row">
            <label class="col-md-2">Creator: </label>
            <div class="col-md-6">
                {{team.creator}}&nbsp;&nbsp;&nbsp;<i class="fas fa-user-check" v-if="isCreator"></i>
            </div>
        </div>
        <div class="form-row">
            <label class="col-md-2">Member List: </label>
        </div>

        <div v-if="isCreator">
            <!--<h4>You are creator</h4>-->
            <!--{{selectedMember}}-->
            <div class="row">
                <div class="col-md-12">
                    <!--<ul class="ul-user">-->
                    <!--<li v-for="(user, i) in team.members" :key="i">-->
                    <!--<input type="checkbox"-->
                    <!--:id="user.username" :value="user.username"-->
                    <!--v-show="!user.grant"-->
                    <!--v-model="selectedMember"-->
                    <!--/>-->
                    <!--<label-->
                    <!--:for="user.username">{{user.username}}</label>-->
                    <!--</li>-->
                    <!--</ul>-->
                    <button class="btn btn-success" @click="grant">Grant access</button>
                    <b-form-group>
                        <b-form-checkbox-group v-model="selectedMember" v-for="(user, i) in team.members" :key="i">
                            <li v-if="user.grant" class="ml-4 li-user">{{user.username}}</li>
                            <b-form-checkbox :value="user.username" v-if="!user.grant">
                                {{user.username}}
                            </b-form-checkbox>
                        </b-form-checkbox-group>
                    </b-form-group>
                </div>
            </div>
            <!--<div v-for="(member, i) in team.members" :key="i">-->
            <!--<input type="checkbox" v-if="!member.grant" :value="member.username" v-model="selectedMember"/>-->
            <!--<label :for="member.username">{{member.username}}</label>-->
            <!--</div>-->
        </div>

        <div v-else>
            <!--You are not anything-->
            <li v-for="(member,i) in team.members" :key="i">{{member.username}}</li>
        </div>

        <div class="row">
            <div class="col-md-12 bg-light mb-2">
                <p class="font-weight-bold" style="font-size: 1.5em;">
                    <i class="fas fa-book"></i>
                    Projects</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <ProjectsTable></ProjectsTable>
            </div>
        </div>

    </div>

    <!--<div class="col-md-6 ml-auto" style="background-color: ghostwhite;">-->

    <!--<div class="row">-->
    <!--<div class="col-md-12 bg-primary text-light">-->
    <!--&lt;!&ndash;<input type="text" readonly v-model="team.name" id="create-name" class="form-control-plaintext" />&ndash;&gt;-->
    <!--<p class="font-weight-bold" style="font-size: 1.5em;">-->
    <!--<i class="fas fa-book"></i>-->
    <!--Projects</p>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
</template>

<script>
    import {BASE_URL} from "../../stores/actions/const";
    import axios from 'axios'
    import ProjectsTable from "../projects/projects-components/ProjectsTable";

    export default {
        name: "TeamViewer",
        components: {ProjectsTable},
        data: function () {
            return {
                name: '',
                team: {},
                // isCreator: false,
                selectedMember: []
            }
        },
        computed: {
            profile() {
                return this.$store.getters['user/getProfile']
            },
            isCreator(){
                if (this.team.creator === this.profile.username) return true;
                else return false;
            }

        },
        methods: {
            loadData: function () {
                let p = this.$route.params
                this.name = p.name
                this.loadTeam()
            },
            loadTeam: function(){
                axios.get(BASE_URL + 'teams/' + this.name).then((response) => {
                    this.team = response.data;
                    // (this.team.creator === this.profile.username) ? this.isCreator = true : this.isCreator = false
                })
            },
            grant: function () {
                let members = []
                for (let i=0; i < this.selectedMember.length; i++) {
                    let member = {
                        grant: false,
                        username: this.selectedMember[i]
                    }
                    members.push(member)
                }
                console.log(members)

                axios.put(BASE_URL + 'teams/' + this.team.name, members).then((res) => {
                    this.makeToast('success', res.data.success, res.data.message)
                    this.selectedMember = []
                    this.loadTeam();
                }).catch((e) => {
                    console.error(e);
                })
            },
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            makeToast(variant, success, message){
                this.$bvToast.toast(message, {
                    title: (success) ? 'Success' : 'Failed',
                    variant: variant
                })
            }
        },
        mounted() {
            this.loadData();
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
        }
    }
</script>

<style scoped>
    li{
        list-style-type: none;
    }
    li:before {
        content: '✓';
        padding-right: 2px;
    }
</style>