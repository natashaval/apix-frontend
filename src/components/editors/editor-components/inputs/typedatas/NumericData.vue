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
    import ActionBuilder from '@/utils/ActionBuilderUtil'

    export default {
        name: "NumericData",
        props : {
            numericType : String,
            isEditing : Boolean,
            schemaData : Object
        },
        data: () => ({
            enums : [''],
            enumCount : 1,
            format : '',
            minimum : undefined,
            maximum : undefined,
            defaultVal : undefined,
            attributesKey : [
                {keyBefore : 'enum', keyAfter : 'enums', default : []},
                {key : 'format'},
                {key : 'minimum'},
                {key : 'maximum'},
                {keyBefore : 'default', keyAfter : 'defaultVal'}
            ]
        }),
        computed : {
            formats() {
                 return (this.numericType === 'number')
                     ?['double','float','int64','int32','int16','int8']
                     :['int64','int32','int16','int8']
            }
        },
        methods : {
            getAttributesKey : function () {
                return this.attributesKey
            },
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
            _toString : function (value) {
                return (value !== undefined)?value.toString():undefined
            },
            getActions : function () {
                let tmp = this.schemaData
                if(!(tmp.type === 'number' || tmp.type === 'integer')){
                    tmp = {}
                }
                this.enums.pop()
                let res = ActionBuilder.createActions(tmp, this._data, this.attributesKey)
                this.enums.push('')
                return res
            },
        },
        created(){

            if(this.schemaData !== undefined &&
                (this.schemaData.type === 'number' || this.schemaData.type === 'integer') ){
                let sd = this.schemaData
                if(sd.enum !== undefined){
                    this.enums = Object.assign([],sd.enum)
                    this.enums.push('')
                    this.enumCount = this.enums.length
                }
                this.format = sd.format
                this.minimum = this._toString(sd.minimum)
                this.maximum = this._toString(sd.maximum)
                this.defaultVal = this._toString(sd.default)
            }
        }
    }
</script>

<style scoped>

</style>