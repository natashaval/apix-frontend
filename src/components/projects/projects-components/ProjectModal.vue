<template>
    <div>
        <b-button v-b-modal="'project-modal'" variant="primary">New Project</b-button>

        <b-modal id="project-modal" ref="modal" size="lg"
                 title="Create New Project"
                 @show="resetModal"
                 @hidden="resetModal"
                 @ok="handleOk" ok-title="Save"
                 header-bg-variant="info"
        >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group :state="title.state" label="Title" label-for="title-input" :invalid-feedback="requiredField('Title')">
                    <b-form-input id="title-input" v-model="title.field" :state="title.state" required />
                </b-form-group>

                <b-form-group :state="version.state" label="Version" label-for="version-input" invalid-feedback="Version is required">
                    <b-form-input id="version-input" v-model="version.field" :state="version.state" required></b-form-input>
                </b-form-group>

                <b-form-group label="Host" label-for="host-input">
                    <b-form-input id="host-input" v-model="host.field"></b-form-input>
                </b-form-group>

                <b-form-group :state="basepath.state" label="basePath" label-for="basepath-input" :invalid-feedback="validBasePath()">
                    <b-form-input id="basepath-input" pattern="(\/)\w+" v-model="basepath.field" :state="basepath.state" title="Leading slash (/) is required"></b-form-input>
                </b-form-group>

            </form>

        </b-modal>

<!--        <b-button @click="makeToast('success', true, 'ini message')">Default</b-button>-->
    </div>
</template>

<script>
    import {BASE_URL} from "../../../stores/actions/const";
    import axios from 'axios';

    export default {
        name: "ProjectModal",
        data: function () {
            return {
                title: {
                    field: '',
                    state: null
                },
                version: {
                    field: '',
                    state: null
                },
                host: {
                    field: ''
                },
                basepath: {
                    field: '',
                    state: null
                },
                newProject: {
                    id: '',
                    // project: {}
                }
            }
        },
        methods: {
            checkFormValidity(){
                const valid = this.$refs.form.checkValidity()
                this.title.state = this.title.field.length > 0 ? 'valid' : 'invalid'
                this.version.state = this.version.field.length > 0 ? 'valid' : 'invalid'

                if (this.basepath.field.length > 0 && this.basepath.field.charAt(0) == '/') {
                    this.basepath.state = 'valid'
                }
                else if (this.basepath.field.length == 0) this.basepath.state = null
                else {
                    this.basepath.state = 'invalid'
                }

                return valid
            },
            validBasePath() {
                if(this.basepath.field.charAt(0) != '/' && this.basepath.field.length > 0) {
                    return 'Leading slash (/) is required'
                }
                return ''
            },
            requiredField(field){
                return field + ' is required'
            },
            resetModal() {
                this.title.field = ''
                this.title.state = null
                this.version.field = ''
                this.version.state = null
                this.host.field = ''
                this.basepath.field = ''
                this.basepath.state = null
            },
            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.submitModal()
            },
            submitModal() {
                if(!this.checkFormValidity()){
                    return
                }

                const newProject = {
                    host: this.host.field,
                    basePath: this.basepath.field,
                    info: {
                        title: this.title.field,
                        version: this.version.field
                    }
                }

                console.log(newProject)
                this.$store.dispatch('project/createProjectData', newProject)
                    .then((response) => {
                        console.log('diterima modal', response)

                        if (response.data.success && response.status == 201){
                            // alert(response.data.message)
                            // this.newProject.id = response.data.newProject.id
                            this.newProject.id = response.data.new_project
                            // this.newProject.project = response.data.newProject
                            console.log('newProject Id', this.newProject.id)
                            this.makeToast('success', response.data.success, response.data.message)

                            setTimeout(() => {
                                this.$router.push({
                                    name :'project-editor',
                                    params: {projectId : this.newProject.id}
                                })
                            }, 1500);


                        } else {
                            // alert('Error! '  + response.data.message)
                            this.makeToast('danger', response.data.success, response.data.message)
                        }

                    })

                this.$nextTick(() => {
                    this.$refs.modal.hide()

                })
            },
            makeToast(variant, success, message){
                this.$bvToast.toast(message, {
                    title: (success) ? 'Success' : 'Failed',
                    variant: variant,
                    // solid: true
                    autoHideDelay: 1000
                })
            }
        }
    }
</script>

<style scoped>

</style>