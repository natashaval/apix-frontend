<template>
    <div>
        <b-button pill size="sm" class="mb-sm-1" variant="outline-secondary"
                  :class="isArrow ? 'collapsed' : null"
                  :aria-expanded="isArrow ? 'true' : 'false'"
                  :aria-controls="'section-'+sectionApi"
                  @click = "isArrow = !isArrow"
        > <i class="fas fa-angle-right" v-show="!isArrow"></i>
            <i class="fas fa-angle-down" v-show="isArrow"></i>
        </b-button>

        <span @click="sectionClick" class="p-1" style="font-size: large;">{{ sectionApi }}</span>

        <b-collapse :id="'section-'+sectionApi" v-model="isArrow">
                <PathBar v-for="(value,key) in apiData.paths" v-bind:key="key"
                         :apiData="value" :sectionApi="sectionApi" :pathApi="key" />
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
            }
        }
    }
</script>

<style scoped>
    li {
        list-style-type: none;
    }
</style>
