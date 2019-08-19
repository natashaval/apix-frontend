<template>
    <div>
        <div v-for="team in teams" :key="team.id">
            <b-card class="mb-2 team-header" no-body
                    :header-bg-variant="(team.creator == profile.username) ? 'info' : 'light'"
            >
                <h5 slot="header" class="mb-0 team-title"
                    :class="(team.creator == profile.username) ? 'text-white' : ''"
                    @click="viewTeam(team.name)">{{team.name}}</h5>
                <b-card-body class="m-0">
                    <b-card-text>
                        Owner: {{team.creator}}
                    </b-card-text>
                </b-card-body>
                <button slot="footer" class="btn btn-primary confirm-team" v-if="!isGrant"
                        @click="confirm(team.name)">Confirm</button>
            </b-card>
        </div>
    </div>
</template>

<script>
    import {BASE_URL} from "@/stores/consts/url";
    import axios from 'axios'
    import {makeToast} from "@/assets/toast";

    export default {
        name: "TeamCard",
        props: {
            teams: Array,
            isGrant: Boolean
        },
        computed: {
            profile() {
                return this.$store.getters['user/getProfile']
            },
        },
        methods: {
            makeToast,
            confirm: function (teamName) {
                let res = {}
                res.teamName = teamName
                res.members = [this.profile.username]
                res.invite = true

                axios.put(BASE_URL + '/teams/' + teamName + '/grant', res).then((resp) => {
                    this.makeToast('success', resp.data.success, resp.data.message);
                    this.$emit('update');
                }).catch((e) => {
                    this.makeToast('danger', e.response.data.success, e.response.data.message);
                })

                return res
            },
            viewTeam: function(teamName) {
                this.$router.push({
                    name :'team-viewer',
                    params: {name: teamName }
                })
            }
        },

    }
</script>

<style scoped>
    .team-header:hover {
        box-shadow: 5px 5px 5px grey;
    }
    .team-title:hover {
        cursor: pointer;
    }
</style>