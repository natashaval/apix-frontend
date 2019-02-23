<template>
    <div>
        <div v-if="isEditing">
            <b-row>
                <b-col cols="3">
                    <label class="title">{{ apiTitle }}: </label>
                </b-col>
                <b-col cols="9">
                    <b-form-input type="text" v-model="apiData"/>
                </b-col>
            </b-row>
        </div>
        <div v-else>
            <b-row>
                <b-col cols="3">
                    <label class="title">{{ apiTitle }}: </label>
                </b-col>
                <b-col cols="9">
                    <b-form-input type="text" readonly v-model="apiData" :plaintext="true" />
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "InputEditor",
        props: ['apiData', 'apiTitle', 'isEditing'],
    }
</script>

<style scoped>
    .title {
        text-align: left;
    }
</style>