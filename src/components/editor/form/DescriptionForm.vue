<template>
    <div>
        <!--//buat edit description-->
        <vue-editor v-model="content"></vue-editor>
    </div>
</template>

<script>
    import { VueEditor } from "vue2-editor";

    export default {
        name: "DescriptionForm",
        components : {
            VueEditor
        },
        data() {
            return {
                content: "<h1>Some initial content</h1>"
            };
        }
    }
</script>

<style scoped>

</style>