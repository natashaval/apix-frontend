<template>
    <div>
        <li @click="sectionClick">
            <i v-b-toggle="'section-'+sectionApi" class="fas fa-angle-right"></i>{{sectionApi}}
        </li>
        <b-collapse :id="'section-'+sectionApi" class="mt-2">
            <ul>
                <PathBar v-for="(value,key) in apiData.paths" v-bind:key="key"
                         :apiData="value" :sectionApi="sectionApi" :pathApi="key"/>
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
        data: function() {
            return {
                // hover: false,
                // isClick: false
            }
        },
        methods : {
            sectionClick : function(){
                // this.isClick = !this.isClick
                this.hover = true;
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
    .active {
        background-color: green;
    }
</style>
