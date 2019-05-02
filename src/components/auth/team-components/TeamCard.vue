<template>
    <div>
        <b-card class="mb-2" no-body
                v-for="team in teams" :key="team.id"
                >
            <b-card-body>
                <b-card-title> <b-link href="#">{{team.name}}</b-link> </b-card-title>
            </b-card-body>
            <b-card-footer v-if="!isGrant">
                <b-button variant="primary">Confirm</b-button>
            </b-card-footer>

        </b-card>
    </div>
</template>

<script>
    export default {
        name: "TeamCard",
        props: ['teams', 'isGrant']
    }
</script>

<style scoped>

</style>