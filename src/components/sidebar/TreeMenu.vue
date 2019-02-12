<template>

    <v-card>
        <v-card-title class="blue white--text headline">{{ apiData.info.title }}</v-card-title>
        <!--ul>
            <li v-for="(value,key) in apiData.sections" v-bind:key="key"
                :apiData="value"
                :sectionApi="key">{{ key }}</li>
        </ul-->
    <v-treeview :items="treeSections"></v-treeview>
    </v-card>
</template>

<script>
    import Vue from 'vue'
    import Vuetify from 'vuetify'
    Vue.use(Vuetify)


    export default {
        name: "TreeMenu",
        data: function() {
            return {
                treeSections : [],
            }
        },
        computed: {
        },
        mounted() {
            const vm = this;
            vm.sectionToArray();
        },
        props : ['sectionApi','apiData'],
        methods : {
            sectionClick : function(){
                this.$router.push({
                    name :'section-editor',
                    params: {sectionApi : this.sectionApi}
                })
            },
            sectionToArray: function(){
                // return this.treeSections.push(this.apiData.sections);
                // return [this.apiData.sections];
                // this.treeSections = [this.apiData.sections];
                // return [this.apiData.sections];
                const sections = this.apiData.sections;
                for (var section in sections) {
                    if (sections.hasOwnProperty(section)){
                        var temp = new Object();

                    }
                }
            },

            pathToArray: function () {
                for (var section in this.apiData.sections) {
                    if (section.hasOwnProperty("paths")){
                        const pathArray = Array.isArray(section["paths"]) ? section["paths"] : [section["paths"]];
                        section["paths"] = pathArray;
                        /* eslint-disable no-console */
                        console.log(section["paths"]);
                        /* eslint-disable no-console */
                    }
                }
            }
        },
    }
</script>

<style scoped>

</style>