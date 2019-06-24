<template>
    <div>
        <b-card class="mb-2" no-body
                v-for="team in teams" :key="team.id"
                >
            <b-card-body>
                <b-card-title><b-link :to="{name: 'team-viewer', params: {name: team.name }}">{{team.name}}</b-link> </b-card-title>
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
            confirm: function (teamName) {
                console.log('confirm')
                let grantList = []
                let confirmation = {
                    username: this.profile.username,
                    grant: false
                }
                grantList.push(confirmation)
                console.log(grantList, teamName)


                axios.put(BASE_URL + "teams/" + teamName, grantList).then((resp) => {
                    console.log('granted')
                    alert(resp.data.message)
                    this.$emit('update');
                }).catch((e) => {
                    console.error(e);
                })

            }
        },

    }
</script>

<style scoped>

</style>