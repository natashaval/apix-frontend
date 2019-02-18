<template>
    <div>
        <button @click="setLayout('single-layout')">Single Layout</button>
        <button @click="setLayout('all-layout')">All Layout</button>
    </div>
</template>

<script>
    export default {
        name: "Mboh",
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