<template>
    <li>
        <div class="row sidebar-content" style="padding-left: 2.5em;height: 2em;"
             @mouseover="onHover=true" @mouseleave="onHover=false">
            <button class="btn-circle"
                    :class="isArrow ? 'collapsed' : null"
                    :aria-controls="'link-'+pathApi"
                    @click = "isArrow = !isArrow">
                <i class="fas fa-caret-right" v-show="!isArrow"></i>
                <i class="fas fa-caret-down" v-show="isArrow"></i>
            </button>

            <p @click="pathClick" class="shrinkable-text col-9"
               style="font-size: 0.9em;margin-left: -1em;margin-top: 0.3em;"> {{ pathApi }}</p>
            <div v-if="onHover" class="row">
                <button class="btn-circle">
                    <i style="font-size: 13px;" class="fas fa-trash"></i>
                </button>
                <button class="btn-circle" @click="createOperation">
                    <i style="font-size: 14px;" class="fas fa-plus-circle"></i>
                </button>
            </div>
        </div>
        <b-collapse :id="'link-'+pathApi" v-model="isArrow">
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
                isArrow: false,
                onHover : false,
            }
        },
        methods : {
            pathClick : function(){
                this.$router.push({
                    name :'path-editor',
                    params: {sectionApi : this.sectionApi, pathApi : this.pathApi}
                })
            },
            createOperation : function () {
                this.$router.push({
                    name :'operation-create',
                    params: {sectionApi : this.sectionApi, pathApi : this.pathApi, operationApi : this.method}
                })
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/app.css";

</style>
