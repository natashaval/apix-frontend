<template>
    <div>
        <h3>General</h3>
        <InputEditor :apiData="apiData.info.title" :apiTitle="`title`"></InputEditor>
        <InputEditor :apiData="apiData.info.version" :apiTitle="`version`"></InputEditor>
        <TextDocInput id="info-description" :apiData="apiData.info.description" :apiTitle="`Description`" />
        <InputEditor :apiData="apiData.info.contact.name" :apiTitle="`Contact Name`"></InputEditor>
        <InputEditor :apiData="apiData.info.contact.email" :apiTitle="`Contact Email`"></InputEditor>
        <InputEditor :apiData="apiData.info.contact.url" :apiTitle="`Contact URL`"></InputEditor>
        <InputEditor :apiData="apiData.info.license.name" :apiTitle="`License Name`"></InputEditor>
        <InputEditor :apiData="apiData.info.license.url" :apiTitle="`License URL`"></InputEditor>
        <TextDocInput id="info-tos" :apiData="apiData.info.termsOfService" :apiTitle="`Terms of Service`" />

        <h3>ExternalDocs</h3>
        <InputEditor v-for="(value,key) in apiData.externalDocs" v-bind:key="key" :apiData="value" :apiTitle="key"></InputEditor>
    </div>
</template>

<script>
    import InputEditor from './inputs/FieldInput';
    import TextDocInput from "./inputs/TextDocInput";

    export default {
        name: "DescriptionComponent",
        components: {
            TextDocInput,
            InputEditor,
        },
        props: ['apiData'],

    }
</script>

<style scoped>

</style>