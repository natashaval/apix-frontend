<template>
    <div>
        <li @click="methodClick">{{methodName}}</li>
    </div>
</template>

<script>
    export default {
        name: "MethodBar",
        props : [
            'methodName','apiData'
        ],
        methods : {
            methodClick : function () {
                this.$router.push({
                    name :'method-editor',
                    params: {method : this.methodName}
                })
            }
        }
    }
</script>

<style scoped>

</style>