<template>
    <div>
        <ul>
            <Section v-for="(value,key) in apiData.sections" v-bind:key="key" :apiData="value" :sectionName="key"/>
        </ul>
    </div>

</template>


<script>
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import Section from "./SectionBar";


    export default {
        name: "SideBar",
        components: {Section},
        props : ['apiData']
    }
</script>

<style scoped>

</style>
