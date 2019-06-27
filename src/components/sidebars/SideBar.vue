<template>
    <div>
        <nav>
            <ProjectBar :apiData="apiData"/>
            <ul class="list-unstyled">
                <Section v-for="(value,key) in apiData.sections"
                         v-bind:key="key"
                         :apiData="value"
                         :sectionApi="key" class="section-bar"/>

                <b-button :to="{name: 'definition-create'}"><i class="fa fa-plus-circle"></i> </b-button>

                <b-button v-b-toggle.model class="m-1">Models</b-button>
                <b-collapse visible id="model">
                    <ModelBar v-for="(value, key) in apiData.definitions"
                              v-bind:key="key" :apiData="value" :definition-api="value.name" />
                </b-collapse>

                <hr />
                <!--<GithubBar :githubData="apiData.githubProject"></GithubBar>-->
                <b-button :to="{name: 'github-editor' }">Github</b-button>
            </ul class="list-unstyled components">
        </nav>
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
        methods : {

        }
    }
</script>

<style>
</style>
