<template>
    <div class="pr-0">
        <div class="sidebar-content pl-4 row" style="height: 2em;"
             @mouseover="onHover=true" @mouseleave="onHover=false">
            <button class="btn-circle"
                    :class="isArrow ? 'collapsed' : null"
                    :aria-controls="'section-'+sectionApi"
                    @click = "isArrow = !isArrow">
                <i class="fas fa-caret-right" v-show="!isArrow"></i>
                <i class="fas fa-caret-down" v-show="isArrow"></i>
            </button>
            <span @click="sectionClick" style="font-size: 1.3em;width: 68%;">{{ sectionApi }}</span>
            <div v-if="onHover">
                <button class="btn-circle">
                    <i style="font-size: 13px;" class="fas fa-trash"></i>
                </button>
                <button class="btn-circle" @click="createPath">
                    <i style="font-size: 14px;" class="fas fa-plus-circle"></i>
                </button>
            </div>

        </div>

        <b-collapse :id="'section-'+sectionApi" v-model="isArrow">
                <PathBar v-for="(value,key) in apiData.paths" v-bind:key="key"
                         :apiData="value" :sectionApi="sectionApi" :pathApi="key"/>
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
                onHover: false,
                isArrow: false
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
            },
            createPath : function () {
                this.$router.push({
                    name :'path-create',
                    params: {sectionApi : this.sectionApi}
                })
            }
        }
    }
</script>

<style>
    @import "../../assets/css/app.css";
</style>
