<template>
    <h1>Path api : {{pathApi}}</h1>
</template>

<script>
    export default {
        name: "PathEditor",
        props : ['sectionApi','pathApi'],
        computed : {
            apiData() {
                return this.$store.getters['project/getPathData'](this.sectionApi, this.pathApi)
            }
        }
    }
</script>

<style scoped>

</style>