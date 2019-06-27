<template>
    <li>
        <a @click="sectionClick" style="color: white;" class="section-bar">
            <i v-b-toggle="'section-'+sectionApi" class="fa fa-angle-right"></i>{{sectionApi}}
        </a>
        <b-collapse :id="'section-'+sectionApi">
            <ul style="border: 1px solid blue;margin-left: -10px;">
                <PathBar v-for="(value,key) in apiData.paths" v-bind:key="key"
                         :apiData="value" :sectionApi="sectionApi" :pathApi="key" style="font-size: 20px"/>
            </ul>
        </b-collapse>
    </li>
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
    .fa {
        float: left;
    }

    .section-bar{
        font-size: 25px;
        border-top: 1px solid red;
        border-bottom:1px solid red;
    }
</style>
