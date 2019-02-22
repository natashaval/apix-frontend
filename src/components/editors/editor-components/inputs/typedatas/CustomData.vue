<template>
    <div></div>
</template>

<script>
    export default {
        name: "CustomData",
        props : ['dataName'],
        data : () => ({
           attributesKey : [
               {key : 'ref'}
           ]
        }),
        methods : {
            getAttributesKey : function () {
                return this.attributesKey
            },
            getAttributes : function() {
                return {
                    ref: this.dataName
                }
            },
            getActions : function () {
                return []
            }
        }
    }
</script>

<style scoped>

</style>