<template>
    <div>
        <div class="form-inline float-right">
            <label class="col-4">default :</label>
            <b-input class="col-8" v-model="defaultVal"></b-input>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BooleanData",
        data : () => ({
            defaultVal : ''
        })
    }
</script>

<style scoped>

</style>