<template>
    <div>
        <b-row>
            <b-col cols="3">
                <label>{{ apiTitle }}</label>
            </b-col>
            <b-col cols="9">
                <b-form-input type="text" v-model="apiData"/>
            </b-col>
        </b-row>
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