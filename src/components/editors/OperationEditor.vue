<template>
    <div>
        <ul v-if="isEdited">
            <li><button @click="submit">Save</button></li>
            <li><button @click="cancel">Cancel</button></li>
        </ul>
        <h1>method : {{operationApi}}</h1>
        <div v-if="dataUpdated">
            <h2>data Updated</h2>
        </div>
        <RequestComponent v-if="operationData !== undefined"
                          ref="request"
                          :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                          :operation-data="operationData"/>
        <ResponseComponent v-if="operationData !== undefined"
                           ref="response"
                           :responses-data="operationData.responses"
                           :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"/>
    </div>
</template>

<script>
    import RequestComponent from "./editor-components/RequestComponent";
    import TreeBuilder from "@/utils/DeepTreeBuilderUtil";
    import * as axios from "axios";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import ResponseComponent from "./editor-components/ResponseComponent";

    export default {
        name: "OperationEditor",
        components: {ResponseComponent, RequestComponent},
        mixins : [ChangeObserverMixin],
        data : () => ({
            projectId : undefined,
            sectionApi : undefined,
            pathApi : undefined,
            operationApi : undefined,
            dataUpdated : false,
            isEdited : false
        }),
        computed : {
            treeKeys : function () {
                return [
                    'sections',this.sectionApi,
                    'paths',this.pathApi,
                    'methods',this.operationApi
                ]
            },
            operationData : function(){
                return this.$store.getters['project/getOperationData'](this.sectionApi,this.pathApi,this.operationApi)
            }
        },
        methods : {
            submit : function () {
                try{
                    let tree = TreeBuilder.buildDeepTree(this.treeKeys)
                    let pointer = tree.leaf
                    pointer._signature = this.operationData._signature

                    let callbacks = []

                    let callback = this.$refs.request.buildQuery(tree.leaf,pointer.requestBody = {})
                    if(callback === undefined){
                        delete pointer.requestBody
                    }
                    else{
                        callbacks.push(callback)
                    }

                    callback = this.$refs.response.buildQuery(pointer.responses = {})
                    if(callback === undefined){
                        delete pointer.responses
                    }
                    else{
                        callbacks.push(callback)
                    }

                    console.log(tree)
                    axios.put('http://localhost:8080/projects/'+this.projectId,tree.root).then(
                        (response) => {
                            if(response.status === 200){
                                callbacks.forEach(fn => fn())
                                this.operationData._signature = response.data.new_signature
                                this.reloadData()
                            }
                        }
                    ).catch(function (error) {
                        console.log(error);
                    })
                    this.isEdited = false
                }
                catch (e) {
                    console.log(e)
                }
            },
            cancel : function () {
                this.reloadData()
            },
            loadData : function () {
                this.isEdited = false
                let p = this.$route.params
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi
                this.pathApi = p.pathApi
                this.operationApi = p.operationApi
                this.$_changeObserverMixin_initObserver()
            },
            reloadData : function () {
                this.loadData()
                this.$refs.request.reloadData()
                this.$refs.response.reloadData()
            },
            //override
            $_changeObserverMixin_onDataChanged : function () {
                this.isEdited = true
            }

        },
        watch : {
            $route : function () {
                this.loadData()
            }
        },
        created() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>