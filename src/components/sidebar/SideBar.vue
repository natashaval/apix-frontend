<template>
    <div>
        <ProjectBar :apiData="apiData"/>
        <ul>
            <Section v-for="(value,key) in apiData.sections"
                     v-bind:key="key"
                     :apiData="value"
                     :sectionApi="key"/>
        </ul>
    </div>

</template>


<script>
    import Section from "./SectionBar";
    import ProjectBar from "./ProjectBar";


    export default {
        name: "SideBar",
        components: {ProjectBar, Section},
        props : ['apiData'],
        methods : {

        }
    }
</script>

<style scoped>

</style>
