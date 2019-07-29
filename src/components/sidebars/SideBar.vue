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
                <SectionBar v-for="section in orderedSection"
                         v-bind:key="section.info.name"
                         :editable="$_projectPrivilege_canEdit"
                         :section-data="section"
                         :project-api="projectApi"
                         :section-api="section.info.name"/>
            </b-col>
        </b-row>

        <hr style="background-color: white"/>

        <div class="row flex">
            <button size="sm"
                    :class = "collapseModel ? 'collapsed' : null"
                    :aria-expanded="collapseModel ? 'true' : 'false' "
                    aria-controls="collapse-model"
                    @click="collapseModel = !collapseModel" class="text-white btn-circle ml-2"
                    style="cursor: pointer !important;"
            >
                <i class="fas fa-caret-down" v-show="collapseModel"></i>
                <i class="fas fa-caret-right" v-show="!collapseModel"></i>

            </button>
            <span class="mt-1"><i class="fas fa-archive" style="font-size: 16px"></i> Models</span>
            <b-button v-if="$_projectPrivilege_canEdit" :to="{name: 'definition-create'}" pill size="sm" variant="outline-light"
                      v-b-tooltip.hover title="new definition"
                      class="float-right ml-auto mr-3"
            >
                <i class="fa fa-plus-circle"></i>
            </b-button>
        </div>

        <b-collapse id="collapse-model" v-model="collapseModel" class="mt-2" v-if="projectData">

            <ul class="list-group">
                <ModelBar v-for="model in orderedModel"
                      v-bind:key="model.key"
                      :editable="$_projectPrivilege_canEdit"
                      :definition-key="model.key"
                      :definition-api="model.value.name"
                      :project-api="projectApi"
                />
            </ul>

        </b-collapse>

        <b-list-group flush>
            <b-list-group-item :to="{name: 'team-editor', params: {projectId: projectApi} }"
                               class="py-1 text-light sidebar-content pl-0" exact-active-class="active-bar"
                               style="background-color: transparent;">
                <i class="fas fa-users"></i> Teams
            </b-list-group-item>
            <b-list-group-item :to="{name: 'github-editor', params: {projectId: projectApi} }"
                               v-if="$_projectPrivilege_canEdit"
                               class="py-1 text-light sidebar-content pl-0" exact-active-class="active-bar"
                               style="background-color: transparent;">
                <i class="fab fa-github"></i> Github
            </b-list-group-item>
            <b-list-group-item variant="dark"
                               :to="{name: 'settings-editor', params: {projectId: projectApi} }"
                               v-if="$_projectPrivilege_canEdit"
                               class="py-1 text-light sidebar-content pl-0" exact-active-class="active-bar"
                               style="background-color: transparent;"><i class="fas fa-cog"></i> Settings</b-list-group-item>
        </b-list-group>
    </div>

</template>


<script>
    import SectionBar from "./SectionBar";
    import ProjectBar from "./ProjectBar";
    import ModelBar from "./ModelBar";
    import {USER_REQUEST} from "@/stores/actions/user";
    import ProjectPrivilegeMixin from "@/mixins/ProjectPrivilegeMixin";

    export default {
        name: "SideBar",
        components: {ModelBar, ProjectBar, SectionBar},
        mixins : [ProjectPrivilegeMixin],
        data: function(){
            return {
                collapseModel: true,
                isProfile: false,
            }
        },
        computed : {
            modelsData : function(){
                if(this.projectData){
                    return this.projectData.definitions
                }
                return undefined
            },
            orderedSection : function (){
                let res = []
                let sections = this.projectData.sections
                if(sections){
                    let keys = Object.keys(sections).sort()
                    keys.forEach(key => res.push(sections[key]))
                }
                return res
            },
            orderedModel : function (){
                let res = []

                if(this.modelsData){
                    let modelsData = this.modelsData
                    let keys = Object.keys(modelsData).sort((a,b) => {
                        return modelsData[a].name > modelsData[b].name
                    })
                    keys.forEach(key => res.push({
                        key : key,
                        value : modelsData[key]
                    }))
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
