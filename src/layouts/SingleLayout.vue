<template>
    <div class="container-fluid">
        <b-row>
            <b-col cols="3" class="bg-dark text-white">
                <nav id="sidebar">
                    <b-button href="/projects" squared variant="outline-info" block>
                        <i class="fas fa-chevron-left"></i> Back to Projects
                    </b-button>
                    <SideBar :apiData="apiData" />
                </nav>
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
