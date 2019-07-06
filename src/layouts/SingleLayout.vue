<template>
    <div class="container-fluid">

        <aside class="sidebar text-white pt-0" style="background: #1d2225;">
            <nav>
                <SideBar :apiData="apiData" />
            </nav>
        </aside>
        <section class="main">
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

    .sidebar, .main {
        top: 0;
        bottom: 0;
        position: absolute;
        /*overflow: scroll;*/
        /*overflow-y: scroll;*/
        /*overflow-x: hidden;*/
    }
    .sidebar {
        width: 25%;
        left: 0;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0.25em 0.5em;
    }
    .main {
        left: 25%;
        min-width: 75%;
        right: 0;
        padding-left: 0;
        padding-right: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
