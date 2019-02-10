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
                return this.$store.getters['project/getSection'](this.sectionApi)
            }
        },
        created() {
            console.log('create section')
        }
    }
</script>

<style scoped>

</style>