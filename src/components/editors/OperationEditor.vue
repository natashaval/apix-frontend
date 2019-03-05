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
                          :operationData="operationData"/>
    </div>
</template>

<script>
    import RequestComponent from "./editor-components/RequestComponent";
    import TreeBuilder from "@/utils/DeepTreeBuilderUtil";
    import * as axios from "axios";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";

    export default {
        name: "OperationEditor",
        components: {RequestComponent},
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
                let tree = TreeBuilder.buildDeepTree(this.treeKeys)
                let pointer = tree.leaf
                pointer._signature = this.operationData._signature

                let callback = this.$refs.request.buildQuery(tree.leaf,pointer.requestBody = {})

                axios.put('http://localhost:8080/projects/'+this.projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            callback()
                            this.operationData._signature = response.data.new_signature
                            this.reloadData()
                        }
                    }
                ).catch(function (error) {
                    console.log(error);
                })
                this.isEdited = false
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