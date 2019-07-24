<template>
    <div>
        <div class="row">
            <div class="col-md-12" v-if="team.name">
                <p class="font-weight-bold" style="font-size: 1.5em;" name="team-name">
                    <i class="fas fa-users"></i>
                    Team {{team.name}}</p>
            </div>
        </div>
<!--        <div class="form-row">-->
<!--            <label class="col-md-2">Division: </label>-->
<!--            <div class="col-md-6" v-if="team.division"> {{team.division}}-->
<!--            </div>-->
<!--        </div>-->
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
    export default {
        name: "TeamDetail",
        props: {
            team: Object,
            isCreator: Boolean
        }
    }
</script>

<style scoped>

</style>