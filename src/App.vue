<template>
    <div id="app" class="container-fluid">
        <b-row>
            <component v-bind:is="layout"></component>
        </b-row>

    </div>

</template>

<script>
    import SingleLayout from "./layouts/SingleLayout";
    import AllLayout from "./layouts/AllLayout";

    export default {
        name: 'app',
        data: function(){
            return {

            }
        },
        components: {
            'single-layout': SingleLayout,
            'all-layout': AllLayout
        },
        computed : {
            layout: function () {
                return this.$store.getters['layout/getLayout']
            }
        },
        methods: {

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

    .dot-border{
        border: rgba(42, 18, 59, 0.28) 1px dotted;
    }


</style>

