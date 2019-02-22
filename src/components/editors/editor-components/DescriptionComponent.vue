<template>
    <div>
        <h3>General</h3>
        <button @click="changeEditing">Edit: {{isEditing}}</button>
        <InputEditor :apiData="apiData.info.title" :apiTitle="`title`" :isEditing="isEditing"></InputEditor>
        <InputEditor :apiData="apiData.info.version" :apiTitle="`version`" :isEditing="isEditing"></InputEditor>
        <TextDocInput id="info-description" :apiData="apiData.info.description" :apiTitle="`Description`" :isEditing="isEditing"/>
        <InputEditor :apiData="apiData.info.contact.name" :apiTitle="`Contact Name`" :isEditing="isEditing"></InputEditor>
        <InputEditor :apiData="apiData.info.contact.email" :apiTitle="`Contact Email`" :isEditing="isEditing"></InputEditor>
        <InputEditor :apiData="apiData.info.contact.url" :apiTitle="`Contact URL`" :isEditing="isEditing"></InputEditor>
        <InputEditor :apiData="apiData.info.license.name" :apiTitle="`License Name`" :isEditing="isEditing"></InputEditor>
        <InputEditor :apiData="apiData.info.license.url" :apiTitle="`License URL`" :isEditing="isEditing"></InputEditor>
        <TextDocInput id="info-tos" :apiData="apiData.info.termsOfService" :apiTitle="`Terms of Service`" :isEditing="isEditing"/>

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
        data: () => ({
            isEditing: false
        }),
        methods: {
            changeEditing: function(){
                this.isEditing = !this.isEditing;
            }
        }

    }
</script>

<style scoped>

</style>