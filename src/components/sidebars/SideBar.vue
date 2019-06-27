<template>
    <div>
        <b-row class="my-2">
            <b-col md="8" offset-md="1">
                <ProjectBar :apiData="apiData"/>
            </b-col>
            <b-col md="1" offset-md="1">
                <b-button :to="{name: 'definition-create'}" pill variant="outline-secondary" size="sm">
                    <i class="fa fa-plus-circle"></i>
                </b-button>
            </b-col>
        </b-row>
        <ul>
            <Section v-for="(value,key) in apiData.sections"
                     v-bind:key="key"
                     :apiData="value"
                     :sectionApi="key"/>

            <hr />

            <b-row>
                <b-col md="6">
<!--                    <b-button v-b-toggle.model class="m-1">Models</b-button>-->
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
                <b-col md="1" offset-md="4">
                    <b-button :to="{name: 'definition-create'}" pill size="sm" variant="outline-secondary"
                              v-b-tooltip.hover title="new definition"
                    >
                        <i class="fa fa-plus-circle"></i>
                    </b-button>
                </b-col>
            </b-row>
<!--            <b-collapse visible id="model">-->
            <b-collapse id="collapse-model" v-model="collapseModel" class="mt-2">
                <ModelBar v-for="(value, key) in apiData.definitions"
                      v-bind:key="key" :apiData="value" :definition-api="value.name" />
            </b-collapse>

            <hr />
            <!--<GithubBar :githubData="apiData.githubProject"></GithubBar>-->
            <b-button :to="{name: 'github-editor' }">Github</b-button>

        </ul>
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
    ul,li {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
</style>
