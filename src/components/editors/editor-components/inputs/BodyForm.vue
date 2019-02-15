<template>
    <!--nanti dilanjutkan-->
    <div>
        <!--<b-form-select v-model="selected" :options="options"/>-->
    </div>
</template>

<script>
    export default {
        name: "bodyForm",
        props : ['apiData'],
        data() {
            return {
                isEditMode : false,
                selected : null,
                options : [
                    {value : 'application/json', text : 'application/json'},
                    {value : 'inputs-data', text : 'multipart/inputs-data'}
                ]
            };
        }
    }
</script>

<style scoped>

</style>