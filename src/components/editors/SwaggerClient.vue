<template>
    <div>
    <button class="btn btn-outline-light float-left text-dark" @click="routeBack()">
        <i class="fas fa-angle-left"></i> Back
    </button>
    <div id="swagger-ui">
    </div>
    </div>
</template>

<script>
    import 'swagger-ui/dist/swagger-ui.css'
    import SwaggerUI from 'swagger-ui'
    import {BASE_URL} from "../../stores/consts/url";

    // import 'swagger-ui/dist/swagger-ui-standalone-preset.js'

    /*
    jika di npm install swagger-ui.css, di parameters-col_name dan response-col_status ditambahi
    {width: auto}
     */

    export default {
        name: "SwaggerClient",
        // components: {SwaggerUI},
        data: function(){
          return {
              projectId: '',
              fileUrl: ''
          }
        },
        methods: {
            loadSwagger: function () {
                // https://forum.vuejs.org/t/swagger-ui-in-vue-js/38490
                // https://stackoverflow.com/questions/46237255/how-to-embed-swagger-ui-to-a-webpage
                const ui  = SwaggerUI({
                    dom_id: '#swagger-ui',
                    url: BASE_URL + this.fileUrl,
                })
            },
            loadData: function () {
                let p = this.$route.params
                this.projectId = p.projectId
                this.fileUrl = p.fileUrl
            },
            routeBack: function () {
                console.log('click route back');
                this.$router.push({
                    name: 'project-editor', params: {projectId: this.projectId}
                })
            },
        },
        mounted: function() {
            this.loadSwagger();
        },
        created() {
            this.loadData();
        },
        watch : {
            $route: function () {
                this.loadData()
            },
        }
    }
</script>

<style scoped>
</style>
