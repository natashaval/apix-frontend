<template>
    <div>
        <div class="form-inline float-right" v-for="(key,i) in enumCount" v-bind:key="i">
            <label class="col-4">Enum :</label>
            <b-input class="col-8" @keyup.native="onEnumTyped(i)" v-model="enums[i]"></b-input>
        </div>
        <div class="form-inline float-right">
            <label class="col-4">Pattern :</label>
            <b-input class="col-8" v-model="pattern"></b-input>
        </div>
        <div class="form-inline row float-right">
            <div class="form-inline col-6 row">
                <label class="col-6">Min length :</label>
                <b-input type="number" class="col-6" v-model="minLength"></b-input>
            </div>
            <div class="form-inline col-6 row">
                <label class="col-6">Max length :</label>
                <b-input class="col-6" v-model="maxLength"></b-input>
            </div>
        </div>
        <div class="form-inline float-right">
            <label class="col-4">default :</label>
            <b-input class="col-8" v-model="defaultVal"></b-input>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StringData",
        data : () => ({
            enums : [''],
            enumCount : 1,
            minLength : null,
            maxLength : null,
            pattern : '',
            defaultVal : ''
        }),
        methods : {
            onEnumTyped : function(i) {
                if(i === this.enumCount - 1 ){
                    if(this.enums[i] !== ''){
                        this.enumCount++
                        this.enums.push('')
                    }
                }
                else if(i === this.enumCount - 2){
                    if(this.enums[i] === ''){
                        this.enumCount--
                        this.enums.pop()
                    }
                }
            },
            getAttributes : function(){
                return {
                    type : 'string',
                    enums : this.enums.slice(0,-1),
                    pattern : this.pattern,
                    minLength : this.minLength,
                    maxLength : this.maxLength,
                    default : this.defaultVal
                }
            }
        }
    }
</script>

<style scoped>

</style>