<template>
 <div>
     <AceEditor v-model="jsonText" @init="editorInit()" lang="json" theme="apix" :options="editorOptions"
     style="width: 100%;height: 100%"></AceEditor>
 </div>
</template>

<script>
    import AceEditor from 'vue2-ace-editor';
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";

    export default {
        name: "LowLvlJsonEditor",
        components : {AceEditor},
        mixins : [ChangeObserverMixin],
        props : {
            jsonInput : {
                type : Object,
                required : false
            }
        },
        data : () => ({
            jsonText : '',
            editorOptions:{
                fontSize: 12,
                fontFamily: 'monospace'
            },
            isEdited : false,
            unwatchList : []
        }),
        methods : {
            editorInit : function () {
                require('brace/mode/json');
                require('@/assets/apix-ace-editor-theme');
            },
            getJson : function () {
                return JSON.parse(this.jsonText)
            },
            reloadData: function () {
                this.loadData()
            },
            loadData : function () {
                if(this.jsonInput !== undefined){
                    this.$_changeObserverMixin_unObserve()
                    this.unwatchList.forEach(fn => fn())
                    this.jsonText = JSON.stringify(this.jsonInput,null,2)
                    this.isEdited = false
                    this.$_changeObserverMixin_initObserver(['jsonText'])

                    this.unwatchList = []
                    let unwatchTmp = this.$watch('jsonText',()=>{
                        this.isEdited = true
                        unwatchTmp()
                    })
                    this.unwatchList.push(unwatchTmp)
                }
            },
            setJson : function (json) {
                this.$_changeObserverMixin_unObserve()
                this.isEdited = false
                if(typeof json === 'string'){
                    this.jsonText = json
                }
                else{
                    this.jsonText = JSON.stringify(json,null,2)
                }
                this.$_changeObserverMixin_initObserver(['jsonText'])
                let unwatchTmp = this.$watch('jsonText',()=>{
                    this.isEdited = true
                    unwatchTmp()
                })
            }
        },
        created() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
