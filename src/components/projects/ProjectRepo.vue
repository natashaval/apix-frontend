<template>
    <div>
        <h2>All Layout Repos</h2>
        <router-link to="/projects/5c61963e2fd74228b44ebddd">Swagger PetStore</router-link>
    </div>
</template>

<script>
    export default {
        name: "ProjectRepo",
        methods: {
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            }
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
        }
    }
</script>

<style scoped>

</style>