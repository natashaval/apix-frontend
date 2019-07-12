<template>
    <div>
    <button class="btn btn-outline-light float-left text-dark"><i class="fas fa-angle-left"></i> Back</button>
    <div id="swagger-ui">
    </div>
    </div>
</template>

<script>
    import 'swagger-ui/dist/swagger-ui.css'
    import SwaggerUI from 'swagger-ui'

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
                    url: 'http://localhost:8080' + this.fileUrl,
                })
            },
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            loadData: function () {
                let p = this.$route.params
                this.projectId = p.projectId
                this.fileUrl = p.fileUrl
            }
        },
        mounted: function() {
            this.$nextTick(function () {
                this.setLayout('all-layout');
            });
            this.loadSwagger();
        },
        created() {
            this.loadData();
        }
    }
</script>

<style scoped>
</style>