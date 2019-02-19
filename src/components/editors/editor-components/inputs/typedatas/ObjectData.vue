<template>
    <div>
        <div v-if="isEditing" class="form-inline float-right">
            <label>Additional properties</label>
            <b-checkbox value="true" v-model="additionalProperties"></b-checkbox>
        </div>
        <div v-else>
            <p>Additional Properties : {{additionalProperties}}</p>
        </div>
    </div>
</template>

<script>
    import CompareUtil from '@/utils/CompareUtil'

    export default {
        name: "ObjectData",
        props : {
            isEditing : Boolean,
            schemaData : Object
        },
        data : () => ({
            additionalProperties : true,
            attributesKey : [
                {key : 'additionalProperties'}
            ],
        }),
        methods : {
            getAttributes : function(){
                return {
                    type : 'object',
                    additionalProperties: this.additionalProperties
                }
            },
            isEdited : function () {
                if(this.schemaData.type !== 'object')return true
                return CompareUtil.isChanged(this.schemaData, this._data, this.attributesKey)
            }
        },
        created(){
            if(this.schemaData.type === 'object'){
                this.additionalProperties = this.schemaData.additionalProperties
            }
        }
    }
</script>

<style scoped>

</style>