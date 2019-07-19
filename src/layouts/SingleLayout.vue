<template>
    <div class="layout-wrapper">
        <SideBar :apiData="apiData" class="sidebar"/>
        <section class="main-content">
            <router-view></router-view>
        </section>
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
    /*https://codepen.io/peruvianidol/pen/oeFDd*/
    .layout-wrapper {
        width: 100%;
        min-width: 900px;
        padding: 0;
        right: 0;
        /* set flex on parent */
        display: flex;
        flex-direction: row;
        bottom:0;
    }
    .sidebar, .main-content {
        top: 0;
        overflow-y: auto;
        height: 100vh;
    }
    .main-content {
        width: 75%;
        right: 0;
        padding-right: 0;
    }
    .sidebar {
        width: 25%;
        min-width: 25em;
        color: white;
        padding: 0.25em 0.5em;
        overflow-x: hidden;
        background: #1d2225;
    }
</style>
