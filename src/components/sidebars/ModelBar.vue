<template>
    <div>
        <li @click="definitionClick">{{definitionApi}}</li>
    </div>
</template>

<script>
    export default {
        name: "ModelBar",
        props: ['apiData','definitionApi'],
        methods: {
            definitionClick: function(){
                this.$router.push({
                    name: 'definition-editor',
                    params: {definitionApi: this.definitionApi }
                })
            }
        }
    }
</script>

<style scoped>

</style>