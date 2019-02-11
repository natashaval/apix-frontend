<template>
    <div>
        <li @click="methodClick">{{methodApi}}</li>
    </div>
</template>

<script>
    export default {
        name: "MethodBar",
        props : [
            'methodApi','apiData'
        ],
        methods : {
            methodClick : function () {
                this.$router.push({
                    name :'method-editor',
                    params: {methodApi : this.methodApi}
                })
            }
        }
    }
</script>

<style scoped>

</style>