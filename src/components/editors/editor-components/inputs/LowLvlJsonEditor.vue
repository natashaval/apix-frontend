<template>
 <div style="height: 40em">
     <AceEditor v-model="jsonText" @init="editorInit()" lang="json" theme="apix" :options="editorOptions"
                style="height: 100%;width: 100%;" disabled></AceEditor>
 </div>
</template>

<script>
    import AceEditor from 'vue2-ace-editor';
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import JsonOasUtil from "@/utils/JsonOasUtil";
    import {makeToast} from "@/assets/toast";

    export default {
        name: "LowLvlJsonEditor",
        components : {AceEditor},
        mixins : [ChangeObserverMixin],
        props : {
            jsonInput : {
                type : Object,
                required : false
            },
            editable : {
                type : Boolean,
                default : true
            }
        },
        data : () => ({
            jsonText : '',
            isEdited : false
        }),
        computed : {
            editorOptions : function () {
                return {
                    fontSize: 12,
                    fontFamily: 'monospace',
                    readOnly: !this.editable
                }
            },
            definitionMap : function () {
                let idToName = {}
                let nameToId = {}

                let definitions = this.$store.getters['project/getDefinitions']
                if(definitions){
                    Object.keys(definitions).forEach( key => {
                        idToName['#/definitions/'+key] = '#/definitions/'+definitions[key].name
                        nameToId['#/definitions/'+definitions[key].name] = '#/definitions/'+key
                    })

                    return {
                        idToName : idToName,
                        nameToId : nameToId
                    }
                }
                else{
                    return undefined
                }
            }
        },
        methods : {
            makeToast,
            $_changeObserverMixin_onDataChanged : function (after,before) {
                this.isEdited = true
                ChangeObserverMixin.methods.$_changeObserverMixin_onDataChanged.call(this, after, before)
            },
            editorInit : function () {
                require('brace/mode/json');
                require('@/assets/apix-ace-editor-theme');
            },
            getJson : function () {
                try{
                    let json = JSON.parse(this.jsonText)
                    JsonOasUtil.replaceValueWithKey(json, '$ref', this.definitionMap.nameToId)
                    return json
                }
                catch (e) {
                    this.makeToast('danger',false, e)
                    throw e
                }
            },
            reloadData: function () {
                this.loadData()
            },
            loadData : function () {
                if(this.jsonInput !== undefined){
                    this.$_changeObserverMixin_unObserve()
                    if(this.definitionMap){
                        let copyJson = JSON.parse(JSON.stringify(this.jsonInput))
                        JsonOasUtil.replaceValueWithKey(copyJson, '$ref', this.definitionMap.idToName)
                        this.jsonText = JSON.stringify(copyJson,null,2)
                    }
                    this.$_changeObserverMixin_initObserver(['jsonText'])


                }
            },
            setJson : function (json) {
                try{
                    this.$_changeObserverMixin_unObserve()
                    this.isEdited = false
                    if(typeof json === 'string' && this.definitionMap){
                        this.jsonText = JSON.stringify(
                            JsonOasUtil.replaceValueWithKey(JSON.parse(json),'$ref',this.definitionMap.idToName),
                            null, 2
                        )
                    }
                    else if(this.definitionMap){
                        json = JSON.parse(JSON.stringify(json))
                        JsonOasUtil.replaceValueWithKey(json, '$ref', this.definitionMap.idToName)
                        this.jsonText = JSON.stringify(json,null,2)
                    }
                    this.$_changeObserverMixin_initObserver(['jsonText'])
                }
                catch (e) {
                    this.makeToast('danger',false, e.message)
                }
            }
        },
        watch : {
        },
        created() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
