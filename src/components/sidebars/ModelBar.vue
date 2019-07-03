<template>
    <li>
        <div class="sidebar-content row" style="height: 2em;" :class="{'active-bar':isActive}"
             @mouseover="onHover=true" @mouseleave="onHover=false">
            <!--        <router-link :to="{name: 'definition-editor', params: {definitionApi: this.definitionApi} }" tag="li"-->
            <!--                     class="font-weight-light list-group-item border-0 py-0 shrinkable-text"-->
            <!--                     style="background-color: transparent;"-->
            <!--                     exact-active-class="active-bar"-->
            <!--        >-->
            <!--            <div v-show="onHover">-->
            <!--                <button class="btn-circle" @click="deleteDefinition">-->
            <!--                    <i style="font-size: 13px;" class="fas fa-trash"></i>-->
            <!--                </button>-->
            <!--            </div>-->
            <!--        </router-link>-->
            <p @click="definitionClick" class="col-10 ml-4" style="font-size: 1em;">{{ definitionApi }}</p>
            <div v-if="onHover">
                <button class="btn-circle" @click="deleteDefinition">
                    <i class="fas fa-trash"></i>
                </button>
<!--                <button class="btn-circle" @click="dumpDef">-->
<!--                    <i class="fas fa-times"></i>-->
<!--                </button>-->
            </div>
        </div>
    </li>
</template>

<script>
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";
    import axios from "axios";
    import {makeToast} from "../../assets/toast";

    export default {
        name: "ModelBar",
        props: {
            definitionApi: String,
            definitionKey: String,
            projectApi: String
        },
        data: function(){
            return {
                onHover: false,
                // isClick: false
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
                // this.isClick = !this.isClick
                // this.hover = true
                this.$router.push({
                    name: 'definition-editor',
                    params: {definitionApi: this.definitionApi }
                })
            },
            deleteDefinition: function () {
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
                                let tree = {_signature: this.projectData._signature, definitions : {}}
                                tree.definitions._actions = [{
                                    action: 'delete',
                                    key: this.definitionKey
                                }]
                                tree.definitions._hasActions = true

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


                                ).catch(function (e) {
                                    console.log(e);
                                    this.makeToast('danger', e.response.data.success, e.response.data.message)
                                })



                            }, true],
                            ['<button>NO</button>', function (instance, toast) {
                                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            }]
                        ]
                    })
            },
            dumpDef: function () {
                console.log(this.definitionKey)
            }
        }
    }
</script>

<style scoped>
    li {
        list-style-type: none;
    }

    /*https://stackoverflow.com/questions/46083220/how-to-vuejs-router-link-active-style

    li.router-link-exact-active {
        background-color: #17a2b8;
    }

    li:hover {
        background-color: #17a2b8;
        opacity: 1;
        color: white;
        cursor: pointer;
    }
     */
</style>
