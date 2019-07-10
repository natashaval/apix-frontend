<template>
    <div class="sidebar-content" @mouseover="onHover=true" @mouseleave="onHover=false" style="height: 2em;"
         :class="{'active-bar':isActive}">
        <li style="padding-left: 4em;font-size: 14px" class="row">
            <div class="col-2" style="margin-top: 0.3em" v-html="operationBadge" @click="methodClick" ></div>
            <span class="shrinkable-text col-8" style="margin-top: 0.35em;" @click="methodClick">
                {{operationData.summary}}</span>
            <button v-if="$_projectPrivilege_canEdit" class="btn-circle ml-0" @click="deleteOperation"
                    :class="onHover ? 'visible': 'invisible' ">
                <i style="font-size: 13px;" class="fas fa-trash"></i>
            </button>
        </li>
    </div>
</template>

<script>
    import DeepTreeBuilderUtil from "@/utils/DeepTreeBuilderUtil"
    import * as axios from "axios"
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil"
    import ApixUtil from "@/utils/ApixUtil"
    import BadgeGeneratorUtil from "@/utils/BadgeGeneratorUtil"
    import ProjectPrivilegeMixin from "@/mixins/ProjectPrivilegeMixin";
    import EditorSwitchMixin from "@/mixins/EditorSwitchMixin";

    export default {
        name: "OperationBar",
        props : {
            projectApi : String,
            operationApi : String,
            pathApi : String,
            sectionApi : String,
            operationData : Object
        },
        mixins : [ProjectPrivilegeMixin, EditorSwitchMixin],
        data : ()=>({
            onHover : false
        }),
        computed: {
            operationBadge() {
                let badgeClass = BadgeGeneratorUtil.getBadgeClassOfOperation(this.operationApi)
                return '<a class="'+badgeClass+'" style="width: 4.5em;text-align: center">'+this.operationApi.toUpperCase()+'</a>'
            },
            pathData : function () {
                return this.$store.getters['project/getPathData'](this.sectionApi,this.pathApi)
            },
            isActive : function () {
                return this.$route.name === 'operation-editor' &&
                    ApixUtil.isEqualObjectByKeys(this.$route.params, this.$props, ['sectionApi','pathApi','operationApi'])
            }
        },
        methods : {
            methodClick : function () {
                let callback = () => {
                    this.$router.push({
                        name: 'operation-editor',
                        params: {
                            sectionApi: this.sectionApi,
                            pathApi: this.pathApi,
                            operationApi: this.operationApi
                        }
                    })
                }

                this.$_EditorSwitch_changeRouteHandler(callback)

            },
            clientClick: function(){
                this.$router.push({
                    name :'client-editor',
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
                                ).catch(error => {
                                    this.$bvToast.toast(error.response.data.message + ' , Please refresh the page.', {
                                        title: 'Failed',
                                        variant: 'danger'
                                    })
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
