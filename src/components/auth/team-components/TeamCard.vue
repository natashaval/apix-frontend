<template>
    <div>
        <b-card class="mb-2" no-body
                v-for="team in teams" :key="team.id"
                >
            <b-card-body>
                <b-card-title>
                    <b-link :to="{name: 'team-viewer', params: {name: team.name }}">{{team.name}}</b-link>
                </b-card-title>
                <b-card-sub-title>Creator: {{team.creator}}</b-card-sub-title>
            </b-card-body>
            <b-card-footer v-if="!isGrant">
                <button class="btn btn-primary" @click="confirm(team.name)">Confirm</button>
            </b-card-footer>

        </b-card>
    </div>
</template>

<script>
    import {BASE_URL} from "../../../stores/actions/const";
    import axios from 'axios'
    import {makeToast} from "../../../assets/toast";

    export default {
        name: "TeamCard",
        props: ['teams', 'isGrant'],
        data: function(){
            return {

            }
        },
        computed: {
            profile() {
                return this.$store.getters['user/getProfile']
            },
        },
        methods: {
            makeToast,
            confirm: function (teamName) {
                console.log('confirm')
                let grantList = []
                let confirmation = {
                    username: this.profile.username,
                    grant: false
                }
                grantList.push(confirmation)
                console.log(grantList, teamName)


                axios.put(BASE_URL + "/teams/" + teamName, grantList).then((resp) => {
                    this.makeToast('success', resp.data.success, resp.data.message);
                    this.$emit('update');
                }).catch((e) => {
                    console.error(e);
                    this.makeToast('danger', e.response.data.success, e.response.data.message);
                })

            }
        },

    }
</script>

<style scoped>

</style>
