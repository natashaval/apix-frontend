<template>
    <div>
        <h1>Model: {{definitionApi}}</h1>

        {{apiData}}
    </div>
</template>

<script>
    export default {
        name: "DefinitionEditor",
        props: ['definitionApi'],
        computed: {
            apiData: function() {
                return this.$store.getters['project/getDefinitionData'](this.definitionApi)
            }
        }
    }
</script>

<style scoped>

</style>