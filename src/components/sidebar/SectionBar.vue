<template>
    <div>
        <li v-b-toggle="'section-'+sectionName">{{sectionName}}</li>
        <b-collapse :id="'section-'+sectionName" class="mt-2">
            <ul>
                <LinkBar v-for="(value,key) in apiData.paths" v-bind:key="key" :apiData="value" :linkApi="key"/>
            </ul>
        </b-collapse>
    </div>
</template>

<script>

    import LinkBar from './LinkBar'

    export default {
        name: "Section",
        components : {
            LinkBar
        },
        props : ['sectionName','apiData']
    }
</script>

<style scoped>

</style>