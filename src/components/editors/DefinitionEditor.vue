<template>
    <div>
        <EditorHeaderComponent :isEdited="isEdited" :editable="$_projectPrivilege_canEdit"
                               :submit="submit" :cancel="cancel" :name="editorTitle"></EditorHeaderComponent>

        <div class="form-row ml-1 mr-1 dot-border">
            <div class="col-11">
                <slot v-if="isEditing">
                    <div class="form-group">
                        <label class="font-weight-bold">Name :</label>
                        <b-form-group class="mb-2 w-100"
                                      :state="definitionState" :invalid-feedback="definitionInvalidFeedback">
                            <b-input class="form-control w-100" :state="definitionState" trim v-model="name" name="definition-name"></b-input>
                        </b-form-group>
                    </div>
                </slot>
                <slot v-else>
                    <h6 class="font-weight-bold">Name :</h6>
                    <h6>{{name}}</h6>
                </slot>
            </div>
            <div class="col-1">
                <button v-if="$_projectPrivilege_canEdit" @click="isEditing = !isEditing"
                        class="float-right round-button btn mt-2" v-bind:id="_uid+'-edit-btn'">
                    <i class="fa fa-pencil-alt"></i>
                </button>
            </div>
        </div>
        <div class="form-row ml-1 mr-1 dot-border">
            <label class="font-weight-bold w-100">Model :</label>
            <BodyForm :body-data="schemaData" ref="root" class="col-12"
                      :editable="$_projectPrivilege_canEdit"
                      :$_changeObserverMixin_parent="$_changeObserverMixin_this"/>
        </div>
    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import DeepTreeBuilderUtil from "@/utils/DeepTreeBuilderUtil";
    import uuidv4 from 'uuid/v4';
    import ActionBuilderUtil from "@/utils/ActionBuilderUtil";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import * as axios from "axios";
    import EditorHeaderComponent from "./editor-components/EditorHeaderComponent";
    import {COMPLETE, NOT_FOUND} from "@/stores/consts/FetchStatus";
    import ProjectPrivilegeMixin from "@/mixins/ProjectPrivilegeMixin";
    import BodyForm from "./editor-components/forms/BodyForm";
    import {BASE_PROJECT_URL} from "@/stores/actions/const";
    import KeyCheckerUtil from "@/utils/KeyCheckerUtil";

    export default {
        name: "DefinitionEditor",
        components: {BodyForm, EditorHeaderComponent},
        mixins : [ChangeObserverMixin, ProjectPrivilegeMixin],
        props: {
            definitionApi : {
                type : String
            }
        },
        data : () => ({
            name : '',
            description : '',
            isEdited : false,
            isEditing : false,
            isCreateNew : true,
            attributesKey : ['name','description'],
            definitionsRootActions : [],
            definitionActions : []
        }),
        computed: {
            definitionState : function () {
                return this.$_changeObserverMixin_isValid('name')
            },
            definitionInvalidFeedback : function(){
                return this.$_changeObserverMixin_getErrors('name')[0]
            },
            editorTitle : function (){
                let name = (this.definitionApi)?this.definitionApi:'New Definition'
                return '<h4><i class="fas fa-cube"></i> '+ name +'</h4>'
            },
            projectFetchState : function (){
                return this.$store.getters['project/getState']
            },
            projectData : function () {
                return this.$store.getters['project/getProjectData']
            },
            definitionData : function() {
                return this.$store.getters['project/getDefinitionDataByName'](this.definitionApi)
            },
            schemaData : function () {
                return (this.definitionData !== undefined)?this.definitionData : undefined
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
                    this.isCreateNew = true
                }
                this.$_changeObserverMixin_initObserver([{
                    model : 'name',
                    validator : () => {
                        if(this.name === this.definitionApi)return []
                        let definitions = this.$store.getters['project/getDefinitions']
                        for(let key in definitions){
                            if(definitions.hasOwnProperty(key)){
                                if(definitions[key].name === this.name){
                                    return ['Model name must be unique']
                                }
                            }
                        }
                        let validatorResult = KeyCheckerUtil.validateKey(this.name)
                        if(!validatorResult.isValid){
                            return [validatorResult.message]
                        }

                        return []
                    }
                },'description'])
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
                let res = this.$refs.root.getData()
                res.name = this.name
                return res
            },
            getActions : function () {
                return ActionBuilderUtil.createActions(this.definitionData,this._data,this.attributesKey)
            },
            submit : function () {

                if(!this.$_changeObserverMixin_allIsValid()){
                    this.$bvToast.toast('Can\'t submit due to invalid input', {
                        title: 'Failed',
                        variant: 'danger'
                    })
                    return
                }

                let tree = undefined
                let callbacks = []
                let signaturePointer = undefined
                if(this.isCreateNew){
                    tree = DeepTreeBuilderUtil.buildDeepTree(['definitions'])
                    signaturePointer = this.projectData
                    tree.root._signature = signaturePointer._signature
                    let data = this.getData()
                    data._signature = uuidv4()
                    let tmp = tree.leaf._actions = [{
                        action : 'put',
                        key : uuidv4(),
                        value : data
                    }]
                    callbacks.push(()=>{
                        ActionExecutorUtil.executeActions(this.$store.getters['project/getDefinitions'], tmp)
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
                    tree.leaf._actions = this.getActions()

                    let callback = this.$refs.root.buildQuery(tree.leaf)
                    if(callback !== undefined){
                        callbacks.push(callback)
                    }
                    if(tree.leaf._actions && tree.leaf._actions.length === 0){
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

                axios.put(BASE_PROJECT_URL+'/'+this.projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            signaturePointer._signature = response.data.new_signature
                            callbacks.forEach(fn => fn())
                            this.reloadData()
                        }
                    }
                ).catch(error => {
                    this.$bvToast.toast(error.response.data.message + ' , Please refresh the page.', {
                        title: 'Failed',
                        variant: 'danger'
                    })
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
                    (this.projectFetchState === NOT_FOUND) ||
                    (this.projectFetchState === COMPLETE && this.definitionData === undefined)
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
