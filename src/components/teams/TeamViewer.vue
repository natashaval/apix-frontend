<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4 border-right" style="background-color: ghostwhite;">
                <TeamDetail :team="team" :is-creator="isCreator"></TeamDetail>
                <div class="form-row">
                    <label class="col-md-2">Member: </label>
                </div>

                <div v-if="isCreator">
                    <div class="row">
                        <!--                <div class="col-md-6">-->
                        <!--                    <button class="btn btn-success" @click="grant">Grant access</button>-->
                        <!--                    <b-form-group>-->
                        <!--                        <b-form-checkbox-group v-model="selectedMember" v-for="(user, i) in team.members" :key="i">-->
                        <!--                            <li v-if="user.grant" class="ml-4 li-creator">{{user.username}}</li>-->
                        <!--                            <b-form-checkbox :value="user.username" v-if="!user.grant">-->
                        <!--                                {{user.username}}-->
                        <!--                            </b-form-checkbox>-->
                        <!--                        </b-form-checkbox-group>-->
                        <!--                    </b-form-group>-->
                        <!--                </div>-->
                        <div class="col-md-6">
                            <b-button class="btn btn-info" :to="{name: 'team-create', params: {isInvite: true, teamInvite: team}}">
                                Invite Member</b-button>
                            <ul v-for="(user, i) in team.members" :key="i" class="fa-ul mb-0">
                                <!--                    https://fontawesome.com/how-to-use/on-the-web/styling/icons-in-a-list-->
                                <li v-if="user.grant"><span class="fa-li"><i class="fas fa-check-square"></i></span> {{user.username}}</li>
                                <li v-if="!user.grant"><span class="fa-li"><i class="far fa-square"></i></span> {{user.username}}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <!--You are not anything-->
                    <li v-for="(member,i) in team.members" :key="i" class="ml-4 li-member">{{member.username}}</li>
                </div>
            </div>

            <div class="col-md-8">
<!--                <div class="row">-->
<!--                    <div class="col-md-12 mb-2">-->
                        <p class="font-weight-bold" style="font-size: 1.5em;">
                            <i class="fas fa-book"></i>
                            Projects</p>
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="row">-->
<!--                    <div class="col-md-12">-->
                        <ProjectsTable :team="team.name"></ProjectsTable>
<!--                    </div>-->
<!--                </div>-->
            </div>

        </div>
    </div>

</template>

<script>
    import {BASE_URL} from "../../stores/actions/const";
    import axios from 'axios'
    import ProjectsTable from "../projects/projects-components/ProjectsTable";
    import TeamDetail from "./team-components/TeamDetail";

    export default {
        name: "TeamViewer",
        components: {TeamDetail, ProjectsTable},
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
                axios.get(BASE_URL + '/teams/' + this.name).then((response) => {
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

                axios.put(BASE_URL + '/teams/' + this.team.name, members).then((res) => {
                    this.makeToast('success', res.data.success, res.data.message)
                    this.selectedMember = []
                    this.loadTeam();
                }).catch((e) => {
                    console.error(e);
                    this.makeToast('danger', e.response.data.success, e.response.data.message)
                })
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
        }
    }
</script>

<style scoped>
    /*li{*/
    /*    list-style-type: none;*/
    /*}*/
    /*li:before {*/
    /*    content: '✓';*/
    /*    padding-right: 2px;*/
    /*}*/

</style>
