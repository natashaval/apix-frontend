<template>
    <!--https://serversideup.net/uploading-files-vuejs-axios/-->
    <div class="container">
        <div class="col-12">
            <label>File Upload</label>
            {{ valid }}
            <input type="file" id="file" ref="file" multiple @change="handleFileUpload()"/>
            <button @click="submitFile()">Submit</button>
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
                file: '',
                // valid: {
                //     status: null,
                //     message: ''
                // }
                valid: []
            }
        },
        methods: {
            handleFileUpload() {
                // this.file = this.$refs.file.files[0]; // upload single file
                this.file = this.$refs.file.files; //upload multiple files

                // this.valid.status = null;
                // this.valid.message = '';
                this.valid.length = 0;
            },
            submitFile(){
                console.log('File Length: ', this.file.length);
                for (var i = 0; i < this.file.length; i++) {

                    let formData = new FormData();
                    const file = this.file[i];
                    formData.append('type', 'oas-swagger2');
                    formData.append('file', file);

                    var validation = {
                        status: null,
                        message: ''
                    }
                    console.log(file);

                    // Validation if file exists and file type is application/json
                    if (typeof file.name === 'undefined') {
                        validation.status = false;
                        validation.message = 'File does not exists!';
                    } else if (file.type !== 'application/json') {
                        validation.status = false;
                        validation.message = 'File type should be application/json';
                    } else {

                        axios.post(BASE_URL + 'projects/import', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then(function () {
                            console.log('SUCCESS!');
                            validation.status = true;
                            validation.message = 'Importing OAS';
                        })
                            .catch(function (e) {
                                console.log('ERROR!', e);
                            })



                    }
                    this.valid.push(validation);
                }

            }
        }
    }
</script>

<style scoped>

</style>