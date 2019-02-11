<template>
    <div>
    <h1>section name : {{sectionApi}}</h1>
    </div>
</template>

<script>
    export default {
        name: "SectionEditor",
        props : ['sectionApi','projectId'],
        computed : {
            apiData(){
                return this.$store.getters['project/getSectionData'](this.sectionApi)
            }
        },
        created() {
        }
    }
</script>

<style scoped>

</style>