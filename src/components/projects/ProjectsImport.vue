<template>
    <div>
        <vue-dropzone ref="dropzone" id="drop1"
                      :options="dropOptions"
        ></vue-dropzone>
<!--        {{// (token) ? 'adatoken': 'tidakada'}}-->
        <button @click="reset">Reset</button>
    </div>
</template>

<script>
    import vueDropzone from "vue2-dropzone";
    import 'vue2-dropzone/dist/vue2Dropzone.min.css';
    import {BASE_PROJECT_URL} from "../../stores/actions/const";

    export default {
        name: "ProjectsImport",
        components: {
            vueDropzone
        },
        data: function() {
            return {
                dropOptions: {
                    url: BASE_PROJECT_URL + '/import',
                    maxFilesize: 5, // 5 MB
                    chunking: true,
                    chunkSize: 1000, // Bytes
                    addRemoveLinks: true,
                    acceptedFiles: 'application/json,.json',
                    // language: {
                    dictDefaultMessage: '<h3><i class="fas fa-file-download"></i> Import project json here ... </h3>',
                    dictInvalidFileType: 'File type should be application/json!',
                    dictFileTooBig: 'File size is too large!',
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': 'Bearer ' + localStorage.getItem('apix-token')
                    }
                },
                apixToken: ''
            }
        },
        methods: {
            reset: () => {
                this.$refs.dropzone.removeAllFiles()
            },
            getToken: () => {
                // if(this.apixToken) {
                //     this.apixToken = localStorage.getItem('apix-token')
                //     console.log('get token from local storage')
                // } else {
                //     console.log('do nothing')
                // }
                console.log(localStorage.getItem('apix-token'))
                // this.apixToken = localStorage.getItem('apix-token')
                // console.log('apixToken', this.apixToken)
            }
        },
        created() {
            this.getToken();
        },
        // watch: {
        //     apixToken: function (newValue, oldValue) {
        //         console.log('watch', oldValue, newValue)
        //     }
        // }
    }
</script>

<style scoped>

</style>