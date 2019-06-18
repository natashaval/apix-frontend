<template>
    <div>
        <ul v-if="isEdited">
            <li><button @click="submit">Save</button></li>
            <li><button @click="cancel">Cancel</button></li>
        </ul>
        <input class="input-group" v-model="path"/>
        <div class="container">
            <vue-editor style="height: 100px;" v-model="description"></vue-editor>
        </div>
        <h2>Path Variables : </h2>
        <div v-for="(variable,idx) in variables" v-bind:key="variable.name">
            <DataTypeInput :editable="true"
                           :nameable="true"
                           :deleteable="false"
                           :schema-data="variable"
                           :disable-name="true"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                           ref="variables"
                           :component-id="idx"/>
        </div>

    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin"
    import DataTypeInput from "@/components/editors/editor-components/inputs/DataTypeInput"
    import * as axios from "axios";
    import uuidv4 from 'uuid/v4';
    import { VueEditor } from 'vue2-editor'
    import TreeBuilder from "../../utils/DeepTreeBuilderUtil";
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";


    export default {
        name: "PathEditor",
        components: {VueEditor,DataTypeInput},
        mixins : [ChangeObserverMixin],
        computed : {
            editable : function () {
                let hasEditingPrivilege = this.$store.getters['user/hasEditingPrivilege']
                if(hasEditingPrivilege === undefined)return false
                return hasEditingPrivilege
            },
            sectionData(){
                return this.$store.getters['project/getSectionData'](this.sectionApi)
            },
            pathData() {
                return this.$store.getters['project/getPathData'](this.sectionApi,this.pathApi)
            },
            pathVariables() {
                if(this.pathData !== undefined) {
                    return this.pathData.pathVariables
                }
                return undefined
            },
        },
        data : () => ({
            isEdited : false,
            projectId : undefined,
            sectionApi : undefined,
            pathApi : undefined,//akses param
            path : undefined,//model edit path
            variables : [],
            description : '',
            isCreateNew : false
        }),
        methods : {
            submit : function () {
                this.isEdited = false
                let commitFunctions = []

                let pathQuery = []
                let tree = TreeBuilder.buildDeepTree(
                    ['sections',this.sectionApi]
                )
                tree.leaf._signature = this.sectionData._signature
                tree.leaf = tree.leaf.paths = {}

                let variableData = {}
                this.$refs.variables.forEach(variable => {
                    variableData[variable.name] = variable.getData().attributes
                })

                let getPath = ()=>{
                    if(this.path[0] !== '/'){
                        return '/'+this.path
                    }
                    return this.path
                }

                if(this.isCreateNew){
                    tree.leaf._actions = [{
                        action : 'put',
                        key : getPath(),
                        value : {
                            description : this.description,
                            pathVariables : variableData,
                            _signature : uuidv4()
                        }
                    }]
                    tree.leaf._hasActions = true
                    commitFunctions.push(()=>{
                        ActionExecutorUtil.executeActions(this.sectionData.paths, tree.leaf._actions)
                    })
                }
                else{
                    if(this.pathApi !== this.path){
                        tree.leaf._actions = [{
                            action : 'rename',
                            key : this.pathApi,
                            newKey : getPath()
                        }]
                        commitFunctions.push(()=>{
                            ActionExecutorUtil.executeActions(this.sectionData.paths, tree.leaf._actions)
                            this.pathApi = getPath()
                        })
                        tree.leaf._hasActions = true
                    }
                    tree.leaf[this.path] = {
                        _actions : pathQuery,
                        _hasActions : true
                    }


                    pathQuery.push({
                        action : 'put',
                        key : 'pathVariables',
                        value : variableData
                    })

                    if(this.description !== this.pathData.description){
                        pathQuery.push({
                            action : 'put',
                            key : 'description',
                            value : this.description
                        })
                    }
                    commitFunctions.push(()=>{
                        ActionExecutorUtil.executeActions(this.pathData, pathQuery)
                    })

                }

                console.log(tree)
                axios.put('http://localhost:8080/projects/'+this.projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            this.sectionData._signature = response.data.new_signature
                            commitFunctions.forEach(fn => fn())
                            this.$router.push({
                                name :'path-editor',
                                params: {sectionApi : this.sectionApi, pathApi : this.path}
                            })
                        }
                    }
                ).catch(function (error) {
                    console.log(error);
                })


            },
            cancel : function () {
                this.loadData()
                this.isEdited = false
            },
            /**
             * @returns list of variable name(list of string)
             */
            getVars : function () {
                let newVars = this.path.match(/\/\{\w+?(?=\})\}/g)
                if(newVars === null)newVars = []
                return newVars.map(v => {
                    return v.replace('{','').replace('}','').replace('/','')
                }).filter((val,i,self) =>{
                    return self.indexOf(val) === i
                })
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                let p = this.$route.params
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi
                this.pathApi = p.pathApi
                this.path = this.pathApi
                if(p.pathApi === undefined){
                    this.isCreateNew = true
                }
                else{
                    this.isCreateNew = false
                }
                this.$_changeObserverMixin_initObserver(['path'])
            },
            //override
            $_changeObserverMixin_onDataChanged : function () {
                this.isEdited = true
            }
        },
        watch : {
            $route : function () {
                this.loadData()
            },
            //watch computed
            pathVariables : function () {
                let pv = this.pathVariables
                this.variables = []
                if(pv !== undefined){
                    let keys = this.getVars()
                    keys.forEach(key => {
                        this.variables.push(pv[key])
                    })
                }
            },
            path : function (after, before) {
                let newVars = this.getVars()
                let newLen = newVars.length

                //jika menghapus
                if(newLen < this.variables.length){
                    this.variables.forEach((variable,i) => {
                        let notExist = -1 === newVars.findIndex(val => val === variable.name)

                        if(notExist){
                            delete this.variables[i]
                        }
                    })
                    this.variables = this.variables.filter(val => val !== undefined)
                }
                else if(newLen > this.variables.length){
                    let curLen = this.variables.length
                    let hasInserted = false
                    for(let i = 0; i < curLen; ++i){
                        let key = this.variables[i].name
                        if(key !== newVars[i]){
                            this.variables.splice(i,0,{
                                name : newVars[i],
                                type : 'string'
                            })
                            hasInserted = true
                            break
                        }
                    }
                    if(!hasInserted){
                        this.variables.push({
                            name : newVars[newLen-1],
                            type : 'string'
                        })
                    }

                }
                else{
                    for(let i = 0; i < newLen; ++i){
                        let key = this.variables[i].name
                        if(key !== newVars[i]){
                            this.variables[i].name = newVars[i]
                        }
                    }

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
