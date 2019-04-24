<template>
    <div>
        <b-button v-b-modal="'project-modal'" variant="primary">New Project</b-button>

        <b-modal id="project-modal" ref="modal" size="lg"
                 title="Create New Project"
                 @show="resetModal"
                 @hidden="resetModal"
                 @ok="handleOk"
        >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group :state="title.state" label="Title" label-for="title-input" :invalid-feedback="requiredField('Title')">
                    <input id="title-input" v-model="title.field" :state="title.state" required></input>
                </b-form-group>

                <b-form-group :state="version.state" label="Version" label-for="version-input" invalid-feedback="Version is required">
                    <b-form-input id="version-input" v-model="version.field" :state="version.state" required></b-form-input>
                </b-form-group>

                <b-form-group label="Host" label-for="host-input">
                    <b-form-input id="host-input" v-model="host.field"></b-form-input>
                </b-form-group>

                <b-form-group :state="basepath.state" label="basePath" label-for="basepath-input" :invalid-feedback="validBasePath">
                    <b-form-input id="basepath-input" v-model="basepath.field" :state="basepath.state"></b-form-input>
                </b-form-group>

            </form>

        </b-modal>
    </div>
</template>

<script>
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
                }
            }
        },
        methods: {
            checkFormValidity(){
                const valid = this.$refs.form.checkValidity()
                this.title.state = this.title.state != null ? 'valid' : 'invalid'
                this.version.state = this.version.state != null ? 'valid' : 'invalid'
                this.validBasePath()
                return valid
            },
            validBasePath() {
                if(this.basepath.field[0] != '/' && this.basepath.field.length > 0) {
                    return 'Leading slash (/) is required'
                }
                else {
                    return ''
                }
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
                    basepath: this.basepath.field,
                    info: {
                        title: this.title.field,
                        version: this.version.field
                    }
                }

                console.log(newProject)
            }
        }
    }
</script>

<style scoped>

</style>