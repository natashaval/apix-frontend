<template>
    <!--https://serversideup.net/uploading-files-vuejs-axios/-->
    <div class="container">
        <div class="col-12">
            <label>File Upload</label>
            {{ error.message }}
            <input type="file" id="file" ref="file" @change="handleFileUpload()"/>
            <button @click="submitFile()">Submit</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {BASE_URL} from "../../../stores/actions/const";

    export default {
        name: "ProjectsUpload",
        data: function() {
            return {
                file: '',
                error: {
                    status: false,
                    message: ''
                }
            }
        },
        methods: {
            handleFileUpload() {
                this.file = this.$refs.file.files[0]; // upload single file
            },
            submitFile(){
                let formData = new FormData();
                const file = this.file;
                formData.append('type', 'oas-swagger2');
                formData.append('file', file);

                if (typeof file.name === 'undefined') {
                    this.error.status = true;
                    this.error.message = 'File does not exists!';
                    return false;
                }

                else if (file.type !== 'application/json') {
                    this.error.status = true;
                    this.error.message = 'File type should be application/json';
                    return false;
                }

                else {
                    axios.post(BASE_URL + 'projects/import', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(function () {
                        console.log('SUCCESS!');
                    })
                        .catch(function (e) {
                            console.log('ERROR!', e);
                        })

                    this.error.message = '';
                    this.error.status = false;
                }

            }
        }
    }
</script>

<style scoped>

</style>