<template>
    <div>
        <b-row class="my-2">
            <b-col md="8">
                <ProjectBar :apiData="apiData"/>
            </b-col>
            <b-col offset-md="2" offset-sm="0">
                <b-button :to="{name: 'definition-create'}" pill variant="outline-secondary" size="sm">
                    <i class="fa fa-plus-circle"></i>
                </b-button>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <Section v-for="(value,key) in apiData.sections"
                         v-bind:key="key"
                         :apiData="value"
                         :sectionApi="key"/>
            </b-col>
        </b-row>

        <hr />

        <b-row>
            <b-col md="8">
                <b-button
                        :class = "collapseModel ? 'collapsed' : null"
                        :aria-expanded="collapseModel ? 'true' : 'false' "
                        aria-controls="collapse-model"
                        @click="collapseModel = !collapseModel">
                    <i class="fas fa-caret-down" v-show="collapseModel"></i>
                    <i class="fas fa-caret-right" v-show="!collapseModel"></i>
                    Models
                </b-button>
            </b-col>
            <b-col offset-md="2" offset-sm="0">
                <b-button :to="{name: 'definition-create'}" pill size="sm" variant="outline-secondary"
                          v-b-tooltip.hover title="new definition">
                    <i class="fa fa-plus-circle"></i>
                </b-button>
            </b-col>
        </b-row>

        <b-collapse id="collapse-model" v-model="collapseModel" class="mt-2">

            <ModelBar v-for="(value, key) in apiData.definitions"
                      v-bind:key="key" :apiData="value" :definition-api="value.name" />

        </b-collapse>

        <hr />

        <b-button :to="{name: 'github-editor' }">Github</b-button>

    </div>

</template>


<script>
    import Section from "./SectionBar";
    import ProjectBar from "./ProjectBar";
    import ModelBar from "./ModelBar";

    export default {
        name: "SideBar",
        components: {ModelBar, ProjectBar, Section},
        props : ['apiData'],
        data: function(){
            return {
                collapseModel: true
            }
        },
        methods : {

        }
    }
</script>

<style>
</style>
