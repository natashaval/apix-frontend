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
    import axios from 'axios'

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

        },
        created: function () {
            axios.interceptors.response.use(undefined, function (err) {
                return new Promise (function (resolve, reject) {
                    if(err.status === 401 && err.config && !err.config.__isRetryRequest) {
                        // if get 401 unauthorized, logout user
                        this.$store.dispatch('auth/AUTH_LOGOUT')
                    }
                    throw err;
                })
            })
        }
    }
</script>

<style>
    @import "https://use.fontawesome.com/releases/v5.7.1/css/all.css";
    @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

    #app {
        /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
        font-family: 'Roboto', sans-serif;
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

    .round-button{
        border-radius: 50%;
        width: 35px;
        height: 35px;
        background: rgba(187, 184, 172, 0.49);
        display: inline-block;
        box-shadow: 0px 0px 2px #888;
        padding: 0.5em 0.6em;
    }


</style>

