<template>
    <div></div>
</template>

<script>
    import ActionBuilderUtil from "@/utils/ActionBuilderUtil";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";

    export default {
        name: "CustomData",
        props : {
            schemaData : {
                type : Object
            },
            currentRef : {
                type : String
            }
        },
        mixins : [ChangeObserverMixin],
        data : () => ({
            refBefore : undefined,
            attributesKey : [
                {keyBefore : '$ref', keyAfter : 'ref'}
            ]
        }),
        methods : {
            getAttributesKey : function () {
                return this.attributesKey
            },
            getAttributes : function() {
                return {
                    $ref: this.currentRef
                }
            },
            getActions : function () {
                return ActionBuilderUtil.createActions(
                    {$ref : this.refBefore},
                    {ref : this.currentRef},
                    this.attributesKey
                )
            },
            loadData : function () {
                if(this.schemaData !== undefined){
                    this.refBefore = this.schemaData['$ref']
                }
                this.$_changeObserverMixin_initObserver()
            }
        },
        watch : {
            schemaData : function () {
                this.loadData()
            }
        },
        mounted() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
