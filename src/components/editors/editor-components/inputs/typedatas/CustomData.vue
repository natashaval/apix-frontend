<template>
    <div></div>
</template>

<script>
    import ActionBuilderUtil from "@/utils/ActionBuilderUtil";

    export default {
        name: "CustomData",
        props : ['schemaData','currentRef'],
        data : () => ({
            refBefore : undefined,
            attributesKey : [
                {key : '$ref'}
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
                    {$ref : this.currentRef},
                    this.attributesKey
                )
            }
        },
        created() {
            if(this.schemaData !== undefined){
                this.refBefore = this.schemaData.$ref
            }
        }
    }
</script>

<style scoped>

</style>