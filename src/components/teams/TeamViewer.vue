<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4 border-right" style="background-color: ghostwhite;">
                <TeamDetail :team="team" :is-creator="isCreator" :is-edit="true"></TeamDetail>
                <div class="form-row">
                    <label class="col-md-2">Member: </label>
                </div>
                <div v-if="isCreator">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="input-group my-2">
                                <input class="form-control" type="text"
                                       v-model="searchMember" placeholder="Search member name ..."/>
                                <div class="input-group-append">
                                    <span class="input-group-text"><i class="fa fa-search"></i> </span>
                                </div>
                            </div>
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
                    <div class="row">
                        <div class="col-md-12">
                            <div class="input-group my-2">
                                <input class="form-control" type="text"
                                       v-model="searchMember" placeholder="Search member name ..."/>
                                <div class="input-group-append">
                                    <span class="input-group-text"><i class="fa fa-search"></i> </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 column-3">
                            <ul v-for="(member,i) in filterMember" :key="i">
                                <li v-if="member.grant">{{member.username}}</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-md-8">
                <p class="font-weight-bold" style="font-size: 1.5em;">
                    <i class="fas fa-book"></i>
                    Projects</p>
                <ProjectsTablePagination v-if="team.name" :team="team.name"></ProjectsTablePagination>
            </div>

        </div>
    </div>

</template>

<script>
    import {BASE_URL} from "../../stores/actions/const";
    import axios from 'axios'
    import TeamDetail from "./team-components/TeamDetail";
    import {makeToast} from "../../assets/toast";
    import ProjectsTablePagination from "../projects/projects-components/ProjectsTablePagination";

    export default {
        name: "TeamViewer",
        components: {ProjectsTablePagination, TeamDetail},
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
            routeInvite: function (team) {
                this.$router.push({
                    name: 'team-create', params: {isInvite: true, teamInvite: team}
                })
            },
            routeRemove: function (team) {
                this.$router.push({
                    name: 'team-create', params: {isRemove: true, teamInvite: team}
                })
            }
        },
        mounted() {
            this.loadData();
        }
    }
</script>

<style scoped>
    .column-3 {
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
        column-gap: 2em;
    }

</style>
