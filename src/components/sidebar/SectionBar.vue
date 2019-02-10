<template>
    <div>
        <li v-b-toggle="'section-'+sectionApi" @click="sectionClick">{{sectionApi}}</li>
        <b-collapse :id="'section-'+sectionApi" class="mt-2">
            <ul>
                <PathBar v-for="(value,key) in apiData.paths" v-bind:key="key" :apiData="value" :pathApi="key"/>
            </ul>
        </b-collapse>
    </div>
</template>

<script>

    import PathBar from './PathBar'

    export default {
        name: "SectionBar",
        components : {
            PathBar
        },
        props : ['sectionApi','apiData'],
        methods : {
            sectionClick : function(){
                this.$router.push({
                    name :'section-editor',
                    params: {sectionApi : this.sectionApi}
                })
            }
        }
    }
</script>

<style scoped>

</style>