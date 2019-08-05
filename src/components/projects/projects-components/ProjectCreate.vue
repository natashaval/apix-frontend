<template>
    <div>
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-row>
                <b-col cols="8">
                    <b-form-group :state="title.state" label="Title" label-for="title-input" :invalid-feedback="requiredField('Title')">
                        <b-form-input id="title-input" v-model="title.field" :state="title.state" required />
                    </b-form-group>
                </b-col>
                <b-col cols="4">
                    <b-form-group :state="version.state" label="Version" label-for="version-input" invalid-feedback="Version is required">
                        <b-form-input id="version-input" v-model="version.field" :state="version.state" required></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="6">
                    <b-form-group label="Host" label-for="host-input">
                        <b-form-input id="host-input" v-model="host.field"></b-form-input>
                    </b-form-group>
                </b-col>

                <b-col cols="6">
                    <b-form-group :state="basepath.state" label="basePath" label-for="basepath-input" :invalid-feedback="validBasePath()">
                        <b-form-input id="basepath-input" pattern="(\/)\w+" v-model="basepath.field" :state="basepath.state" title="Leading slash (/) is required"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <AssignComponent ref="assign" :assign-new="assignNew"></AssignComponent>
                </b-col>
            </b-row>
            <button class="mt-3 btn btn-success float-right" @click="handleOk">submit</button>
        </form>

    </div>
</template>

<script>
    import {makeToast} from "@/assets/toast";
    import AssignComponent from "@/components/editors/editor-components/AssignComponent";
    import {USER_REQUEST} from "@/stores/actions/user";

    export default {
        name: "ProjectModal",
        components: {AssignComponent},
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
                },
                assignNew: true
            }
        },
        methods: {
            makeToast,
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

                let isNewTeam = this.$refs.assign.isNewTeam;
                let team = ''
                if (isNewTeam) {
                    team = this.$refs.assign.inputTeamName;
                }
                else {
                    team = this.$refs.assign.selectedTeamName;
                }

                const newProject = {
                    host: this.host.field,
                    basePath: this.basepath.field,
                    team: team,
                    isNewTeam: isNewTeam,
                    info: {
                        title: this.title.field,
                        version: this.version.field
                    }
                }

                console.log(newProject)

                this.$store.dispatch('project/createProjectData', newProject)
                    .then((response) => {
                        if (response.data.success && response.status == 201){

                            this.newProject.id = response.data.new_project
                            console.log('newProject Id', this.newProject.id)
                            this.makeToast('success', response.data.success, response.data.message, 1000)
                            this.$store.dispatch('user/' + USER_REQUEST)

                            setTimeout(() => {
                                this.$router.push({
                                    name :'project-editor',
                                    params: {projectId : this.newProject.id}
                                })
                            }, 1500);

                        } else {
                            this.makeToast('danger', response.data.success, response.data.message)
                        }

                    })


                this.$nextTick(() => {
                    this.$refs.modal.hide()

                })
            },
        }
    }
</script>

<style scoped>

</style>
