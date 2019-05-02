<template>
 <div>
     <AceEditor v-model="jsonText" @init="editorInit()" lang="json" theme="apix" :options="editorOptions"
     width="600" height="1000"></AceEditor>
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
                required : true
            }
        },
        data : () => ({
            jsonText : undefined,
            editorOptions:{
                fontSize: 12,
                fontFamily: 'monospace'
            },
            isEdited : false,
            unwatchJsonText : () => {}
        }),
        methods : {
            editorInit : function () {
                require('brace/mode/json');
                require('@/assets/apix-ace-editor-theme');
            },
            getJson : function () {
                return JSON.parse(this.jsonText)
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.unwatchJsonText()
                this.jsonText = JSON.stringify(this.jsonInput,null,2)
                this.isEdited = false
                this.$_changeObserverMixin_initObserver(['jsonText'])
                this.unwatchJsonText = this.$watch('jsonText',()=>{
                    this.isEdited = true
                    this.unwatchJsonText()
                })

            }
        },
        watch : {
            jsonInput : function () {
                this.loadData()
            }
        },
        created() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
