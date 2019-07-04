<template>
    <div class="p-2">
        {{projectId}} {{sectionApi}} {{pathApi}} {{operationApi}}<br/>
        {{projectData.info}}<br/><br/> {{operationData.request.queryParams}}
        <form>
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
                    <button class="btn btn-primary" id="send-client"><i class="fas fa-paper-plane"></i> Send</button>
                </div>
            </div>

            <div class="row ml-1">
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
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "ClientEditor",
        props: {

        },
        data: function(){
            return {
                projectId: '',
                sectionApi: '',
                pathApi: '',
                operationApi: '',

                selectMethodOptions : [
                    {text : 'GET', value : 'get'},
                    {text : 'POST', value : 'post'},
                    {text : 'PUT', value : 'put'},
                    {text : 'DELETE', value : 'delete'},
                    {text : 'PATCH', value : 'patch'},
                    {text : 'HEAD', value : 'head'},
                    {text : 'OPTIONS', value : 'options'}
                ],
                showParams: false
            }
        },
        computed: {
            projectData : function () {
                return this.$store.getters['project/getProjectData']
            },
            operationData : function () {
                return this.$store.getters['project/getOperationData'](this.sectionApi,this.pathApi,this.operationApi)
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