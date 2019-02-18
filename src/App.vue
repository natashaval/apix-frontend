<template>
    <div id="app" class="container-fluid">
        <b-row>
            Component
            <component v-bind:is="layout"></component>
        </b-row>
            <b-row>
                <b-col cols="3" class="sidebar" v-if="sideBarStatus">
                    <!--<router-link :to="{name: 'project-all'}" v-if="isOnProjects">Projects</router-link>-->
                    <h5 @click="backToProjects">Back to Projects</h5>
                    <h6 @click="toggleNav"> Mboh {{sideBarStatus}}</h6>
                    <SideBar v-show="sideBarStatus" :apiData="apiData"/>
                </b-col>
                <b-col cols="9" class="main-view">
                    <h6 @click="toggleNav">Show Side Bar: {{sideBarStatus}}</h6>
                    <h3 v-if="['project-all'].indexOf($router.name) > -1">Babi</h3>
                    <router-view></router-view>
                </b-col>
            </b-row>
    </div>

</template>

<script>
    import SideBar from "./components/sidebars/SideBar";
    import SingleLayout from "./layouts/SingleLayout";
    import AllLayout from "./layouts/AllLayout";

    export default {
        name: 'app',
        data: function(){
            return {
                sideBarStatus: true,
            }
        },
        components: {
            SideBar,
            'single-layout': SingleLayout,
            'all-layout': AllLayout
        },
        computed : {
            apiData : function () {
                return this.$store.getters['project/getProjectData']
            },

            layout: function () {
                return this.$store.getters['layout/getLayout']
            }
        },
        methods: {
            backToProjects() {
                alert("Hello!");
                this.toggleNav();

                this.$router.push({
                    path: '/projects',
                    params: {
                        sideBarStatus: this.sideBarStatus
                    }
                })
            },
            toggleNav () {
                this.sideBarStatus = !this.sideBarStatus;
            },
            isOnProjects () {
                return this.$route.path === '/projects';
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

