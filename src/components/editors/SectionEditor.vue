<template>
    <div>
        <h1>section name : {{sectionApi}}</h1>

        <!--<div v-show="sectionApi">-->
            <!--{{sectionData.info}}-->
        <!--</div>-->

        <ul v-show="isEdited">
            <li><button @click="submit">Save</button></li>
            <li><button @click="cancel">Cancel</button></li>
        </ul>
        Name: <input class="form-control" v-model="name"/>
        Description:
            <vue-editor v-model="description"></vue-editor>

        <hr />
    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin"
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";
    import DeepTreeBuilderUtil from "../../utils/DeepTreeBuilderUtil";
    import { VueEditor } from 'vue2-editor'
    import * as axios from "axios"
    import {BASE_URL} from "../../stores/actions/const";
    import uuidv4 from 'uuid/v4';

    export default {
        name: "SectionEditor",
        props : ['projectId'],
        components: {VueEditor},
        mixins : [ChangeObserverMixin],
        data: function(){
            return {
                name: '',
                description: '',
                externalDocs: {},
                sectionApi: '',
                isEdited: false,
                isCreateNew: false,

                sectionActions: [],
                sectionRootActions: [],
                attributesKey: [{key : 'name'},{key : 'description'}],
            }
        },
        computed : {
            sectionData(){
                if(this.sectionApi){
                    return this.$store.getters['project/getSectionData'](this.sectionApi)
                }
                return undefined
            },
            projectData() {
                return this.$store.getters['project/getProjectData']
            }
        },
        methods: {
            loadData: function() {
                this.isEdited = false
                this.$_changeObserverMixin_unObserve()
                let p = this.$route.params
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi

                if (p.sectionApi === undefined) this.isCreateNew = true
                else if(this.sectionData){
                    this.isCreateNew = false
                    this.name = this.sectionData.info.name
                    this.description = this.sectionData.info.description
                    this.externalDocs = this.sectionData.info.externalDocs
                }

                this.isEdited = false
                this.$_changeObserverMixin_initObserver(['name', 'description'])
            },
            //override
            $_changeObserverMixin_onDataChanged : function (after,before) {
                this.isEdited = true
            },
            getData: function(){
              let res = {}
              res.name = this.name
              res.description = this.description
              res.externalDocs = this.$refs.external.getData()
              return res
            },
            submit: function(){
                this.isEdited = false

                let tree = undefined
                let callbacks = []
                let sectionQuery = [] // refer to PathEditor

                if (this.isCreateNew){ // refer to Definition Editor create new Definitions
                    // console.log('create new section')
                    tree = DeepTreeBuilderUtil.buildDeepTree(['sections'])
                    tree.root._signature = this.projectData._signature
                    let data = this.getData()
                    data._signature = uuidv4()
                    this.sectionRootActions = tree.leaf._actions = [{
                        action: 'put',
                        key: this.name,
                        value: {
                            info: data
                        }
                    }]
                    tree.leaf._hasActions = true

                    callbacks.push(() => {
                        ActionExecutorUtil.executeActions(this.projectData.sections, this.sectionRootActions)
                    })
                }
                else { // refer to Path Editor edit path, because also change path name in Side Bar
                    // console.log('edit section')
                    tree = DeepTreeBuilderUtil.buildDeepTree(['sections'])

                    if (this.sectionApi !== this.name) {
                        this.sectionRootActions = tree.leaf._actions = [{
                            action: 'rename',
                            key: this.sectionApi,
                            newKey: this.name
                        }]
                        callbacks.push(() => {
                            ActionExecutorUtil.executeActions(this.projectData.sections, this.sectionRootActions) // TIDAK YAKIN
                        })
                        tree.leaf._hasActions = true
                        tree.root._signature = this.projectData._signature // jika rename section, maka refer to project data signature

                        sectionQuery.push({
                            action: 'put',
                            key: 'name',
                            value: this.name
                        })
                    }

                    if (this.description !== this.sectionData.info.description){
                        sectionQuery.push({
                            action: 'put',
                            key: 'description',
                            value: this.description
                        })
                    }

                    tree.leaf[this.name] = {}
                    tree.leaf = tree.leaf[this.name].info = {
                        _actions: sectionQuery,
                        _hasActions: true
                    }

                    callbacks.push(() => {
                        ActionExecutorUtil.executeActions(this.sectionData.info, sectionQuery)
                    })

                    if (tree.root._signature === undefined) tree.leaf._signature = this.sectionData.info._signature

                }

                console.log('Tree: ', tree)

                axios.put(BASE_URL + 'projects/'+this.projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            if (tree.root._signature !== undefined) {
                                this.projectData._signature = response.data.new_signature
                                console.log('berhasil rename sections')
                            } // terjadi rename sections
                            else {
                                this.sectionData.info._signature = response.data.new_signature;
                                console.log('berhasil update section info saja')
                            }
                            callbacks.forEach(fn => fn())
                            this.$router.push({
                                name :'section-editor',
                                params: {sectionApi : this.name}
                            })
                        }
                    }
                ).catch(function (error) {
                    console.log(error);
                })


            },
            cancel: function(){
                console.log('cancel')
                this.isEdited = false
                this.loadData();
            },
        },
        mounted() {
            this.loadData()
        },
        watch : {
            $route: function () {
                this.loadData()
            },
            sectionData: function () {
                this.loadData()
            }
        }
    }
</script>

<style scoped>

</style>
