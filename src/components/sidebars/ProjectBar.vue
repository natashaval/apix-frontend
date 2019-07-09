<template>
    <div v-if="apiData.info !== undefined" class="my-1">
        <h4 @click="projectClick" class="text-center">{{apiData.info.title}}</h4>
        <b-button pill variant="outline-info" size="sm" class="offset-4" @click="tryClient">
            <i class="fas fa-paper-plane"></i> Try in Client</b-button>
    </div>
</template>

<script>
    import {BASE_PROJECT_URL} from "../../stores/actions/const";
    import axios from 'axios';
    import {makeToast} from "../../assets/toast";

    export default {
        name: "ProjectBar",
        props : {
            apiData: Object,
        },
        data: function(){
            return {
                fileExportLocation: ''
            }
        },
        methods : {
            makeToast,
            projectClick : function(){
                this.$router.push({
                    name :'project-editor',
                    params: {projectId : this.apiData.id}
                })
            },
            tryClient: function () {
                axios.post(BASE_PROJECT_URL +'/'+ this.apiData.id + '/export?type=oas-swagger2&format=JSON')
                    .then((response) => {
                        // self.makeToast('success', response.data.success, response.data.message)
                        this.fileExportLocation = response.data.file_url

                        this.$router.push({
                            name :'swagger-client',
                            params: {projectId : this.apiData.id, fileUrl : this.fileExportLocation}
                        })

                    }).catch((e) => {
                    this.makeToast('danger', e.response.data.success, e.response.data.message)
                })
            }
        }
    }
</script>

<style scoped>

</style>
