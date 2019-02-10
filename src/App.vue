<template>
    <div id="app">
        <SideBar :apiData="apiData"/>
        <router-view></router-view>

    </div>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import SideBar from "./components/sidebar/SideBar";
    import BootstrapVue from 'bootstrap-vue'
    import Vue from 'vue'

    Vue.use(BootstrapVue)


    export default {
        name: 'app',
        components: {
            SideBar
        },
        computed : {
            apiData : function () {
                return this.$store.getters['project/getProject']
            }
        }
    }
</script>

<style>
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
