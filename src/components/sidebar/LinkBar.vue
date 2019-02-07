<template>
    <div>
        <li v-b-toggle="'link-'+linkApi">{{linkApi}}</li>
        <b-collapse :id="'link-'+linkApi" class="mt-2">
            <MethodBar v-for="(value,key) in apiData" v-bind:key="key" :apiData="value" :methodName="key"/>
        </b-collapse>
    </div>
</template>

<script>
    import MethodBar from "./MethodBar";
    export default {
        name: "Link",
        components: {MethodBar},
        props : ['linkApi','apiData']
    }
</script>

<style scoped>

</style>