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
                <b-checkbox v-model="uniqueItems"></b-checkbox>
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
    import CompareUtil from '@/utils/CompareUtil'

    export default {
        name: "ArrayData",
        props : {
            isEditing : Boolean,
            schemaData : Object
        },
        data : () => ({
            minItems : 0,
            maxItems : 0,
            uniqueItems : false,

            attributesKey : [
                {key : 'minItems'},
                {key : 'maxItems'},
                {key : 'uniqueItems',default : false}
            ]
        }),
        methods : {
            getAttributes : function () {
                return {
                    type : 'array',
                    minItems : parseInt(this.minItems),
                    maxItems : parseInt(this.maxItems),
                    uniqueItems : this.uniqueItems
                }
            },
            isEdited : function () {
                if(this.schemaData.type !== 'array')return true
                return CompareUtil.isChanged(this.schemaData, this._data, this.attributesKey)
            },
            _toString : function (value) {
                return (value !== undefined)?value.toString():undefined
            }
        },
        created(){
            if(this.schemaData.type === 'array'){
                let sd = this.schemaData
                this.minItems = this._toString(sd.minItems)
                this.maxItems = this._toString(sd.maxItems)
                this.uniqueItems = (sd.uniqueItems === undefined)?false:sd.uniqueItems
            }
        }
    }
</script>

<style scoped>

</style>