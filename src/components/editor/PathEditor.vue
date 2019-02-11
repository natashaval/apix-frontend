<template>
    <h1>Path api : {{pathApi}}</h1>
</template>

<script>
    export default {
        name: "PathEditor",
        props : ['pathApi'],
        computed : {
            apiData() {
                console.log('fetch '+this.pathApi)
                return this.$store.getters['project/getPath'](this.pathApi)
            }
        }
    }
</script>

<style scoped>

</style>