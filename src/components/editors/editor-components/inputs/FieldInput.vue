<template>
    <div>
        <label>{{ apiTitle }}</label>
        <b-form-input type="text" v-model="apiData"/>
    </div>
</template>

<script>
    export default {
        name: "InputEditor",
        props: ['apiData', 'apiTitle'],
    }
</script>

<style scoped>

</style>