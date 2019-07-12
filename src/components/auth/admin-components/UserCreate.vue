<template>
    <div>
        <b-container fluid>
            <b-row>
                <b-col md="1">
                    <label>Create User: </label>
                </b-col>
                <b-col md="9">
                    <b-form inline @submit="onSubmit" @reset="onReset">
                        <b-form-input id="input-username"
                                      placeholder="Username"
                                      v-model="user.username"
                                      :state="nameState"
                                      aria-describedby="input-live-feedback"
                                      class="mb-2 mr-sm-2 mb-sm-0"
                                      trim
                        ></b-form-input>

                        <b-input-group class="mb-2 mb-sm-0 mr-sm-2">
                            <b-input-group-text slot="prepend"><i class="fas fa-key"></i></b-input-group-text>
                            <b-form-input id="input-password" :type="(showPassword) ? 'text' : 'password'"
                                     placeholder="Password" class="border-right-0"
                                     v-model="user.password"
                            ></b-form-input>
                            <b-input-group-append  v-if="!showPassword">
                                <b-button variant="outline-secondary" size="sm" @click="showPassword=true"
                                >
                                    <i class="far fa-eye-slash"></i>
                                </b-button>
                            </b-input-group-append>
                            <b-input-group-append  v-if="showPassword">
                                <b-button variant="outline-secondary" size="sm" @click="showPassword=false">
                                    <i class="far fa-eye"></i>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>

                        <b-input-group>
<!--                            <b-input-group-text slot="prepend"><i class="fas fa-key"></i></b-input-group-text>-->
                            <b-input id="input-confirm-password" type="password"
                                     placeholder="Confirm Password"
                                     v-model="user.confirmPassword"
                                     class="mb-2 mr-md-2 mb-sm-0"
                            ></b-input>
                        </b-input-group>

                        <b-form-group class="mr-md-2">
                            <b-form-checkbox-group
                                    v-model="user.roles"
                                    :options="optionRole"
                                    stacked
                            ></b-form-checkbox-group>
                        </b-form-group>

                        <b-button type="submit" variant="primary" class="mr-sm-2">Submit</b-button>
                        <b-button type="reset" variant="danger">Reset</b-button>

                        <b-form-invalid-feedback id="input-live-feedback">
                            Enter at least 4 letters
                        </b-form-invalid-feedback>

                    </b-form>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import {BASE_URL} from "../../../stores/actions/const";
    import axios from 'axios';
    import {makeToast} from '../../../assets/toast.js'

    export default {
        name: "UserCreate",
        data: function () {
            return {
                user: {
                    username: '',
                    password: '',
                    confirmPassword: '',
                    roles: []
                },
                optionRole: [
                    {text: 'asAdmin?', value: 'ROLE_ADMIN'},
                    // {text: 'asUser?', value: 'ROLE_USER'},
                ],
                showPassword: false
            }
        },
        computed: {
          nameState(){
              return this.user.username.length >= 4 ? true : false
          }
        },
        methods: {
            makeToast,
            onSubmit: function (evt) {
                evt.preventDefault()
                let payload = Object.assign({}, this.user);
                axios.post(BASE_URL + '/admin/users', payload).then((response) => {
                    this.makeToast('success', response.data.success, response.data.message)
                    payload.id = response.data.new_user
                    this.$store.dispatch('admin/addUser', payload)
                }).catch((e) => {
                    console.error(e);
                    this.makeToast('danger', e.response.data.success, e.response.data.message)
                })

            },
            onReset: function(evt){
                evt.preventDefault()
                this.user.username = ''
                this.user.password = ''
                this.user.roles = []
            }
        }
    }
</script>

<style scoped>

</style>
