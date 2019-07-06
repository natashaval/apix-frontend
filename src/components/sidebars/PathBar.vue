<template>
    <li>
        <div class="row sidebar-content" style="padding-left: 2.5em;height: 2em;"
             :class="{'active-bar':isActive}"
             @mouseover="onHover=true" @mouseleave="onHover=false">
            <button class="btn-circle"
                    :class="isArrow ? 'collapsed' : null"
                    :aria-controls="'link-'+pathApi"
                    @click = "isArrow = !isArrow">
                <i class="fas fa-caret-right" v-show="!isArrow"></i>
                <i class="fas fa-caret-down" v-show="isArrow"></i>
            </button>

            <p @click="pathClick" class="shrinkable-text col-9"
               style="font-size: 0.9em;margin-left: -1em;margin-top: 0.3em;">
                <i class="fas fa-link" style="font-size: 16px"></i> {{ pathApi }}
            </p>
            <div v-if="onHover && $_projectPrivilege_canEdit" class="row">
                <button class="btn-circle" @click="deletePath" style="z-index: 90">
                    <i style="font-size: 13px;" class="fas fa-trash"></i>
                </button>
                <button class="btn-circle" @click="createOperation">
                    <i style="font-size: 14px;" class="fas fa-plus-circle"></i>
                </button>
            </div>
        </div>
        <b-collapse :id="'link-'+pathApi" v-model="isArrow" v-if="pathData !== undefined" :style="{
            display : (hasActiveChild)?'block':'hidden'
        }">
            <OperationBar ref="operationBars"
                    v-for="(value,key) in pathData.methods" v-bind:key="key"
                          :project-api="projectApi"
                          :section-api="sectionApi" :path-api="pathApi"
                          :operation-data="value"
                          :operation-api="key"/>
        </b-collapse>
    </li>
</template>

<script>
    import OperationBar from "./OperationBar"
    import DeepTreeBuilderUtil from "@/utils/DeepTreeBuilderUtil"
    import * as axios from "axios"
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil"
    import ProjectPrivilegeMixin from "@/mixins/ProjectPrivilegeMixin";
    export default {
        name: "PathBar",
        components: {OperationBar},
        props : {
            projectApi : String,
            sectionApi : String,
            pathApi : String,
            pathData : Object
        },

        mixins : [ProjectPrivilegeMixin],
        data: function(){
            return {
                isArrow: false,
                onHover : false,
                operationBarRef : null
            }
        },
        computed : {
            sectionData(){
                if(this.sectionApi){
                    return this.$store.getters['project/getSectionData'](this.sectionApi)
                }
                return undefined
            },
            isActive : function () {
                return this.$route.name === 'path-editor' && this.$route.params.pathApi === this.pathApi
            },
            hasActiveChild : function () {
                if(this.operationBarRef){
                    return this.operationBarRef.find(bar => {
                        if(bar.isActive){
                            return true
                        }
                    }) !== undefined
                }
                return false
            }
        },
        methods : {
            pathClick : function(){
                this.$router.push({
                    name :'path-editor',
                    params: {sectionApi : this.sectionApi, pathApi : this.pathApi}
                })
            },
            createOperation : function () {
                this.$router.push({
                    name :'operation-create',
                    params: {sectionApi : this.sectionApi, pathApi : this.pathApi, operationApi : this.method}
                })
            },
            deletePath : function () {
                this.$toast.question('Are you sure to delete path \''+this.pathApi+'\' ?',
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
                                let tree = DeepTreeBuilderUtil.buildDeepTree(['sections',this.sectionApi])
                                tree.leaf._signature = this.sectionData._signature
                                tree.leaf = tree.leaf.paths = {}
                                tree.leaf._actions = [{
                                    action: 'delete',
                                    key: this.pathApi
                                }]
                                tree.leaf._hasActions = true
                                axios.put('http://localhost:8080/projects/'+this.projectApi, tree.root).then(
                                    (response) => {
                                        if(response.status === 200){
                                            this.sectionData._signature = response.data.new_signature
                                            ActionExecutorUtil.executeActions(this.sectionData.paths, tree.leaf._actions)
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
        },
        mounted() {
            this.operationBarRef = this.$refs['operationBars']
        }
    }
</script>

<style scoped>
    @import "../../assets/css/app.css";

</style>
