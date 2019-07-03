<template>
    <div>
        <SaveComponent :isEdited="isEdited"
                       :submit="submit" :cancel="cancel"></SaveComponent>
        <div class="form-group">
            <label class="font-weight-bold">Name :</label>
            <input v-model="name" class="form-control"/>
        </div>
        <div class="form-group">
            <label class="font-weight-bold">Description:</label>
            <vue-editor v-model="description"></vue-editor>
        </div>
        <div class="container" style="padding-left: 60px">
            <HighLvlJsonEditor :schema-data="schemaData" ref="root"
                           :nameable="false"
                           :deleteable="false"
                           :fixed-name="'schema'"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>
        </div>
    </div>
</template>

<script>
    import HighLvlJsonEditor from "./editor-components/inputs/HighLvlJsonEditor";
    import { VueEditor } from 'vue2-editor'
    import ChangeObserverMixin from "../../mixins/ChangeObserverMixin";
    import DeepTreeBuilderUtil from "../../utils/DeepTreeBuilderUtil";
    import uuidv4 from 'uuid/v4';
    import ActionBuilderUtil from "../../utils/ActionBuilderUtil";
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";
    import * as axios from "axios";
    import SaveComponent from "./editor-components/SaveComponent";
    import {COMPLETE, NOT_FOUND} from "../../stores/consts/FetchStatus";

    export default {
        name: "DefinitionEditor",
        components: {SaveComponent, HighLvlJsonEditor,VueEditor},
        mixins : [ChangeObserverMixin],
        props: {
            definitionApi : {
                type : String
            }
        },
        data : () => ({
            name : '',
            description : '',
            isEdited : false,
            isCreateNew : true,
            attributesKey : [{key : 'name'},{key : 'description'}],
            definitionsRootActions : [],
            definitionActions : []
        }),
        computed: {
            projectState : function (){
                return this.$store.getters['project/getState']
            },
            projectData : function () {
                return this.$store.getters['project/getProjectData']
            },
            definitionData : function() {
                return this.$store.getters['project/getDefinitionDataByName'](this.definitionApi)
            },
            schemaData : function () {
                return (this.definitionData !== undefined)?this.definitionData.schema : undefined
            },
            definitionId : function () {
                let defs = this.$store.getters['project/getDefinitions']
                if(defs === undefined)return ''
                let res = Object.keys(defs).find(key => {
                    return this.definitionApi === defs[key].name
                })
                return (res === undefined)?'':res
            },
            projectId : function () {
                return this.$route.params.projectId
            }
        },
        methods : {
            loadData : function () {
                this.isEdited = false
                this.$_changeObserverMixin_unObserve()
                if(this.definitionData !== undefined){
                    this.description = this.definitionData.description
                }
                if(this.definitionApi !== undefined){
                    this.name = this.definitionApi
                    this.isCreateNew = false
                }
                else {
                    this.name = ''
                    this.description = ''
                }
                this.$_changeObserverMixin_initObserver(['name','description'])
            },
            reloadData : function () {
                this.loadData()
                this.$refs.root.reloadData()
            },
            //override
            $_changeObserverMixin_onDataChanged : function (after,before) {
                this.isEdited = true
            },
            getData : function () {
                let res = {}
                res.description = this.description
                res.name = this.name
                res.schema = this.$refs.root.getData()
                return res
            },
            getActions : function () {
                return ActionBuilderUtil.createActions(this.definitionData,this._data,this.attributesKey)
            },
            commitChange : function () {
                ActionExecutorUtil.executeActions(this.$store.getters['project/getDefinitions'], this.definitionsRootActions)
                ActionExecutorUtil.executeActions(this.definitionData, this.definitionActions)
            },
            submit : function () {

                let tree = undefined
                let callbacks = []
                this.definitionActions = []
                this.definitionsRootActions = []
                let signaturePointer = undefined
                if(this.isCreateNew){
                    tree = DeepTreeBuilderUtil.buildDeepTree(['definitions'])
                    signaturePointer = this.projectData
                    tree.root._signature = signaturePointer._signature
                    let data = this.getData()
                    data._signature = uuidv4()
                    this.definitionsRootActions = tree.leaf._actions = [{
                        action : 'put',
                        key : uuidv4(),
                        value : data
                    }]
                    tree.leaf._hasActions = true
                    callbacks.push(()=>{
                        this.$router.push({
                            name :'definition-editor',
                            params: {
                                definitionApi : this.name
                            }
                        })
                    })
                }
                else{
                    tree = DeepTreeBuilderUtil.buildDeepTree(['definitions',this.definitionId])
                    signaturePointer = this.definitionData
                    tree.leaf._signature = signaturePointer._signature
                    tree.leaf._actions = this.definitionActions = this.getActions()
                    tree.leaf._hasActions = true

                    let callback = this.$refs.root.buildQuery(tree.leaf)
                    if(callback !== undefined)callbacks.push(callback)

                    if(tree.leaf._actions.length === 0){
                        delete tree.leaf._hasActions
                        delete tree.leaf._actions
                    }
                    if(this.name !== this.definitionData.name){
                        callbacks.push(()=>{
                            this.$router.push({
                                name :'definition-editor',
                                params: {
                                    definitionApi : this.name
                                }
                            })
                        })
                    }
                }
                console.log(tree)

                axios.put('http://localhost:8080/projects/'+this.projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            signaturePointer._signature = response.data.new_signature
                            this.commitChange()
                            callbacks.forEach(fn => fn())
                            this.reloadData()
                        }
                    }
                ).catch(function (error) {
                    console.log(error);
                })


            },
            cancel : function () {
                this.reloadData()
            }
        },
        watch : {
            $route : function () {
                this.loadData()
            },
            definitionData : function () {
                this.loadData()
            },
            projectState : function () {
                if(
                    (this.projectState === NOT_FOUND) ||
                    (this.projectState === COMPLETE && this.definitionData === undefined)
                ){
                    this.$router.push({
                        name :'project-editor',
                        params : {
                            projectId : this.$route.params.projectId
                        }
                    })
                }
            }
        },
        mounted() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
