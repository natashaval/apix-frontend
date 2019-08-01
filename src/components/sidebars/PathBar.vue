<template>
    <li>
        <div class="row sidebar-content row" style="padding-left: 2.5em;height: 2em;"
             :class="{'active-bar':isActive}"
             @mouseover="onHover=true" @mouseleave="onHover=false">
            <button class="btn-circle"
                    :class="isArrow ? 'collapsed' : null"
                    :aria-controls="'link-'+pathApi"
                    @click = "isArrow = !isArrow">
                <i class="fas fa-caret-right" v-show="!isArrow"></i>
                <i class="fas fa-caret-down" v-show="isArrow"></i>
            </button>

            <span @click="pathClick" class="shrinkable-text ml-1"
               style="width: 68%;font-size: 0.9em;margin-left: -1em;margin-top: 0.3em;">
                <i class="fas fa-link" style="font-size: 16px"></i> {{ pathApi }}
            </span>
            <div v-if="onHover && editable" class="ml-auto" style="margin-right: 1.8em">
                <button class="btn-circle" @click="deletePath" style="">
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
                          :editable="editable"
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
    import EditorSwitchMixin from "@/mixins/EditorSwitchMixin";
    import {EditorHeader} from "../../utils/GlobalVars"
    export default {
        name: "PathBar",
        components: {OperationBar},
        mixins : [EditorSwitchMixin],
        props : {
            projectApi : String,
            sectionApi : String,
            pathApi : String,
            pathData : Object,
            editable : Boolean
        },
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
            },
        },
        methods : {
            pathClick : function(){
                let callback = () => {
                    this.$router.push({
                        name: 'path-editor',
                        params: {sectionApi: this.sectionApi, pathApi: this.pathApi}
                    })
                }
                this.$_EditorSwitch_changeRouteHandler(callback)
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
        },
        mounted() {
            this.operationBarRef = this.$refs['operationBars']
        }
    }
</script>

<style scoped>
    @import "../../assets/css/app.css";

</style>
