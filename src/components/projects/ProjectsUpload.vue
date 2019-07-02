<template>
    <!--https://serversideup.net/uploading-files-vuejs-axios/-->
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h3>Files Upload</h3>
                <input type="file" id="file" ref="file" multiple @change="handleFileUpload()"/>

                <div class="btn-group mb-2" role="group" aria-label="files upload">
                    <button class="btn btn-primary" @click="addFile()">Add Files</button>
                    <button class="btn btn-success" @click="submitFile()">Submit</button>
                    <!--                    <button class="btn btn-dark" @click="dumpFile()">Dump!</button>-->
                    <button class="btn btn-danger" @click="resetFile()">Reset</button>
                </div>

                <div v-for="(existFile,i) in files" :key="i">
                    <div class="row">
                        <div class="col-md-4">
                            <p class="font-weight-bold">{{ existFile.file.name }}</p>
                        </div>
                        <div class="col-md-4">
                            <span class="remove-file" @click="removeFile(i)"><i class="fas fa-times"></i> Remove</span>
                        </div>
                    </div>
                    <!--                                <progress max="100" :value.prop="existFile.uploadPercentage"></progress>-->
                    <div class="row">
                        <div class="col-md-1">
                            <p>Validation: </p>
                        </div>
                        <div class="col-md-6">
                            <span
                                    :class="{'text-danger': !existFile.status, 'text-success': existFile.status}"
                            >
                                {{existFile.message}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {BASE_URL} from "../../stores/actions/const";

    export default {
        name: "ProjectsUpload",
        data: function() {
            return {
                files: {},
                uploadPercentage: []
            }
        },
        methods: {
            handleFileUpload() {
                let uploadedFile = this.$refs.file.files; //upload multiple files
                for (var i = 0; i< uploadedFile.length; i++) {
                    // https://github.com/vuejs/vue/issues/4443
                    // -- error if file is declared in array should be an object
                    this.$set(this.files, i,
                        {
                            file: uploadedFile[i],
                            status: true,
                            message: '',
                            // uploadPercentage: 0
                        })
                }

            },
            submitFile(){
                const self = this;
                // console.log(self.files);

                for (var key in self.files) {

                    // self.files.forEach(function(value, i) {
                    let formData = new FormData();
                    const postFile = self.files[key];
                    formData.append('type', 'oas-swagger2');
                    formData.append('file', postFile['file']);

                    // Validation if file exists and file type is application/json
                    if (typeof postFile['file'].name === 'undefined') {
                        postFile.status = false;
                        postFile.message = 'File does not exists!';

                    } else if (postFile['file'].type !== 'application/json') {
                        postFile.status = false;
                        postFile.message = 'File type should be application/json';

                    } else {

                        axios.post(BASE_URL + 'projects/import', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            // https://serversideup.net/file-upload-progress-indicator-with-axios-and-vuejs/
                            // SUDAH BISA JALAN
                            // onUploadProgress: function (progressEvent) {
                            //     console.log('progressEvent', progressEvent.loaded, progressEvent.total)
                            //     postFile.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
                            // }
                        }).then((response) => {
                            console.log('SUCCESS!');
                            postFile.status = true;
                            postFile.message = 'OAS has been imported';
                        })
                            .catch(function (e) {
                                console.log('ERROR!', e);
                                postFile.status = false;
                                postFile.message = e.response.data.message;
                                // postFile.uploadPercentage = 0;
                            })

                    }
                }

                // });


            },
            addFile(){
                this.$refs.file.click();
            },
            removeFile(idx){
                console.log('remove clicked', idx)
                // delete this.files[idx];
                this.$delete(this.files, idx);
                console.log(this.files)
            },
            dumpFile(){
                console.log(this.files);
            },
            resetFile(){
                this.files = {};
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