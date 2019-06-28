<template>
    <li class="px-3">
<!--        <a @click="pathClick">-->
<!--            <i v-b-toggle="'link-'+pathApi" class="fa fa-angle-right"></i>-->
<!--            {{pathApi}}-->
<!--        </a>-->
        <span class="mb-sm-1"
                  :class="isArrow ? 'collapsed' : null"
                  :aria-expanded="isArrow ? 'true' : 'false'"
                  :aria-controls="'link-'+pathApi"
                  @click = "isArrow = !isArrow"
        > <i class="fas fa-angle-right" v-show="!isArrow"></i>
            <i class="fas fa-angle-down" v-show="isArrow"></i>
        </span>

        <span @click="pathClick"> {{ pathApi }}</span>

        <b-collapse :id="'link-'+pathApi" class="mt-2" v-model="isArrow">
            <OperationBar v-for="(value,key) in apiData.methods" v-bind:key="key" :apiData="value"
                          :sectionApi="sectionApi" :pathApi="pathApi"
                          :operationApi="key"/>
        </b-collapse>
    </li>
</template>

<script>
    import OperationBar from "./OperationBar";
    export default {
        name: "PathBar",
        components: {OperationBar},
        props : ['apiData','pathApi','sectionApi'],
        data: function(){
            return {
                isArrow: false
            }
        },
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
    .path-bar{
        float: left;
        width: 100%;
    }
    .path-bar:hover{
        background: white;
    }

</style>
