<template>
    <div>
        <div class="row">
            <div class="col-md-10" v-if="team.name">
                <p class="font-weight-bold" style="font-size: 1.5em;" name="team-name">
                    <i class="fas fa-users"></i>
                    Team {{team.name}}</p>
            </div>
            <div class="col-md-2 float-right">
                <b-dropdown size="sm" right text="Right align" variant="light" toggle-class="text-decoration-none" no-caret>
                    <template slot="button-content"><i class="fas fa-ellipsis-h"></i></template>
                    <b-dropdown-item @click="routeInvite(team)"><i class="fas fa-user-plus"></i> Invite Member</b-dropdown-item>
                    <b-dropdown-item @click="routeRemove(team)"><i class="fas fa-user-alt-slash"></i> Remove Member</b-dropdown-item>
                    <b-dropdown-item @click="deleteTeam(team)"><i class="fas fa-user-times"></i> Delete Team</b-dropdown-item>
                </b-dropdown>
            </div>
        </div>
        <div class="form-row">
            <label class="col-md-2">Access: </label>
            <div class="col-md-6" v-if="team.access">
                <span class="badge badge-primary" v-if="team.access == 'public' || team.access == 'PUBLIC'" name="team-access-public">Public</span>
                <span class="badge badge-dark" v-if="team.access == 'private' || team.access == 'PRIVATE'" name="team-access-private">Private</span>
            </div>
        </div>
        <div class="form-row">
            <label class="col-md-2">Creator: </label>
            <div class="col-md-6" v-if="team.creator">
                <p name="team-creator">{{team.creator}}&nbsp;&nbsp;&nbsp;
                    <span><i class="fas fa-user-check" v-if="isCreator" name="is-creator"></i></span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {BASE_URL} from "../../../stores/actions/const";
    import axios from "axios";
    import {makeToast} from "../../../assets/toast";

    export default {
        name: "TeamDetail",
        props: {
            team: Object,
            isCreator: Boolean
        },
        methods: {
            makeToast,
            routeInvite: function (team) {
                this.$router.push({
                    name: 'team-create', params: {isInvite: true, teamInvite: team}
                })
            },
            routeRemove: function (team) {
                this.$router.push({
                    name: 'team-create', params: {isRemove: true, teamInvite: team}
                })
            },
            deleteTeam: function(team) {
                let self = this
                this.$toast.error('Please re-type this team name', 'Delete', {
                    timeout: 20000,
                    close: true,
                    drag: false,
                    overlay: true,
                    toastOnce: true,
                    id: 'delete',
                    zindex: 999,
                    position: 'center',
                    inputs: [
                        ['<input type="text" />', 'change', function(instance, toast, input, e) {
                            console.log(input.value)
                            // this.projectTitleVerify = input.value
                        }, true],
                    ],
                    buttons: [
                        ['<button class="btn btn-sm btn-outline-danger ml-1">Delete</button>', function (instance, toast, button, e, inputs) {
                            if (inputs[0].value === team.name){
                                axios.delete(BASE_URL + '/teams/' + team.name).then((response) => {
                                    self.makeToast('success', response.data.success, response.data.message)
                                    setTimeout(() => {
                                        self.$router.push({
                                            name :'team-list',
                                        })
                                    }, 1500);
                                }).catch((e) => {
                                    self.makeToast('danger', e.response.data.success, e.response.data.message)
                                })
                            }
                            else {
                                self.makeToast('warning', false, 'Wrong team name!')
                            }
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                        }, false]
                    ]
                })
            }
        }
    }
</script>

<style scoped>

</style>