import {USER_REQUEST} from "@/stores/actions/user"

export default {
    computed : {
        $_projectPrivilege_userTeam : function () {
            let profile = this.$store.getters['user/getProfile']
            if(profile.teams)return profile.teams
            else{
                this.$store.dispatch('user/' + USER_REQUEST)
            }
            return undefined
        },
        $_projectPrivilege_projectData : function () {
            return this.$store.getters['project/getProjectData']
        },
        $_projectPrivilege_canEdit : function () {
            let userTeam = this.$_projectPrivilege_userTeam
            let projectData = this.$_projectPrivilege_projectData
            if(userTeam && projectData && projectData.teams){
                return userTeam.some(x => projectData.teams.includes(x))
            }
            return false
        }
    },
    beforeCreate() {
        this.$store.dispatch('user/' + USER_REQUEST)
    }
}
