<template>
    <!--nanti file ini dihapus, untuk contoh saja-->
    <div>
        <h1>section name : {{sectionApi}}</h1>
        {{apiData.info}}
        <GeneralComponent :apiData="apiData.info" />
    </div>
</template>

<script>
    import GeneralComponent from "./editor-components/GeneralComponent";
    export default {
        name: "SectionEditor",
        components: {GeneralComponent},
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