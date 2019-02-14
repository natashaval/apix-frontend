<template>
    <div>
        <h3>General</h3>
        <InputEditor v-for="(value,key) in apiData.info" v-bind:key="key" :apiData="value" :apiTitle="key"></InputEditor>
        <h3>ExternalDocs</h3>
        <InputEditor v-for="(value,key) in apiData.externalDocs" v-bind:key="key" :apiData="value" :apiTitle="key"></InputEditor>
    </div>
</template>

<script>
    import InputEditor from './inputs/FieldInput';

    export default {
        name: "DescriptionComponent",
        components: {
            InputEditor,
        },
        props: ['apiData'],

    }
</script>

<style scoped>

</style>