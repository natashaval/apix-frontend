<template>
    <li class="pr-0">
        <div class="sidebar-content pl-4 row" style="height: 2em;" :class="{'active-bar':isActive}"
             @mouseover="onHover=true" @mouseleave="onHover=false">
            <button class="btn-circle"
                    :class="isArrow ? 'collapsed' : null"
                    :aria-controls="'section-'+sectionApi"
                    @click = "isArrow = !isArrow">
                <i class="fas fa-caret-right" v-show="!isArrow"></i>
                <i class="fas fa-caret-down" v-show="isArrow"></i>
            </button>
            <span @click="gotoRoute" style="font-size: 1.2em;width: 70%;" class="shrinkable-text">
                <i class="fas fa-folder-open" style="font-size: 16px"></i> {{ sectionApi }}
            </span>
            <div v-if="onHover && editable" class="ml-auto" style="margin-right: 1.8em">
                <button class="btn-circle" @click="deleteSection">
                    <i style="font-size: 13px;" class="fas fa-trash"></i>
                </button>
                <button class="btn-circle" @click="createPath">
                    <i style="font-size: 14px;" class="fas fa-plus-circle"></i>
                </button>
            </div>

        </div>

        <b-collapse :id="'section-'+sectionApi" v-model="isArrow" :style="{
            display : (hasActiveChild)?'block':'hidden'
        }">
            <PathBar ref="pathBars"
                    v-for="pathData in orderedPath" v-bind:key="pathData.key"
                     :editable="editable"
                     :path-data="pathData.val"
                     :project-api="projectApi"
                     :section-api="sectionApi" :pathApi="pathData.key"/>
        </b-collapse>
    </li>
</template>

<script>

    import PathBar from './PathBar'
    import * as axios from "axios"
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil"
    import {BASE_PROJECT_URL} from "../../stores/consts/url";
    import EditorSwitchMixin from "../../mixins/EditorSwitchMixin";

    export default {
        name: "SectionBar",
        components : {
            PathBar
        },
        mixins : [EditorSwitchMixin],
        props : {
            projectApi : String,
            sectionApi : String,
            sectionData : Object,
            editable : Boolean
        },
        data: function() {
            return {
                onHover: false,
                isArrow: false,
                pathBarRef: null
            }
        },
        computed : {
            orderedPath : function (){
                let res = []
                let paths = this.sectionData.paths
                if(paths){
                    let keys = Object.keys(paths).sort()
                    keys.forEach(key => res.push({
                            key : key,
                            val : paths[key]
                        })
                    )
                }
                return res
            },
            projectData : function () {
                return this.$store.getters['project/getProjectData']
            },
            isActive : function () {
                return this.$route.name === 'section-editor' && this.$route.params.sectionApi === this.sectionApi
            },
            hasActiveChild : function () {
                if(this.pathBarRef){
                    return this.pathBarRef.find(bar => {
                        if(bar.isActive || bar.hasActiveChild){
                            return true
                        }
                    }) !== undefined
                }
                return false
            }
        },
        methods : {
            gotoRoute : function(){
                let callback = () => {
                    this.$router.push({
                        name :'section-editor',
                        params: {sectionApi : this.sectionApi}
                    })
                }
                this.$_EditorSwitch_changeRouteHandler(callback)

            },
            createPath : function () {
                this.$router.push({
                    name :'path-create',
                    params: {sectionApi : this.sectionApi}
                })
            },
            deleteSection : function () {
                this.$toast.question('Are you sure to delete section \''+this.sectionApi+'\' ?',
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
                                let tree = {_signature: this.projectData._signature, sections : {}}
                                tree.sections._actions = [{
                                    action: 'delete',
                                    key: this.sectionApi
                                }]
                                axios.put(BASE_PROJECT_URL+'/'+this.projectApi, tree).then(
                                    (response) => {
                                        if(response.status === 200){
                                            this.projectData._signature = response.data.new_signature
                                            ActionExecutorUtil.executeActions(this.projectData.sections, tree.sections._actions)
                                            if(this.$route.params.sectionApi === this.sectionApi){
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
            this.pathBarRef = this.$refs.pathBars
        }
    }
</script>

<style>
    @import "../../assets/css/app.css";
</style>
