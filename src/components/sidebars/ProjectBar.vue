<template>
    <div class="my-1">
        <h4 @click="projectClick" class="text-center">{{projectTitle}}</h4>
        <button name="swagger-client" type="button" class="btn offset-4 btn-outline-info btn-sm rounded-pill" @click="tryClient">
            <i class="fas fa-paper-plane"></i> Try in Client
        </button>
    </div>
</template>

<script>
    import {BASE_PROJECT_URL} from "@/stores/consts/url";
    import axios from 'axios';
    import {makeToast} from "@/assets/toast";
    import EditorSwitchMixin from "@/mixins/EditorSwitchMixin";

    export default {
        name: "ProjectBar",
        mixins : [EditorSwitchMixin],
        props : {
            apiData: Object,
        },
        data: function(){
            return {
                fileExportLocation: '',
            }
        },
        computed : {
            projectTitle : function () {
                if(this.apiData){
                    if(this.apiData.info)
                        return this.apiData.info.title
                }
                return undefined
            }
        },
        methods : {
            makeToast,
            projectClick : function(){
                let callback = () => {
                    this.$router.push({
                        name: 'project-editor',
                        params: {projectId: this.apiData.id}
                    })
                }
                this.$_EditorSwitch_changeRouteHandler(callback)
            },
            tryClient: function () {
                axios.get(BASE_PROJECT_URL +'/'+ this.apiData.id + '/export?format=JSON')
                    .then((response) => {
                        this.fileExportLocation = response.data.file_url

                        this.$router.push({
                            name :'swagger-client',
                            params: {projectId : this.apiData.id, fileUrl : this.fileExportLocation}
                        })

                    }).catch((e) => {
                    this.makeToast('danger', e.response.data.success, e.response.data.message)
                })
                return true;
            }
        }
    }
</script>

<style scoped>

</style>
