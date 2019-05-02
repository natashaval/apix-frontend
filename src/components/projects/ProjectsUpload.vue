<template>
    <!--https://serversideup.net/uploading-files-vuejs-axios/-->
    <div class="container">
        <div class="col-12">
            <label>Files Upload</label>
            <input type="file" id="file" ref="file" multiple @change="handleFileUpload()"/>

            <!--<ImportList :file="existFile" v-for="(existFile,key) in file" :key="key"></ImportList>-->
            =====
            <div v-for="(existFile,key) in files" :key="key">
                {{ existFile.file.name }}
                <p>Validation: {{existFile.message}}</p>
                <span class="remove-file" @click="removeFile(idx)">Remove</span>
            </div>

            <!--div class="col-12">
                <div v-for="idx in parseInt(file.length)" :key="idx" class="file-listing">
                    Filename: {{file[idx].name}} <span class="remove-file" @click="removeFile(idx)">Remove</span>
                    isValid: {{valid[idx]}}
                </div>
            </div-->

            <button @click="addFile()">Add Files</button>
            <button @click="submitFile()">Submit</button>
            <button @click="dumpFile()">Dump!</button>
            <button @click="resetFile()">Reset</button>

            <b-form-file v-model="file2" multiple></b-form-file>
            <div class="mt-3">Selected file:
                <div v-for="bootFile in file2" :key="bootFile.name">
                    {{bootFile.name}}
                    {{bootFile.message}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {BASE_URL} from "../../stores/actions/const";
    import ImportList from "./projects-components/ImportList";

    export default {
        name: "ProjectsUpload",
        components: {ImportList},
        data: function() {
            return {
                // file: '',
                // valid: {
                //     status: null,
                //     message: ''
                // }
                files: {},
                file2: null
                // valid: []
            }
        },
        methods: {
            handleFileUpload() {
                // this.file = this.$refs.file.files[0]; // upload single file
                let uploadedFile = this.$refs.file.files; //upload multiple files
                for (var i = 0; i< uploadedFile.length; i++) {
                    // https://github.com/vuejs/vue/issues/4443
                    // -- error if file is declared in array should be an object
                    // this.file.push(uploadedFile[i]);
                    this.$set(this.files, i, {file: uploadedFile[i], status: true, message: ''})
                }

                // this.valid.status = null;
                // this.valid.message = '';
                // this.valid.length = 0;
            },
            submitFile(){
                const self = this;

                for (var key in self.files) {

                    let formData = new FormData();
                    const postFile = self.files[key];
                    formData.append('type', 'oas-swagger2');
                    formData.append('file', postFile['file']);

                    // var validation = {
                    //     status: true,
                    //     message: ''
                    // }
                    console.log(postFile);

                    // Validation if file exists and file type is application/json
                    if (typeof postFile['file'].name === 'undefined') {
                        // validation.status = false;
                        // validation.message = 'File does not exists!';
                        // self.$set(postFile, 'status', false);
                        // self.$set(postFile, 'message', 'File does not exists!');
                        postFile.status = false;
                        postFile.message = 'File does not exists!';

                    } else if (postFile['file'].type !== 'application/json') {
                        // validation.status = false;
                        // validation.message = 'File type should be application/json';
                        // self.$set(postFile, 'status', false);
                        // self.$set(postFile, 'message', 'File type should be application/json!');
                        postFile.status = false;
                        postFile.message = 'File type should be application/json';

                    } else {
                        axios.post(BASE_URL + 'projects/import', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then(function () {
                            console.log('SUCCESS!');
                            // self.$set(postFile, 'status', true);
                            // self.$set(postFile, 'message', 'OAS has been imported!');
                            postFile.status = true;
                            postFile.message = 'OAS has been imported!';
                        })
                            .catch(function (e) {
                                console.log('ERROR!', e);
                            })

                    }
                    // this.valid.push(validation);
                    // Object.assign(postFile, validation);
                }

            },
            addFile(){
                this.$refs.file.click();
            },
            removeFile(idx){
                // this.files.splice(key, 1);
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
                    console.log('The filelist has changed');
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