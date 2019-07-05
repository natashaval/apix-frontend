<template>
    <div>
        <b-row class="my-2">
            <b-col md="10">
<!--                {{profile}}-->
                <ProjectBar :apiData="projectData"/>
            </b-col>
            <b-col md="2">
                <b-button :to="{name: 'section-create', params: {projectId: projectApi} }"
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
                <b-button size="sm"
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
                <b-button :to="{name: 'definition-create', params: {projectId: projectApi}}"
                          pill size="sm" variant="outline-secondary"
                          v-b-tooltip.hover title="new definition"
                          class="float-right"
                >
                    <i class="fa fa-plus-circle"></i>
                </b-button>
            </b-col>
        </b-row>

        <b-collapse id="collapse-model" v-model="collapseModel" class="mt-2" v-if="projectData">

            <ul class="list-group">
                <ModelBar v-for="(value, key) in projectData.definitions"
                      v-bind:key="key"
                          :definition-key="key"
                          :definition-api="value.name"
                          :project-api="projectApi"
                />
            </ul>

        </b-collapse>

        <b-list-group flush v-if="projectApi">
            <b-list-group-item :to="{name: 'github-editor' }"
                               class="py-1 text-light sidebar-content" exact-active-class="active-bar"
                               style="background-color: transparent;">
                <i class="fab fa-github"></i> Github
            </b-list-group-item>
            <b-list-group-item variant="dark"
                               :to="{name: 'settings-editor', params: {projectId: projectApi} }"
                               class="py-1 text-light sidebar-content" exact-active-class="active-bar"
                               style="background-color: transparent;"><i class="fas fa-cog"></i> Settings</b-list-group-item>
        </b-list-group>

    </div>

</template>


<script>
    import Section from "./SectionBar";
    import ProjectBar from "./ProjectBar";
    import ModelBar from "./ModelBar";
    import {USER_REQUEST} from "../../stores/actions/user";


    export default {
        name: "SideBar",
        components: {ModelBar, ProjectBar, Section},
        data: function(){
            return {
                collapseModel: true,
                isProfile: false,
            }
        },
        computed : {
            profile() {
                if (!this.isProfile) {
                    this.$store.dispatch('user/' + USER_REQUEST)
                    // return undefined;
                }
                return this.$store.getters['user/getProfile']
            },
            projectApi : function () {
                return this.$route.params.projectId
            },
            projectData : function () {
                if(this.projectApi)return this.$store.getters['project/getProjectData']
                return undefined
            },
        },
        methods : {
        },
    }
</script>

<style scoped>
    @import "../../assets/css/app.css";
</style>
