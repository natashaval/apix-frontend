<template>
    <div>
        <h3>General</h3>
        <button @click="changeEditing">Edit: {{isEditing}}</button>
        <InputEditor :apiData="apiData.info.title" :apiTitle="`title`" :isEditing="isEditing"></InputEditor>
        <InputEditor :apiData="apiData.info.version" :apiTitle="`version`" :isEditing="isEditing"></InputEditor>
        <TextDocInput id="info-description" :apiData="apiData.info.description" :apiTitle="`Description`" :isEditing="isEditing"/>
        <InputEditor v-for="(value,key) in apiData.info.contact" v-bind:key="`info-${key}`" :apiData="value" :apiTitle="`Contact ${key}`" :isEditing="isEditing"/>
        <InputEditor v-for="(value,key) in apiData.info.license" v-bind:key="`info-${key}`" :apiData="value" :apiTitle="`License ${key}`" :isEditing="isEditing"/>
        <TextDocInput id="info-tos" :apiData="apiData.info.termsOfService" :apiTitle="`Terms of Service`" :isEditing="isEditing"/>

        <h3>ExternalDocs</h3>
        <InputEditor :apiData="apiData.externalDocs.url" :apiTitle="`url`" :isEditing="isEditing"></InputEditor>
        <TextDocInput id="externaldocs-description" :apiData="apiData.externalDocs.description" :apiTitle="`description`" :is-editing="isEditing" />
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