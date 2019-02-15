<template>
    <div>
        <div class="form-inline row float-right">
            <div class="form-inline col-6 row">
                <label class="col-6">Min items :</label>
                <b-input type="number" class="col-6" v-model="minItems"></b-input>
            </div>
            <div class="form-inline col-6 row">
                <label class="col-6">Max items :</label>
                <b-input class="col-6" v-model="maxItems"></b-input>
            </div>
        </div>
        <div class="form-inline row float-right">
            <label>Unique items</label>
            <b-checkbox></b-checkbox>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ArrayData",
        data : () => ({
            minItems : null,
            maxItems : null,
            uniqueItems : false
        }),
        methods : {
            getAttributes : function () {
                return {
                    type : 'array',
                    minItems : this.minItems,
                    maxItems : this.maxItems,
                    uniqueItems : this.uniqueItems
                }
            }
        }
    }
</script>

<style scoped>

</style>