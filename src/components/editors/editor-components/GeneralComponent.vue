<template>
    <!--to display name and description (required in section / path)-->
    <div>
        <button @click="changeEditing">Edit: {{isEditing}}</button>
        <InputEditor :apiData="apiData.name" :apiTitle="`name`" :isEditing="isEditing"></InputEditor>
        <TextDocInput id="description" :apiData="apiData.description" :apiTitle="`Description`" :isEditing="isEditing"/>

        <h4>External Docs </h4>
        <InputEditor :apiData="apiData.externalDocs.url" :apiTitle="`url`" :isEditing="isEditing"></InputEditor>
        <TextDocInput id="externaldocs-description" :apiData="apiData.externalDocs.description" :apiTitle="`Description`" :isEditing="isEditing"/>
    </div>
</template>

<script>
    import InputEditor from "./inputs/FieldInput";
    import TextDocInput from "./inputs/TextDocInput";
    export default {
        name: "GeneralComponent",
        components: {TextDocInput, InputEditor},
        props: ['apiData'],
        data: () => ({
            isEditing: false
        }),
        methods: {
            changeEditing: function () {
                this.isEditing = !this.isEditing;
            }
        }

    }
</script>

<style scoped>

</style>