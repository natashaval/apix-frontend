<template>
    <div>
        <div v-if="isEditing">
            <div class="form-inline row float-right">
                <div class="form-inline col-6 row">
                    <label class="col-6">Min items :</label>
                    <b-input type="number" class="col-6" v-model="minItems"></b-input>
                </div>
                <div class="form-inline col-6 row">
                    <label class="col-6">Max items :</label>
                    <b-input type="number" class="col-6" v-model="maxItems"></b-input>
                </div>
            </div>
            <div class="form-inline row float-right">
                <label>Unique items</label>
                <b-checkbox></b-checkbox>
            </div>
        </div>
        <div v-else>
            <div class="row">
                <p v-if="minItems !== undefined">Min items : {{minItems}}, </p>
                <p v-if="maxItems !== undefined">Max items : {{maxItems}}</p>
            </div>
            <div class="row">
                <p>unique items : {{uniqueItems}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ArrayData",
        props : ['isEditing','schemaData'],
        data : () => ({
            minItems : 0,
            maxItems : 0,
            uniqueItems : false
        }),
        methods : {
            getAttributes : function () {
                return {
                    type : 'array',
                    minItems : parseInt(this.minItems),
                    maxItems : parseInt(this.maxItems),
                    uniqueItems : this.uniqueItems
                }
            }
        },
        created(){
            if(this.schemaData !== undefined){
                let sd = this.schemaData
                this.minItems = (sd.minItems !== undefined)?sd.minItems.toString() : ""
                this.maxItems = (sd.maxItems !== undefined)?sd.maxItems.toString() : ""
                this.uniqueItems = (sd.uniqueItems !== undefined)?sd.uniqueItems:false
            }
        }
    }
</script>

<style scoped>

</style>