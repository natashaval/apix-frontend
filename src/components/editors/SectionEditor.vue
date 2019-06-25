<template>
    <div>
        <h1>section name : {{sectionApi}}</h1>

        <!--{{sectionData.info}}-->

        <ul v-show="isEdited">
            <li><button @click="submit">Save</button></li>
            <li><button @click="cancel">Cancel</button></li>
        </ul>
        Name: <input class="form-control" v-model="name"/>
        Description:
        <vue-editor v-model="description"></vue-editor>

    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin"
    import ActionBuilderUtil from "../../utils/ActionBuilderUtil";
    import ActionExecutorUtil from "../../utils/ActionExecutorUtil";
    import DeepTreeBuilderUtil from "../../utils/DeepTreeBuilderUtil";
    import { VueEditor } from 'vue2-editor'
    import * as axios from "axios"
    import GeneralComponent from "./editor-components/GeneralComponent";

    export default {
        name: "SectionEditor",
        props : ['sectionApi','projectId'],
        components: {VueEditor},
        mixins : [ChangeObserverMixin],
        data: function(){
            return {
                name: '',
                description: '',
                externalDocs: {},
                isEdited: false,
                isCreateNew: false,

                sectionActions: [],
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
        },
        methods: {
            loadData: function() {
                this.isEdited = false
                this.$_changeObserverMixin_unObserve()
                let p = this.$route.params
                this.projectId = p.projectId
                this.sectionApi = p.sectionApi

                if (p.sectionApi == undefined) this.isCreateNew = true

                else if (this.sectionData && this.sectionData.info){
                    this.name = this.sectionData.info.name
                    this.description = this.sectionData.info.description
                    this.externalDocs = this.sectionData.info.externalDocs
                    this.isCreateNew = false
                }

                this.isEdited = false
                this.$_changeObserverMixin_initObserver(['name', 'description'])
            },
            //override
            $_changeObserverMixin_onDataChanged : function (after,before) {
                this.isEdited = true
            },
            submit: function(){
                console.log('submit')
                this.isEdited = false

                // let external = this.$refs.external.getData()
                // console.log('== from Child GeneralComp ===', external)
                let exActions = this.$refs.external.buildQuery()

                console.log('--EX actions--',exActions, 'sec act', this.sectionActions)

                let tree = undefined
                let signaturePointer = undefined

                if (this.isCreateNew){ // refer to Definition Editor create new Definitions
                    console.log('create new section')
                }
                else { // refer to Path Editor edit path, because also change path name in Side Bar
                    console.log('edit section')
                }

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