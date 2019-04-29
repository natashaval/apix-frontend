<template>
    <div>
        <b-card cols="4" class="mb-2"
                :title="team.name" >
            {{ team }}
            <div slot="footer">
                <b-button :href="team" variant="primary">Confirm</b-button>
            </div>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "TeamCard",
        props: ['team']
    }
</script>

<style scoped>

</style>