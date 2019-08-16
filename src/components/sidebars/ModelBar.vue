<template>
    <li>
        <div class="sidebar-content row" style="height: 2em;" :class="{'active-bar':isActive}"
             @mouseover="onHover=true" @mouseleave="onHover=false">
            <p @click="definitionClick" class="ml-5 mt-1 shrinkable-text" style="width:75%;font-size: 0.9em;"
               name="definitionApi">
                <i class="fas fa-cube"></i> {{ definitionApi }}
            </p>
            <button v-if="onHover && editable" class="btn-circle ml-auto mr-3" @click="deleteDefinition">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    </li>
</template>

<script>
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil"
    import axios from "axios"
    import {makeToast} from "@/assets/toast"
    import EditorSwitchMixin from "@/mixins/EditorSwitchMixin"

    export default {
        name: "ModelBar",
        mixins : [EditorSwitchMixin],
        props: {
            definitionApi: String,
            definitionKey: String,
            projectApi: String,
            editable : Boolean
        },
        data: function(){
            return {
                onHover: false,
            }
        },
        computed: {
            isActive : function () {
                return this.$route.name === 'definition-editor' && this.$route.params.definitionApi === this.definitionApi
            },
            projectData : function () {
                return this.$store.getters['project/getProjectData']
            },
        },
        methods: {
            makeToast,
            definitionClick: function(){
                let callback = () => {
                    this.$router.push({
                        name: 'definition-editor',
                        params: {
                            projectId: this.projectApi,
                            definitionApi: this.definitionApi
                        }
                    })
                }
                this.$_EditorSwitch_changeRouteHandler(callback)

            },
            deleteDefinition: function (){
            let tree
                this.$toast.question('Are you sure to delete model \''+this.definitionApi+'\' ?',
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
                                tree = {_signature: this.projectData._signature, definitions : {}}
                                tree.definitions._actions = [{
                                    action: 'delete',
                                    key: this.definitionKey
                                }]

                                axios.put('http://localhost:8080/projects/'+this.projectApi, tree).then(
                                    (response) => {
                                        if(response.status === 200){
                                            this.projectData._signature = response.data.new_signature
                                            ActionExecutorUtil.executeActions(this.projectData.definitions, tree.definitions._actions)
                                            if(this.$route.params.definitionApi === this.definitionApi){
                                                this.$router.push({
                                                    name :'project-editor',
                                                    params : {
                                                        projectId : this.$route.params.projectId
                                                    }
                                                })
                                            }
                                        }
                                        this.makeToast('success', response.data.success, response.data.message)
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
                return tree.root
            }
        }
    }
</script>

<style scoped>
    li {
        list-style-type: none;
    }


</style>
