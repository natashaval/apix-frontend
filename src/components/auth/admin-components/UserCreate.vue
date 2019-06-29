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

                        <b-input-group prepend="$">
                            <b-input id="input-password"
                                     placeholder="Password"
                                     v-model="user.password"
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
                    roles: []
                },
                optionRole: ['ROLE_USER', 'ROLE_ADMIN']
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
                // let payload = JSON.stringify(this.user)
                // console.log(payload)
                let payload = Object.assign({}, this.user);

                // this.makeToast('success', true, 'ini toast benar')

                axios.post(BASE_URL + 'admin/users', payload).then((response) => {
                    this.makeToast('success', response.data.success, response.data.message)
                    this.$store.dispatch('user/addUser', payload)
                }).catch((e) => {
                    console.error(e);
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