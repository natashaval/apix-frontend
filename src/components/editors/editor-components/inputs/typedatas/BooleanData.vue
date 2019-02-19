<template>
    <div>
        <div v-if="isEditing" class="form-inline float-right">
            <label class="col-4">default :</label>
            <b-input class="col-8" v-model="defaultVal"></b-input>
        </div>
        <div v-else>
            <p>default : {{defaultVal}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BooleanData",
        props : ['isEditing','schemaData'],
        data : () => ({
            defaultVal : ''
        }),
        methods : {
            getAttributes : function () {
                return {
                    type : 'boolean',
                    default : this.defaultVal
                }
            }
        },
        created(){
            if(this.schemaData !== undefined){
                this.defaultVal = this.schemaData.default
            }
        }
    }
</script>

<style scoped>

</style>