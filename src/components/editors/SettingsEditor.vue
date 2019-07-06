<template>
    <div>
        <div class="row my-3" v-if="apiData">
            <h3>{{ apiData.info.title }}</h3>
        </div>
        <div class="row my-3">
            <div class="col-5">
            <h5>Generate Codegen</h5>
            <small>It is used to generate code of Model </small>
            </div>
            <div class="col-2">
                <button class="btn btn-success btn-block" @click="generateCodegen">Generate</button>
            </div>
        </div>

        <div class="row my-3">
            <div class="col-5">
                <h5>Export Project</h5>
                <small>It is used to export project in the form of JSON format.
                    <span class="font-italic">Default type: oas-swagger2</span>
                </small>
                <p v-show="fileExportLocation">File location: {{ fileExportLocation }}</p>
            </div>
            <div class="col-2">
                <button class="btn btn-primary btn-block" @click="exportOas">Export</button>
            </div>
        </div>

        <div class="row my-3">
            <div class="col-5">
                <h5>Delete Project</h5>
                <small>Are you sure to delete this project?</small>
            </div>
            <div class="col-2">
                <button class="btn btn-danger btn-block" @click="deleteOas">Delete</button>
            </div>
        </div>

        <AssignComponent :project-id="projectId"></AssignComponent>


    </div>
</template>

<script>
    import axios from 'axios';
    import {BASE_PROJECT_URL, BASE_URL} from "../../stores/actions/const";
    import {makeToast} from "../../assets/toast";
    import AssignComponent from "./editor-components/AssignComponent";

    export default {
        name: "SettingsEditor",
        components: {AssignComponent},
        data: function(){
            return {
                projectId: '',
                fileExportLocation: ''
            }
        },
        computed: {
            apiData : function () {
                return this.$store.getters['project/getProjectData']
            },
        },
        methods: {
            makeToast,
            loadData: function(){
                this.projectId = this.$route.params.projectId
            },
            generateCodegen: function () {
                axios.post(BASE_PROJECT_URL +'/'+ this.projectId + '/codegen').then((response) => {
                    this.makeToast('success', response.data.success, response.data.message)
                }).catch((e) => {
                    this.makeToast('danger', e.response.data.success, e.response.data.message)
                })
            },
            exportOas: function(){
                let self = this
                this.$toast.question('Please insert project type!', 'Export', {
                    timeout: 20000,
                    close: true,
                    drag: false,
                    overlay: true,
                    toastOnce: true,
                    id: 'export',
                    zindex: 999,
                    position: 'center',
                    inputs: [
                        ['<input type="text" />', 'change', function(instance, toast, input, e) {
                            console.log(input.value)
                            // this.projectTitleVerify = input.value
                        }, true],
                    ],
                    buttons: [
                        ['<button class="btn btn-sm ml-1">Export</button>', function (instance, toast, button, e, inputs) {

                            if (inputs[0].value === 'oas-swagger2'){
                                axios.post(BASE_PROJECT_URL +'/'+ self.projectId + '/export?type=' + inputs[0].value)
                                    .then((response) => {
                                    self.makeToast('success', response.data.success, response.data.message)
                                    self.fileExportLocation = response.data.file_url
                                }).catch((e) => {
                                    self.makeToast('danger', e.response.data.success, e.response.data.message)
                                })
                            }
                            else {
                                self.makeToast('warning', false, 'Wrong type! Use default type')
                            }
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');


                        }, false]
                    ]
                })
            },
            deleteOas: function () {
                let self = this
                this.$toast.error('Please re-type this project name', 'Delete', {
                    timeout: 20000,
                    close: true,
                    drag: false,
                    overlay: true,
                    toastOnce: true,
                    id: 'delete',
                    zindex: 999,
                    position: 'center',
                    inputs: [
                        ['<input type="text" />', 'change', function(instance, toast, input, e) {
                            console.log(input.value)
                            // this.projectTitleVerify = input.value
                        }, true],
                    ],
                    buttons: [
                        ['<button class="btn btn-sm btn-outline-danger ml-1">Delete</button>', function (instance, toast, button, e, inputs) {
                            if (inputs[0].value === self.apiData.info.title && self.apiData){
                                axios.delete(BASE_PROJECT_URL +'/'+ self.projectId).then((response) => {
                                    self.makeToast('success', response.data.success, response.data.message)
                                    self.$router.push({
                                        name :'project-repo'
                                    })
                                }).catch((e) => {
                                    self.makeToast('danger', e.response.data.success, e.response.data.message)
                                })
                            }
                            else {
                                self.makeToast('warning', false, 'Wrong project name!')
                            }
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                        }, false]
                    ]
                })
            }
        },
        created() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
