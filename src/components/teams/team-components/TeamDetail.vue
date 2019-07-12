<template>
    <div>
        <div class="row">
            <div class="col-md-12" v-if="team.name">
                <p class="font-weight-bold" style="font-size: 1.5em;">
                    <i class="fas fa-users"></i>
                    Team {{team.name}}</p>
            </div>
        </div>
        <div class="form-row">
            <label for="create-division" class="col-md-2">Division: </label>
            <div class="col-md-6" v-if="team.division">
                <input type="text" readonly v-model="team.division" id="create-division" class="form-control-plaintext" />
            </div>
        </div>
        <div class="form-row">
            <label class="col-md-2">Access: </label>
            <div class="col-md-6" v-if="team.access">
                <span class="badge badge-primary" v-if="team.access == 'public'">Public</span>
                <span class="badge badge-dark" v-if="team.access == 'private'">Private</span>
            </div>
        </div>
        <div class="form-row">
            <label class="col-md-2">Creator: </label>
            <div class="col-md-6" v-if="team.creator">
                {{team.creator}}&nbsp;&nbsp;&nbsp;<i class="fas fa-user-check" v-if="isCreator"></i>
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