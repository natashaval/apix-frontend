<template>
    <!--https://serversideup.net/uploading-files-vuejs-axios/-->
    <div class="container">
        <div class="col-12">
            <label>Files Upload</label>
            <input type="file" id="file" ref="file" multiple @change="handleFileUpload()"/>

            <div v-for="(existFile,key) in files" :key="key">
                {{ existFile.file.name }}
                <p>Validation: {{existFile.message}}</p>
                <span class="remove-file" @click="removeFile(idx)">Remove</span>
            </div>

            <button @click="addFile()">Add Files</button>
            <button @click="submitFile()">Submit</button>
            <button @click="dumpFile()">Dump!</button>
            <button @click="resetFile()">Reset</button>

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
            }
        },
        methods: {
            handleFileUpload() {
                let uploadedFile = this.$refs.file.files; //upload multiple files
                for (var i = 0; i< uploadedFile.length; i++) {
                    // https://github.com/vuejs/vue/issues/4443
                    // -- error if file is declared in array should be an object
                    this.$set(this.files, i, {file: uploadedFile[i], status: true, message: ''})
                }

            },
            submitFile(){
                const self = this;

                for (var key in self.files) {

                    let formData = new FormData();
                    const postFile = self.files[key];
                    formData.append('type', 'oas-swagger2');
                    formData.append('file', postFile['file']);

                    console.log(postFile);

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
                            }
                        }).then(function () {
                            console.log('SUCCESS!');
                            postFile.status = true;
                            postFile.message = 'OAS has been imported!';
                        })
                            .catch(function (e) {
                                console.log('ERROR!', e);
                            })

                    }

                }

            },
            addFile(){
                this.$refs.file.click();
            },
            removeFile(idx){
                delete this.files[idx];
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