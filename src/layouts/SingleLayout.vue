<template>
    <div class="container-fluid">
<!--        <b-row>-->
<!--            <b-col cols="3">-->
                <aside class="sidebar text-white" style="background: #1d2225">
                <nav>
                    <b-button href="/projects" squared variant="outline-info" block>
                        <i class="fas fa-chevron-left"></i> Back to Projects
                    </b-button>
                    <SideBar :apiData="apiData" />
                </nav>
                </aside>
<!--            </b-col>-->
<!--            <b-col cols="9">-->
        <section class="main">
                <h2>Single Layout</h2>
                <router-view></router-view>
        </section>
<!--            </b-col>-->
<!--        </b-row>-->
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
        min-width: 20%;
        left: 0;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0.25em 0.5em;
    }
    .main {
        position: absolute;
        left: 25vw;
        right: 0;
        padding-left: 1em;
        padding-right: 10px;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
