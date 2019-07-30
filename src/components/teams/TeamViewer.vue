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
                        <div class="col-md-8">
                            <div class="input-group my-2">
                                <input class="form-control" type="text"
                                       v-model="searchMember" placeholder="Search member name ..."/>
                                <div class="input-group-append">
                                    <span class="input-group-text"><i class="fa fa-search"></i> </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <b-button class="btn btn-info" :to="{name: 'team-create', params: {isInvite: true, teamInvite: team}}">
                                Invite Member</b-button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 column-3">
                            <ul v-for="(user, i) in filterMember" :key="i" class="fa-ul mb-0">
                                <!--https://fontawesome.com/how-to-use/on-the-web/styling/icons-in-a-list-->
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
                <ProjectsTablePagination v-if="team.name" :team="team.name"></ProjectsTablePagination>
                <!--                    </div>-->
                <!--                </div>-->
                <!--                <div class="row">-->
                <!--                    <div class="col-md-12">-->
                <!--                        <ProjectsTable :team="team.name"></ProjectsTable>-->
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
    import {makeToast} from "../../assets/toast";
    import ProjectsTablePagination from "../projects/projects-components/ProjectsTablePagination";

    export default {
        name: "TeamViewer",
        components: {ProjectsTablePagination, TeamDetail, ProjectsTable},
        data: function () {
            return {
                name: '',
                team: {},
                // isCreator: false,
                selectedMember: [],
                searchMember: ''
            }
        },
        computed: {
            profile() {
                return this.$store.getters['user/getProfile']
            },
            isCreator(){
                if (this.team.creator === this.profile.username) return true;
                else return false;
            },
            filterMember() {
                if (this.searchMember == '') return this.team.members
                else return this.team.members.filter(u => u.username.toLowerCase().includes(this.searchMember.toLowerCase()))
            }

        },
        methods: {
            makeToast,
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

    .column-3 {
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
        column-gap: 2em;
    }

</style>
