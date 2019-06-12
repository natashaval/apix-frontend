<template>
    <div>
        <li @click="pathClick">
            &nbsp;&nbsp;&nbsp;<i v-b-toggle="'link-'+pathApi" class="fa fa-angle-right"></i>
            {{pathApi}}
        </li>
        <b-collapse :id="'link-'+pathApi" class="mt-2">
            <OperationBar v-for="(value,key) in apiData.methods" v-bind:key="key" :apiData="value"
                          :sectionApi="sectionApi" :pathApi="pathApi"
                          :operationApi="key"/>
        </b-collapse>
    </div>
</template>

<script>
    import OperationBar from "./OperationBar";
    export default {
        name: "PathBar",
        components: {OperationBar},
        props : ['apiData','pathApi','sectionApi'],
        methods : {
            pathClick : function(){
                this.$router.push({
                    name :'path-editor',
                    params: {sectionApi : this.sectionApi, pathApi : this.pathApi}
                })
            }
        }
    }
</script>

<style scoped>
    .fa {
        float: left;
    }

</style>