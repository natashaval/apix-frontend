<template>
    <div>
        <h1>This is team page</h1>
        {{ team }}
        <br />
        Name: {{team.name}}
        Division: {{team.division}}
        Access: {{team.access}}
        Creator: {{team.creator}}

        <div v-if="isCreator">
            <h4>You are creator</h4>
            {{selectedMember}}<button @click="dump">Dump!</button>
            <div v-for="(member, i) in team.members" :key="i">
                <input type="checkbox" v-if="!member.grant" :value="member.username" v-model="selectedMember"/>
                <label :for="member.username">{{member.username}}</label>
            </div>
        </div>

        <div v-else>
            You are not anything
            <p v-for="(member,i) in team.members" :key="i">{{member.username}}</p>
        </div>
    </div>
</template>

<script>
    import {BASE_URL} from "../../stores/actions/const";
    import axios from 'axios'

    export default {
        name: "TeamViewer",
        data: function () {
            return {
                name: '',
                team: {},
                isCreator: false,
                selectedMember: []
            }
        },
        computed: {
            profile() {
                return this.$store.getters['user/getProfile']
            },

        },
        methods: {
            loadData: function () {
                let p = this.$route.params
                this.name = p.name
                this.loadTeam();
                if (this.team.creator == this.profile.username) this.isCreator = true
            },
            loadTeam: function(){
                axios.get(BASE_URL + 'teams/' + this.name).then((response) => {
                    this.team = response.data
                })
            },
            dump: function () {
                let members = []
                for (let i=0; i < this.selectedMember.length; i++) {
                    let member = {
                        grant: false,
                        username: this.selectedMember[i]
                    }
                    members.push(member)
                }
                console.log(members)
            }
        },
        mounted() {
            this.loadData();
        }
    }
</script>

<style scoped>

</style>