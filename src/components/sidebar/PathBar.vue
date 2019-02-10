<template>
    <div>
        <li @click="pathClick" v-b-toggle="'link-'+pathApi">{{pathApi}}</li>
        <b-collapse :id="'link-'+pathApi" class="mt-2">
            <MethodBar v-for="(value,key) in apiData" v-bind:key="key" :apiData="value" :methodName="key"/>
        </b-collapse>
    </div>
</template>

<script>
    import MethodBar from "./MethodBar";
    export default {
        name: "PathBar",
        components: {MethodBar},
        props : ['pathApi','apiData'],
        methods : {
            pathClick : function(){
                this.$router.push({
                    name :'path-editor',
                    params: {pathApi : this.pathApi}
                })
            }
        }
    }
</script>

<style scoped>

</style>