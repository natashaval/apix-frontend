<template>
    <div class="sidebar-content" @mouseover="onHover=true" @mouseleave="onHover=false" style="height: 2em;">
        <li style="padding-left: 4em;font-size: 14px" class="row">
            <div class="col-2" style="margin-top: 0.3em" v-html="operationBadge" @click="methodClick" ></div>
            <span class="shrinkable-text col-8" style="margin-top: 0.35em;" @click="methodClick">
                {{operationData.summary}}</span>
            <button class="btn-circle" style="margin-right: 1em;" @click="deleteOperation"
                    :class="onHover ? 'visible': 'invisible' ">
                <i style="font-size: 13px;" class="fas fa-trash"></i>
            </button>
        </li>
    </div>
</template>

<script>
    import DeepTreeBuilderUtil from "@/utils/DeepTreeBuilderUtil"
    import * as axios from "axios"
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";

    export default {
        name: "OperationBar",
        props : {
            projectApi : String,
            operationApi : String,
            pathApi : String,
            sectionApi : String,
            operationData : Object
        },
        data : ()=>({
            onHover : false
        }),
        computed: {
            operationBadge() {
                switch (this.operationApi) {
                    case "get":
                        return '<a class="badge badge-success" style="width: 4.5em;text-align: center">GET</a>'
                    case "head":
                        return '<a class="badge badge-success" style="width: 4.5em;text-align: center">HEAD</a>'
                    case "option":
                        return '<a class="badge badge-success" style="width: 4.5em;text-align: center">OPTION</a>'
                    case "post":
                        return '<a class="badge badge-warning" style="width: 4.5em;text-align: center">POST</a>'
                    case "patch":
                        return '<a class="badge badge-warning" style="width: 4.5em;text-align: center">PATCH</a>'
                    case "put":
                        return '<a class="badge badge-info" style="width: 4.5em;text-align: center">PUT</a>'
                    case "delete":
                        return '<a class="badge badge-danger" style="width: 4.5em;text-align: center">DELETE</a>'
                }
                return null
            },
            pathData : function () {
                return this.$store.getters['project/getPathData'](this.sectionApi,this.pathApi)
            }
        },
        methods : {
            methodClick : function () {
                this.$router.push({
                    name :'operation-editor',
                    params: {
                        sectionApi : this.sectionApi,
                        pathApi : this.pathApi,
                        operationApi : this.operationApi
                    }
                })
            },
            deleteOperation : function () {
                this.$toast.question('Are you sure to delete \''+this.operationApi+'\' operation of \''+this.pathApi+'\' ?',
                    'Confirmation', {
                        timeout: 20000,
                        close: false,
                        overlay: true,
                        toastOnce: true,
                        id: 'question',
                        zindex: 999,
                        position: 'center',
                        buttons: [
                            ['<button><b>YES</b></button>', (instance, toast) => {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                                let tree = DeepTreeBuilderUtil.buildDeepTree(['sections',this.sectionApi,'paths',this.pathApi])
                                tree.leaf._signature = this.pathData._signature
                                tree.leaf = tree.leaf.methods = {}
                                tree.leaf._actions = [{
                                    action: 'delete',
                                    key: this.operationApi
                                }]
                                tree.leaf._hasActions = true
                                axios.put('http://localhost:8080/projects/'+this.projectApi, tree.root).then(
                                    (response) => {
                                        if(response.status === 200){
                                            this.operationData._signature = response.data.new_signature
                                            ActionExecutorUtil.executeActions(this.pathData.methods, tree.leaf._actions)
                                            if(this.$route.params.operationApi === this.operationApi){
                                                this.$router.push({
                                                    name :'project-editor',
                                                    params : {
                                                        projectId : this.$route.params.projectId
                                                    }
                                                })
                                            }
                                        }
                                    }
                                ).catch(function (error) {
                                    console.log(error);
                                })

                            }, true],
                            ['<button>NO</button>', function (instance, toast) {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            }]
                        ]
                    })
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/app.css";

</style>
