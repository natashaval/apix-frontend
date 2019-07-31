<template>
    <div class="p-2">
        <!--{{projectId}} {{sectionApi}} {{pathApi}} {{operationApi}}<br/>-->
        <!--{{pathData}}<br/><br/> -->
        {{operationData}}
        <form @submit.prevent="onSubmit">
            <div class="row">
                <div class="form-group col-md-4">
                    <label class="font-weight-bold">Method :</label>
                    <b-select class="form-control" v-model="operationApi" :options="selectMethodOptions"></b-select>
                </div>
                <div class="form-group col-md-6">
                    <label class="font-weight-bold">Path :</label>
                    <b-input class="form-control" v-model="fullPath"></b-input>
                </div>
                <div class="form-group col-md-2">
                    <label for="send-client" class="invisible font-weight-bold">Send</label><br />
                    <button type="submit" class="btn btn-primary" id="send-client"><i class="fas fa-paper-plane"></i> Send</button>
                </div>
            </div>

            <!--div class="row ml-1">
                <b-button size="sm"
                          :class = "showParams ? 'collapsed' : null"
                          :aria-expanded="showParams ? 'true' : 'false' "
                          aria-controls="collapse-model"
                          @click="showParams = !showParams"
                >
                    <i class="fas fa-caret-down" v-show="showParams"></i>
                    <i class="fas fa-caret-right" v-show="!showParams"></i>
                    Query Parameters
                </b-button>
            </div>
            <div class="row ml-1">
                <b-collapse id="collapse-model" v-model="showParams" class="mt-2 col-md-12">
                    <div class="row">
                        <div class="col">Key</div>
                        <div class="col">Value</div>
                        <div class="col">Description</div>
                        <div class="col"></div>
                    </div>
                    <div class="form-row mb-2" v-for="(param, i) in operationData.request.queryParams" :key="i">
                        <div class="col">
                            <input type="text" class="form-control form-control-sm" :value="param.name" placeholder="Key" />
                        </div>
                        <div class="col">
                            <input type="text" class="form-control form-control-sm" :value="param.example" placeholder="Value" />
                        </div>
                        <div class="col">
                            <input type="text" class="form-control form-control-sm" :value="param.description" placeholder="Description" />
                        </div>
                        <div class="col pt-2">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                </b-collapse>
            </div-->
            <div class="row">
                <div class="col-md-12">
                <b-tabs content-class="mt-3" justified>
                    <b-tab title="Query Parameters" active>
                        <div class="form-row mb-1" v-for="(param, i) in operationData.request.queryParams" :key="i">
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" :value="param.name" placeholder="Key" />
                            </div>
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" :value="param.example" placeholder="Value" />
                            </div>
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" :value="param.description" placeholder="Description" />
                            </div>
                            <div class="col pt-2">
                                <i class="fas fa-times"></i>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Path Variables">
                        <div class="form-row mb-1" v-for="(pathVar, p) in pathData.pathVariables" :key="pathVar.name">
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" :value="pathVar.name" readonly />
                            </div>
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" placeholder="Value" />
                            </div>
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" placeholder="Description" />
                            </div>
                            <div class="col pt-2">
                                <i class="fas fa-times invisible"></i>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Headers">
                        <div class="form-row mb-1" v-if="operationData.consumes">
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" value="Content-Type" />
                            </div>
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" :value="operationData.consumes[0]" />
                            </div>
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" placeholder="Description" />
                            </div>
                            <div class="col pt-2">
                                <i class="fas fa-times"></i>
                            </div>
                        </div>

                        <div class="form-row" v-if="operationData.produces">
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" value="Accept" />
                            </div>
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" :value="operationData.produces[0]" />
                            </div>
                            <div class="col">
                                <input type="text" class="form-control form-control-sm" placeholder="Description" />
                            </div>
                            <div class="col pt-2">
                                <i class="fas fa-times"></i>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Body">
                        <b-form-group>
                            <b-form-radio inline v-model="selectedBody" value="none">None</b-form-radio>
                            <b-form-radio inline v-model="selectedBody" value="form">Form-Data</b-form-radio>
                            <!--<b-form-radio inline v-model="selectedBody" value="text">Text</b-form-radio>-->
                        </b-form-group>

                        <div v-if="selectedBody == 'none'">
                            <small>This request does not have a body</small>
                        </div>
                        <div v-if="selectedBody == 'form'">
                            <div class="form-row mb-1"  v-for="(reqBody, i) in operationData.request.schema.properties" :key="i">
                                <div class="col">
                                    <input type="text" class="form-control form-control-sm" :value="reqBody.name" />
                                </div>
                                <div class="col">
                                    <input type="text" class="form-control form-control-sm" />
                                </div>
                                <div class="col">
                                    <input type="text" class="form-control form-control-sm" placeholder="Description" />
                                </div>
                                <div class="col pt-2">
                                    <i class="fas fa-times"></i>
                                </div>
                            </div>
                        </div>
                        <!--<div v-if="selectedBody == 'text'">-->
                            <!--<LowLvlJsonEditor :json-input="operationData.request.schema"></LowLvlJsonEditor>-->
                            <!--<AceEditor @init="editorInit" lang="json" theme="apix" :options="editorOptions"></AceEditor>-->
                            <!--{{ requestBody }}-->
                        <!--</div>-->
                    </b-tab>
                </b-tabs>
                </div>
            </div>
        </form>

        <div class="row">
            <h3>Response</h3>

        </div>
    </div>
</template>

<script>
    import AceEditor from 'vue2-ace-editor';
    import LowLvlJsonEditor from "./editor-components/inputs/LowLvlJsonEditor";

    export default {
        name: "ClientEditor",
        components: {LowLvlJsonEditor, AceEditor},
        props: {

        },
        data: function(){
            return {
                projectId: '',
                sectionApi: '',
                pathApi: '',
                operationApi: '',
                requestBody: '',

                selectMethodOptions : [
                    {text : 'GET', value : 'get'},
                    {text : 'POST', value : 'post'},
                    {text : 'PUT', value : 'put'},
                    {text : 'DELETE', value : 'delete'},
                    {text : 'PATCH', value : 'patch'},
                    {text : 'HEAD', value : 'head'},
                    {text : 'OPTIONS', value : 'options'}
                ],
                selectedBody: 'none',
                showParams: false,
                editorOptions:{
                    fontSize: 12,
                    fontFamily: 'monospace'
                },
            }
        },
        computed: {
            projectData : function () {
                return this.$store.getters['project/getProjectData']
            },
            pathData() {
                if(this.sectionApi && this.pathApi){
                    return this.$store.getters['project/getPathData'](this.sectionApi,this.pathApi)
                }
                return undefined
            },
            operationData : function () {
                if (this.sectionApi && this.pathApi && this.operationApi) {
                    return this.$store.getters['project/getOperationData'](this.sectionApi, this.pathApi, this.operationApi)
                }
                return undefined
            },
            fullPath: function(){
                return 'http://' + this.projectData.host + this.projectData.basePath + this.pathApi;
            }

        },
        methods: {
            loadData: function(){
                let p = this.$route.params
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi
                this.pathApi = p.pathApi
                this.operationApi = p.operationApi
            },
            editorInit : function () {
                require('brace/mode/json');
                require('@/assets/apix-ace-editor-theme');
            },
            onSubmit: function(){
                let form = $(form).serializeArray();
                console.log(form);
            }
        },
        watch: {
            $route : function () {
                this.loadData()
            },
        },
        mounted() {
            this.loadData()
        },
    }
</script>

<style scoped>

</style>