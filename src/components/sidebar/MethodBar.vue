<template>
    <div>
        <li @click="methodClick">{{operationApi}}</li>
    </div>
</template>

<script>
    export default {
        name: "MethodBar",
        props : [
            'operationApi','apiData'
        ],
        methods : {
            methodClick : function () {
                this.$router.push({
                    name :'operation-editor',
                    params: {operationApi : this.operationApi}
                })
            }
        }
    }
</script>

<style scoped>

</style>