<template>
    <div>
        <h1 @click="hideSideBar">Het {{sideBar}}</h1>
        <button v-on:click="$emit('toggleNav')">Hide Side Bar FAILED</button>
        show: {{ show }}
        <b-alert show v-show="sideBar">Default Alert</b-alert>
    </div>
</template>

<script>
    /* eslint-disable */
    export default {
        name: "ProjectAll",
        data: function(){
            return {
                sideBar : this.sideBarStatus
            };
        },
        props: {
            sideBarStatus: Boolean
        },
        methods: {
            hideSideBar () {
                // return this.sideBarStatus = !this.sideBarStatus;
                console.log(this.$route.path);
                return this.sideBar = !this.sideBar;
            }
        },
        watch: {
            $route: function() {
                if (this.$router.path === "/projects")  {
                    console.log("This is PROJECTS");
                }
            }
        },

        computed: {
            show() {
                return this.$store.state.navigation.show;
            }
        },
        ready: function(){
            console.log(this.$route.path);
        }
    }
</script>

<style scoped>

</style>