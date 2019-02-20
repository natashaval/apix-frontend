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
    import ActionBuilder from '@/utils/ActionBuilderUtil'

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
            getActions : function () {
                let tmp = this.schemaData
                if(tmp !== undefined && tmp.type !== 'object')tmp = {}
                return ActionBuilder.createActions(tmp, this._data, this.attributesKey)
            }
        },
        created(){

            if(this.schemaData !== undefined && this.schemaData.type === 'object'){
                this.additionalProperties = this.schemaData.additionalProperties
            }
        }
    }
</script>

<style scoped>

</style>