<template>
    <div>
        <div v-if="isEditing">
            <div class="form-inline float-right" v-for="(key,i) in enumCount" v-bind:key="i">
                <label class="col-4">Enum :</label>
                <b-input class="col-8" @keyup.native="onEnumTyped(i)" v-model="enums[i]"></b-input>
            </div>
            <div class="form-inline float-right">
                <label class="col-4">Format :</label>
                <b-select class="col-8" v-model="format">
                    <option v-for="format in formats" v-bind:key="format" :value="format">{{format}}</option>
                </b-select>
            </div>
            <div class="form-inline row float-right">
                <div class="form-inline col-6 row">
                    <label class="col-6">Mininum :</label>
                    <b-input type="number" class="col-6" v-model="minimum"></b-input>
                </div>
                <div class="form-inline col-6 row">
                    <label class="col-6">Maximum :</label>
                    <b-input class="col-6" v-model="maximum"></b-input>
                </div>
            </div>
            <div class="form-inline float-right">
                <label class="col-4">default :</label>
                <b-input class="col-8" v-model="defaultVal"></b-input>
            </div>
        </div>
        <div v-else class="float-right">
            <div class="row" v-if="enums.length !== 1">
                <p class="col-5">enum</p>
                <div class="col-5">
                    <p v-for="_enum in enums" v-bind:key="_enum">{{_enum}}</p>
                </div>
            </div>
            <div class="row" v-if="format !== ''">
                <p>format : {{format}}</p>
            </div>
            <div class="row">
                <p v-if="minimum != null">Minimum : {{minimum}}, </p>
                <p v-if="maximum != null">Maximum : {{maximum}}</p>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "NumericData",
        props : ['numericType','isEditing','schemaData'],
        data: () => ({
            enums : [''],
            enumCount : 1,
            format : '',
            minimum : undefined,
            maximum : undefined,
            defaultVal : undefined
        }),
        computed : {
            formats() {
                 return (this.numericType === 'number')
                     ?['double','float','int64','int32','int16','int8']
                     :['int64','int32','int16','int8']
            }
        },
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
                    type : this.numericType.toLowerCase(),
                    enums : this.enums.slice(0,-1),
                    format : this.format,
                    minimum : this.minimum,
                    maximum : this.maximum,
                    default : this.defaultVal
                }
            },
            toStringAssignment : function (target,value) {
                target = (value !== undefined)?value:''
            }
        },
        created(){
            if(this.schemaData !== undefined){
                let sd = this.schemaData
                if(sd.enum !== undefined){
                    this.enums = sd.enum
                    this.enums.push('')
                    this.enumCount = this.enums.length
                }
                this.format = sd.format
                this.toStringAssignment(this.minimum,sd.minimum)
                this.toStringAssignment(this.maximum,sd.maximum)
                this.toStringAssignment(this.defaultVal,sd.default)
            }
        }
    }
</script>

<style scoped>

</style>