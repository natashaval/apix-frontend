<template>
    <div>
        <div v-if="isEditing" class="form-inline float-right">
            <label class="col-4">default :</label>
            <b-checkbox class="col-8" v-model="defaultVal"/>{{defaultVal}}
        </div>
        <div v-else>
            <p>default : {{defaultVal}}</p>
        </div>
    </div>
</template>

<script>
    import CompareUtil from '@/utils/CompareUtil'

    export default {
        name: "BooleanData",
        props : {
            isEditing : Boolean,
            schemaData : Object
        },
        data : () => ({
            defaultVal : false,
            attributesKey : [
                {keyBefore : 'default', keyAfter : 'defaultVal'}
            ]
        }),
        methods : {
            getAttributes : function () {
                return {
                    type : 'boolean',
                    default : this.defaultVal
                }
            },
            isEdited : function () {
                if(this.schemaData.type !== 'boolean')return true
                return CompareUtil.isChanged(this.schemaData, this._data, this.attributesKey)
            }

        },
        created(){
            if(this.schemaData.type === 'boolean'){
                this.defaultVal = (this.schemaData.default === undefined)?false:this.schemaData.default
            }
        }
    }
</script>

<style scoped>

</style>