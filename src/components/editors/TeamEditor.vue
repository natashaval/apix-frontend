<template>
    <div>
        <div class="row mb-3">
            <div class="col-11 ml-3" style="background-color: ghostwhite;">
                <h4>Project Owner</h4>
                <TeamDetail :team="projectOwnerData"></TeamDetail>
            </div>
        </div>
        <hr />
        <div class="row my-3">
            <div class="col-12 ml-3" v-if="profile.username === projectOwnerData.creator">
            <AssignComponent :assign-new="false"
                             :project-id="projectId"></AssignComponent>
            </div>
        </div>
        <div class="row">
            <div class="col-12 ml-3">
                <h4>Teams in Project</h4>
                <ul class="list-group col-4">
                    <li class="list-group-item" v-for="(name, i) in teamData" :key="i"
                        :class="(name === projectOwnerData.name) ? 'active' : ''">
                        {{name}}
                        <button class="btn-circle float-right" v-if="name !== projectOwnerData.name && profile.username === projectOwnerData.creator"
                                @click="unassignTeam(name)"
                        >
                            <i class="fas fa-times"></i>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {BASE_PROJECT_URL} from "../../stores/consts/url";
    import axios from 'axios';
    import {makeToast} from "../../assets/toast";
    import TeamDetail from "../teams/team-components/TeamDetail";
    import AssignComponent from "./editor-components/AssignComponent";

    export default {
        name: "TeamEditor",
        components: {AssignComponent, TeamDetail},
        data: function () {
            return {
                projectId: ''
            }
        },
        computed: {
            teamData(){
                return this.$store.getters['project/getTeams']
            },
            projectOwnerData(){
                return this.$store.getters['project/getProjectOwner']
            },
            profile() {
                return this.$store.getters['user/getProfile']
            },
        },
        methods: {
            makeToast,
            loadData: function () {
                let p = this.$route.params
                this.projectId = p.projectId
            },
            unassignTeam: function(teamName) {
                let idx = this.teamData.findIndex(x => x == teamName)
                console.log(idx)
                let self = this

                self.$toast.question('Are you sure to remove team "' + teamName + '" from project?',
                    'Remove', {
                        timeout: 20000,
                        overlay: true,
                        toastOnce: true,
                        id: 'delete',
                        zindex: 999,
                        position: 'center',
                        buttons: [
                            ['<button><b>Yes</b></button>', (instance, toast) => {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                                axios.post(BASE_PROJECT_URL +'/'+ this.projectId + '/assign', {
                                    assignType: 'ungrant',
                                    teamName: teamName
                                })
                                    .then((response) => {
                                        self.makeToast('success', response.data.success, response.data.message)
                                        self.teamData.splice(idx,1)
                                    })
                                    .catch((e) => {
                                        console.error(e);
                                        self.makeToast('danger', e.response.data.success, e.response.data.message)
                                    })

                            }, true],
                            ['<button>No</button>', function (instance, toast) {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            }]
                        ]
                    })




            }
        },
        watch: {
            $route: function () {
                this.loadData();
            }
        },
        mounted() {
            this.loadData();
        }
    }
</script>

<style scoped>

</style>