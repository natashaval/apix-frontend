<template>
    <div id="app" class="container-fluid">
            <b-row>
                <b-col cols="3" class="sidebar">
                    <SideBar :apiData="apiData"/>
                </b-col>
                <b-col cols="9" class="main-view">
                    <router-view></router-view>
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
        overflow: hidden;
    }

    .sidebar{
        border: red 1px solid;
        position: fixed;
        overflow: auto;
        height: 100vh;
    }

    .main-view{
        border: greenyellow 1px solid;
        height: 100vh;
        overflow: auto;
    }

    .blue-frame{
        border: 1px solid blue;
    }

    .red-frame{
        border: 1px solid red;
    }

</style>

