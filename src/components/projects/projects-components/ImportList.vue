<template>
    <div>
        {{file.name}}
        Validation: {{file.message}}
        <span class="remove-file" @click="removeFile(idx)">Remove</span>
    </div>
</template>

<script>
    export default {
        name: "ImportList",
        props: ['file'],
        watch: {
            file: {
                deep: true,
                handler() {
                    console.log('This file has changed');
                }
            }
        }
    }
</script>

<style scoped>

</style>