<template>
    <div>
        <li @click="methodClick" style="color: white">{{operationApi}}</li>
    </div>
</template>

<script>
    export default {
        name: "OperationBar",
        props : [
            'apiData','operationApi','pathApi','sectionApi'
        ],
        methods : {
            methodClick : function () {
                this.$router.push({
                    name :'operation-editor',
                    params: {
                        sectionApi : this.sectionApi,
                        pathApi : this.pathApi,
                        operationApi : this.operationApi
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
