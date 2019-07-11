<template>
    <div>
        <b-row>
            <b-button href="/projects" squared variant="outline-info" block>
                <i class="fas fa-chevron-left"></i> Back to Projects
            </b-button>
        </b-row>

        <b-row class="my-2">
            <b-col md="10">
<!--                {{profile}}-->
                <ProjectBar :apiData="projectData"/>
            </b-col>
            <b-col md="2">
                <b-button v-if="$_projectPrivilege_canEdit" :to="{name: 'section-create'}" pill size="sm" variant="outline-light"
                          class="float-right btn-circle">
                    <i class="fa fa-plus-circle"></i>
                </b-button>
            </b-col>
        </b-row>

        <b-row>
            <b-col style="padding-left: 0em;padding-right: 0" v-if="projectData">
                <Section v-for="section in orderedSection"
                         v-bind:key="section.info.name"
                         :section-data="section"
                         :project-api="projectApi"
                         :section-api="section.info.name"/>
            </b-col>
        </b-row>

        <hr style="background-color: white"/>

        <b-row>
            <b-col md="10" style="padding-left: 1.25em;">
                <span size="sm"
                        :class = "collapseModel ? 'collapsed' : null"
                        :aria-expanded="collapseModel ? 'true' : 'false' "
                        aria-controls="collapse-model"
                        @click="collapseModel = !collapseModel" class="text-white"
                      style="cursor: pointer !important;"
                >
                    <i class="fas fa-caret-down" v-show="collapseModel"></i>
                    <i class="fas fa-caret-right" v-show="!collapseModel"></i>
                     <span class="ml-2"><i class="fas fa-archive" style="font-size: 16px"></i> Models</span>
                </span>
            </b-col>
            <b-col md="2">
                <b-button v-if="$_projectPrivilege_canEdit" :to="{name: 'definition-create'}" pill size="sm" variant="outline-light"
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
        <b-list-group flush v-if="$_projectPrivilege_canEdit" style="">
            <b-list-group-item :to="{name: 'github-editor' }"
                               class="py-1 text-light sidebar-content pl-0" exact-active-class="active-bar"
                               style="background-color: transparent;">
                <i class="fab fa-github"></i> Github
            </b-list-group-item>
            <b-list-group-item variant="dark"
                               :to="{name: 'settings-editor', params: {projectId: projectApi} }"
                               class="py-1 text-light sidebar-content pl-0" exact-active-class="active-bar"
                               style="background-color: transparent;"><i class="fas fa-cog"></i> Settings</b-list-group-item>
        </b-list-group>
    </div>

</template>


<script>
    import Section from "./SectionBar";
    import ProjectBar from "./ProjectBar";
    import ModelBar from "./ModelBar";
    import {USER_REQUEST} from "@/stores/actions/user";
    import ProjectPrivilegeMixin from "@/mixins/ProjectPrivilegeMixin";

    export default {
        name: "SideBar",
        components: {ModelBar, ProjectBar, Section},
        mixins : [ProjectPrivilegeMixin],
        data: function(){
            return {
                collapseModel: true,
                isProfile: false,
            }
        },
        computed : {
            orderedSection : function (){
                let res = []
                let sections = this.projectData.sections
                if(sections){
                    let keys = Object.keys(sections).sort()
                    keys.forEach(key => res.push(sections[key]))
                }
                return res
            },
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
