<template>
    <div>
        <vue-dropzone ref="dropzone" id="drop1"
                      :options="dropOptions"
        ></vue-dropzone>
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
        data: () => {
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

                    // }
                },
                // langSettings: {
                //     dictDefaultMessage: '<i class="fas fa-cloud-download">Import Projects</i>'
                // }
            }
        },
        methods: {
            reset: () => {
                this.$refs.dropzone.removeAllFiles()
            }
        }
    }
</script>

<style scoped>

</style>