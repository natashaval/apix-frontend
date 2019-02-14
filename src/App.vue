<template>
    <div id="app" class="row w-100">
        <b-row>
            <b-col cols="3">
                <SideBar :apiData="apiData" class="sidebar"/>
            </b-col>
            <b-col cols="9">
                <router-view class="main-view"></router-view>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import SideBar from "./components/sidebars/SideBar";

    export default {
        name: 'app',
        components: {
            SideBar
        },
        computed : {
            apiData : function () {
                return this.$store.getters['project/getProjectData']
            }
        }
    }
</script>

<style>
    @import "https://use.fontawesome.com/releases/v5.7.1/css/all.css";

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #app{
        border: aqua 1px solid;
        height: 100%;
    }

    .sidebar{
        border: red 1px solid;
        position: fixed;
        overflow-y: scroll;
        top: 0;
        bottom: 0;
    }

    .main-view{
        border: red 1px solid;
        height: 100%;
        overflow-y: scroll;
    }

    body,html{
        height: 100%;
    }

</style>

