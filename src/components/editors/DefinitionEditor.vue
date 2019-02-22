<template>
    <div>
        <h1>Model: {{definitionApi}}</h1>

        {{apiData}}
        <DataTypeInput v-if="apiData !== undefined" :schemaData="apiData"/>

    </div>
</template>

<script>
    import DataTypeInput from "./editor-components/inputs/DataTypeInput";
    export default {
        name: "DefinitionEditor",
        components: {DataTypeInput},
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