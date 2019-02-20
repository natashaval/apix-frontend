<template>
    <div>
        <div v-if="isEditing">
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
        <div v-else class="float-right">
            <div class="row" v-if="enums.length !== 1">
                <p class="col-5">enum</p>
                <div class="col-5">
                    <p v-for="_enum in enums" v-bind:key="_enum">{{_enum}}</p>
                </div>
            </div>
            <div class="row" v-if="pattern !== undefined">
                <p>Pattern : {{pattern}}</p>
            </div>
            <div class="row">
                <p v-if="minLength != null">Min length : {{minLength}}, </p>
                <p v-if="maxLength != null">Max length : {{maxLength}}</p>
            </div>
            <p v-if="defaultVal !== undefined ">Default : {{defaultVal}}</p>
        </div>
    </div>
</template>

<script>
    import ActionBuilder from '@/utils/ActionBuilderUtil'

    export default {
        name: "StringData",
        props : {
            isEditing : Boolean,
            schemaData : Object
        },
        data : () => ({
            enums : [''],
            enumCount : 1,
            minLength : undefined,
            maxLength : undefined,
            pattern : '',
            defaultVal : '',
            attributesKey : [
                {keyBefore : 'enum', keyAfter : 'enums', default : []},
                {key : 'minLength'},
                {key : 'maxLength'},
                {key : 'pattern', default : ''},
                {keyBefore : 'default', keyAfter : 'defaultVal', default : ''}
            ],

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
            },
            getActions : function () {
                let tmp = this.schemaData
                if(tmp !== undefined && tmp.type !== 'string'){
                    tmp = {}
                }
                this.enums.pop()
                let res = ActionBuilder.createActions(tmp, this._data, this.attributesKey)
                this.enums.push('')
                return res
            },
            _toString : function (value) {
                return (value !== undefined)?value.toString():undefined
            }
        },
        created(){

            // if(this.schemaData === undefined)this.schemaData = {}

            if(this.schemaData !== undefined && this.schemaData.type === 'string'){
                let sd = this.schemaData
                if(sd.enum !== undefined){
                    this.enums = Object.assign([],sd.enum)
                    this.enums.push('')
                    this.enumCount = this.enums.length
                }
                this.pattern = sd.pattern
                this.minLength = this._toString(sd.minLength)
                this.maxLength = this._toString(sd.maxLength)
                this.defaultVal = this._toString(sd.default)
            }
        }
    }
</script>

<style scoped>

</style>