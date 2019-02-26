<template>
    <div>
        <h1>method : {{operationApi}}</h1>
        <button @click="submit">Post Query!</button>
        <RequestComponent v-if="operationData !== undefined"
                          ref="request"
                          :operationData="operationData"/>
    </div>
</template>

<script>
    import RequestComponent from "./editor-components/RequestComponent";
    import TreeBuilder from "@/utils/DeepTreeBuilderUtil";
    export default {
        name: "OperationEditor",
        components: {RequestComponent},
        data : () => ({
            projectId : undefined,
            sectionApi : undefined,
            pathApi : undefined,
            operationApi : undefined
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
                tree.root.id = this.projectId
                let pointer = tree.leaf
                pointer._signature = this.operationData._signature

                this.$refs.request.getChangedData(tree.leaf,pointer.requestBody = {})
                console.log(tree)

            },
            loadData : function () {
                // console.log(this.$router)
                let p = this.$route.params
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi
                this.pathApi = p.pathApi
                this.operationApi = p.operationApi
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