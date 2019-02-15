<template>
    <div>
        <div class="form-inline float-right">
            <label>Additional properties</label>
            <b-checkbox value="true" v-model="additionalProperties"></b-checkbox>
        </div>
        <div class="form-inline float-right">
            <label>Examples</label>
            <b-input/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ObjectData",
        data : () => ({
            additionalProperties : true
        }),
        methods : {
            getAttributes : function(){
                return {
                    type : 'object',
                    additionalProperties: this.additionalProperties
                }
            }
        }
    }
</script>

<style scoped>

</style>