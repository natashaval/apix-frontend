<template>
    <div class="container-fluid">
        <b-row>
            <b-col cols="3" class="sidebar">
                <router-link to="/projects"> Back to Projects</router-link>
                <SideBar :apiData="apiData" />
            </b-col>
            <b-col cols="9" class="main-view">
            <h2>Single Layout</h2>
            <router-view></router-view>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import SideBar from "../components/sidebars/SideBar";
    export default {
        name: "SingleLayout",
        components: {
            SideBar
        },
        computed: {
            apiData : function () {
                return this.$store.getters['project/getProjectData']
            },
        }
    }
</script>

<style scoped>

</style>