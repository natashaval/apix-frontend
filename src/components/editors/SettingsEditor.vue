<template>
    <div class="ml-3">
        <div class="row my-3" v-if="apiData">
            <h3>{{ apiData.info.title }}</h3>
        </div>
        <div>
            <div class="row my-3">
                <div class="col-9">
                    <h5>Generate Source Code &nbsp;&nbsp;<b-spinner small variant="success" v-show="codegenStatus"></b-spinner></h5>
                    <small>Generate Source Code from API Spec</small>
                </div>
                <div class="col-2">
                    <button class="btn btn-success btn-block" @click="generateCodegen">Generate</button>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-9">
                    <h5>Export Project &nbsp;&nbsp;<b-spinner small variant="primary" v-show="exportStatus"></b-spinner></h5>
                    <small>Export this project's API Spec to JSON/YAML file</small>
                </div>
                <div class="col-2">
                    <button class="btn btn-primary btn-block" @click="exportOas">Export</button>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-9">
                    <h5>Delete Project</h5>
                    <small>Are you sure to delete this project?</small>
                </div>
                <div class="col-2">
                    <button class="btn btn-danger btn-block" @click="deleteOas">Delete</button>
                </div>
            </div>
        </div>
        <div class="h-25"></div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {BASE_PROJECT_URL, BASE_URL} from "../../stores/actions/const"
    import {makeToast} from "../../assets/toast"

    export default {
        name: "SettingsEditor",
        data: function(){
            return {
                projectId: '',
                fileExportLocation: '',
                fileCodegenLocation: '',
                codegenStatus: false,
                exportStatus: false
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
                this.codegenStatus = true
                axios.get(BASE_PROJECT_URL +'/'+ this.projectId + '/codegen', {
                    // onDownloadProgress: (progressEvent) => {
                    //     let percentCompleted = parseInt(Math.round( (progressEvent.loaded * 100) / progressEvent.total));
                    //     // https://stackoverflow.com/questions/52030158/can-we-use-ondownloadprogress-from-axios-for-loading-api
                    //     console.log(progressEvent.lengthComputable);
                    //     console.log('codegen: ' + percentCompleted);
                    // }
                }).then((response) => {
                    this.makeToast('success', response.data.success, "Success in generating codegen!")
                    this.fileCodegenLocation = response.data.file_url
                    this.codegenStatus = false
                    window.open(BASE_URL+response.data.file_url,'_blank')
                }).catch((e) => {
                    this.makeToast('danger', e.response.data.success, e.response.data.message)
                    this.codegenStatus = false
                })

            },
            exportOas: function(){
                let self = this
                self.exportStatus = true
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
                        // ['<input type="text" />', 'change', function(instance, toast, input, e) {
                        //     console.log(input.value)
                        //     // this.projectTitleVerify = input.value
                        // }, true],
                        // https://github.com/marcelodolza/iziToast/issues/98
                        ['<select>' +
                        '   <option value="JSON">json</option>' +
                        '   <option value="YAML">yaml</option>' +
                        '</select>', 'change', function(instance, toast,select, e){
                            console.log(select.options[select.selectedIndex].value)
                        }]
                    ],
                    buttons: [
                        ['<button class="btn btn-sm ml-1">Export</button>', function (instance, toast, button, e, inputs) {
                            axios.get(BASE_PROJECT_URL +'/'+ self.projectId
                                + '/export?'+'format='+inputs[0].options[inputs[0].selectedIndex].value)
                                .then((response) => {
                                    self.makeToast('success', response.data.success, response.data.message)
                                    self.fileExportLocation = response.data.file_url
                                    self.exportStatus = false
                                    window.open(BASE_URL+response.data.file_url,'_blank')
                                }).catch((e) => {
                                self.makeToast('danger', e.response.data.success, e.response.data.message)
                                self.exportStatus = false
                            })
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                        }, false]
                    ],
                    onClosing: function(instance, toast,closedBy) {
                        self.exportStatus = false
                    },
                    onClosed: function (instance, toast, closedBy) {
                        self.exportStatus = false
                    }
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
