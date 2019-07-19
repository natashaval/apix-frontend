<template>
    <div id="app">
            <component v-bind:is="layout"></component>
    </div>

</template>

<script>
    import EditorLayout from "./layouts/EditorLayout";
    import DefaultLayout from "./layouts/DefaultLayout";
    import axios from 'axios'
    import {DEFAULT_LAYOUT, EDITOR_LAYOUT} from "./consts/LayoutMode"

    export default {
        name: 'app',
        data: function(){
            return {

            }
        },
        components: {
            [DEFAULT_LAYOUT]: DefaultLayout,
            [EDITOR_LAYOUT]: EditorLayout
        },
        computed : {
            layout: function () {
                return this.$store.getters['layout/getLayout']
            }
        },
        methods: {

        },
        created: function () {
            axios.interceptors.response.use(response => response
            , error => {
                console.log('dari axios interceptor', error.response.data)
                if(error.response.status === 401){
                    return new Promise(((resolve, reject) => {
                        this.$store.dispatch('auth/AUTH_LOGOUT')
                        this.$router.push({name: 'auth-login'})
                    }))
                }


                return Promise.reject(error)

            })

        }
    }
</script>

<style>
    @import "https://use.fontawesome.com/releases/v5.7.1/css/all.css";
    @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

    body {
        padding: 0;
        margin: 0;
        width: 100%;
    }
    #app {
        /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
        font-family: 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        left: 0;
        /*text-align: justify;*/
        /*color: #2c3e50;*/
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

