<template>
    <div>
        <b-row>
            <b-col cols="3">{{apiTitle}}</b-col>
            <b-col cols="9"></b-col>
        </b-row>
        <b-row>
        <b-col v-show="isEditing">
            <vue-editor v-model="editor"></vue-editor>
        </b-col>
        <b-col>
            <div v-html="editor" id="textDoc"></div>
        </b-col>
        </b-row>
    </div>
</template>

<script>
    import { VueEditor } from 'vue2-editor'

    export default {
        name: "TextDocInput",
        components: {
            VueEditor
        },
        props: ['apiData', 'apiTitle', 'isEditing'],
        data: function () {
            return {
                editor: undefined
            }
        },
        methods: {
            loadData: function () {
                this.editor = this.apiData
            }
        },
        created() {
            this.loadData();
        },
        watch: {
            apiData: function(){
                this.loadData()
            }
        }

    }
</script>

<style scoped>

    #textDoc {
        background-color: skyblue;
    }
</style>