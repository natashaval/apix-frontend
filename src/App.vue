<template>
    <div id="app">
        <SideBar :apiData="apiData" class="sidebar"/>
        <router-view></router-view>

    </div>
</template>

<script>
    import SideBar from "./components/sidebar/SideBar";

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
        margin-top: 60px;
    }

    .sidebar{
        border: red 1px solid;
        color: red;
        float: left;
    }

</style>

