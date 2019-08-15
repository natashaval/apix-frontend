<template>
    <!--https://serversideup.net/uploading-files-vuejs-axios/-->
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <input type="file" id="file" ref="file" multiple @change="handleFileUpload()"/>

                <div class="btn-group mb-2" role="group" aria-label="files upload">
                    <button class="btn btn-primary" @click="addFile()">Add Files</button>
                    <button class="btn btn-success" @click="submitFile()">Submit</button>
                    <button class="btn btn-danger" @click="resetFile()">Reset</button>
                </div>

                <AssignComponent ref="assign" :assign-new="assignNew"></AssignComponent>

                <div v-for="(existFile,i) in files" :key="i">
                    <div class="row">
                        <div class="col-md-8">
                            <p class="font-weight-bold">{{ existFile.file.name }}</p>
                        </div>
                        <div class="col-md-4">
                            <span class="remove-file" @click="removeFile(i)"><i class="fas fa-times"></i> Remove</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <p>Validation: </p>
                        </div>
                        <div class="col-md-6">
                            <span
                                :class="{'text-danger': !existFile.status, 'text-success': existFile.status}">
                                {{existFile.message}}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {BASE_PROJECT_URL} from "@/stores/actions/const";
    import AssignComponent from "@/components/editors/editor-components/AssignComponent";

    export default {
        name: "ProjectImport",
        components: {AssignComponent},
        data: function() {
            return {
                files: {},
                uploadPercentage: [],
                assignNew: true
            }
        },
        methods: {
            handleFileUpload() {
                let uploadedFile = this.$refs.file.files; //upload multiple files
                for (var i = 0; i< uploadedFile.length; i++) {
                    this.$set(this.files, i,
                        {
                            file: uploadedFile[i],
                            status: true,
                            message: ''
                        })
                }

            },
            submitFile(){
                const self = this;

                for (var key in self.files) {

                    let formData = new FormData();
                    const postFile = self.files[key];
                    formData.append('file', postFile['file']);

                    let isNewTeam = this.$refs.assign.isNewTeam;
                    let team=  '';
                    if (isNewTeam) team = this.$refs.assign.inputTeamName;
                    else team = this.$refs.assign.selectedTeamName;
                    formData.append('isNewTeam', isNewTeam);
                    formData.append('team', team);

                    let filename = postFile['file'].name;
                    let type = filename.substr(filename.lastIndexOf('.') + 1);
                    formData.append('format', type.toUpperCase());
                    console.log(type);

                    // Validation if file exists and file type is application/json
                    if (typeof postFile['file'].name === 'undefined') {
                        postFile.status = false;
                        postFile.message = 'File does not exists!';
                    }
                    else if (type != 'json' && type !== 'yaml') {
                        postFile.status = false;
                        postFile.message = 'File type should be application/json';
                    }
                    else {
                        // console.log('success masuk ke else!');

                        axios.post(BASE_PROJECT_URL +'/import', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                        }).then((response) => {
                            console.log('SUCCESS!');
                            postFile.status = true;
                            postFile.message = 'OAS has been imported';
                            this.$emit('onImportComplete')
                        })
                        .catch(function (e) {
                            console.log('ERROR!', e);
                            postFile.status = false;
                            postFile.message = e.response.data.message;
                        })

                    }
                }
            },
            addFile(){
                this.$refs.file.click();
            },
            removeFile(idx){
                this.$delete(this.files, idx);
            },
            resetFile(){
                this.files = {};
                this.$refs.assign.isNewTeam = false;
                this.$refs.assign.inputTeamName = '';
                this.$refs.assign.selectedTeamName = '';
            }
        },
        watch: {
            files: {
                deep: true,
                handler() {

                }
            }
        }
    }
</script>

<style scoped>
    input[type="file"]{
        position: absolute;
        top: -500px;
    }

    span.remove-file {
        color: red;
        cursor: pointer;
    }
</style>
