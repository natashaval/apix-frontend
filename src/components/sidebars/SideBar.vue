<template>
    <div>
        <b-row class="my-2">
            <b-col md="10">
                <ProjectBar :apiData="projectData"/>
            </b-col>
            <b-col md="2">
                <b-button :to="{name: 'section-create'}"
                          size="sm"
                          class="float-right">
                    <i class="fa fa-plus-circle"></i>
                </b-button>
            </b-col>
        </b-row>

        <b-row>
            <b-col style="padding-left: 0em;padding-right: 0" v-if="projectData">
                <Section v-for="(value,key) in projectData.sections"
                         v-bind:key="key"
                         :section-data="value"
                         :project-api="projectApi"
                         :section-api="key"/>
            </b-col>
        </b-row>

        <hr />

        <b-row>
            <b-col md="10">
                <b-button
                        :class = "collapseModel ? 'collapsed' : null"
                        :aria-expanded="collapseModel ? 'true' : 'false' "
                        aria-controls="collapse-model"
                        @click="collapseModel = !collapseModel"
                >
                    <i class="fas fa-caret-down" v-show="collapseModel"></i>
                    <i class="fas fa-caret-right" v-show="!collapseModel"></i>
                    Models
                </b-button>
            </b-col>
            <b-col md="2">
                <b-button :to="{name: 'definition-create'}" pill size="sm" variant="outline-secondary"
                          v-b-tooltip.hover title="new definition"
                          class="float-right"
                >
                    <i class="fa fa-plus-circle"></i>
                </b-button>
            </b-col>
        </b-row>

        <b-collapse id="collapse-model" v-model="collapseModel" class="mt-2">

            <ModelBar v-for="(value, key) in projectData.definitions"
                      v-bind:key="key" :projectData="value" :definition-api="value.name" />

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
        data: function(){
            return {
                collapseModel: true,
            }
        },
        computed : {
            projectApi : function () {
                return this.$route.params.projectId
            },
            projectData : function () {
                if(this.projectApi)return this.$store.getters['project/getProjectData']
                return undefined
            }
        },
        methods : {

        }
    }
</script>

<style scoped>
    @import "../../assets/css/app.css";
</style>
