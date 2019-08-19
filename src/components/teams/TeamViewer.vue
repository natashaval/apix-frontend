<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4 border-right" style="background-color: ghostwhite;">
                <TeamDetail :team="team" :is-creator="isCreator" :is-edit="isCreator"></TeamDetail>
                <div class="form-row">
                    <label class="col-md-2">Member: </label>
                </div>
                <TeamMember :is-creator="isCreator" :member-list="team.members"></TeamMember>
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
    import {BASE_URL} from "../../stores/consts/url";
    import axios from 'axios'
    import TeamDetail from "./team-components/TeamDetail";
    import {makeToast} from "../../assets/toast";
    import ProjectsTablePagination from "../projects/projects-components/ProjectsTablePagination";
    import TeamMember from "./team-components/TeamMember";

    export default {
        name: "TeamViewer",
        components: {TeamMember, ProjectsTablePagination, TeamDetail},
        data: function () {
            return {
                name: '',
                team: {},
                selectedMember: [],
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
            makeToast,
            loadData: function () {
                let p = this.$route.params
                this.name = p.name
                this.loadTeam()
            },
            loadTeam: function(){
                axios.get(BASE_URL + '/teams/' + this.name).then((response) => {
                    this.team = response.data;
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
</style>
