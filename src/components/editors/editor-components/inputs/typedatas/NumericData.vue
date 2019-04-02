<template>
    <div>
        <div v-if="isEditing">
            <div class="form-inline float-right" v-for="(key,i) in enumCount" v-bind:key="i">
                <label class="col-4">Enum :</label>
                <input class="col-8" type="number" name="enum" @keyup="onEnumTyped(i)" v-model="enums[i]"/>
            </div>
            <div class="form-inline float-right">
                <label class="col-4">Format :</label>
                <select class="col-8 custom-select" v-model="format" name="format">
                    <option v-for="format in formats" v-bind:key="format" :value="format">{{format}}</option>
                </select>
            </div>
            <div class="form-inline row float-right">
                <div class="form-inline col-6 row">
                    <label class="col-6">Mininum :</label>
                    <input type="number" name="minimum" class="col-6" v-model="minimum"/>
                </div>
                <div class="form-inline col-6 row">
                    <label class="col-6">Maximum :</label>
                    <input type="number" name="maximum" class="col-6" v-model="maximum"/>
                </div>
            </div>
            <div class="form-inline float-right">
                <label class="col-4">default :</label>
                <input class="col-8" name="default-val" v-model="defaultVal"/>
            </div>
        </div>
        <div v-else class="float-right">
            <div class="row" v-if="enums.length !== 1">
                <p class="col-5">Enum</p>
                <div class="col-5">
                    <p v-for="(_enum,i) in enums" v-bind:key="i">{{_enum}}</p>
                </div>
            </div>
            <div class="row" v-if="format !== '' && format !== undefined ">
                <p>Format : {{format}}</p>
            </div>
            <div v-if="minimum !== '' && minimum !== undefined" class="row">
                <p>Minimum : {{minimum}}</p>
            </div>
            <div v-if="maximum !== '' && maximum !== undefined" class="row">
                <p>Maximum : {{maximum}}</p>
            </div>
            <div v-if="defaultVal !== '' && defaultVal !== undefined" class="row">
                <p>Default : {{defaultVal}}</p>
            </div>
        </div>
    </div>

</template>

<script>
    import ActionBuilder from '@/utils/ActionBuilderUtil'
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import ActionBuilderUtil from "../../../../../utils/ActionBuilderUtil";

    export default {
        name: "NumericData",
        mixins : [ChangeObserverMixin],
        props : {
            numericType : {
                type : String,
                required : true
            },
            isEditing : {
                type : Boolean,
                default : false
            },
            schemaData : Object
        },
        data: () => ({
            enums : [''],
            enumCount : 1,
            format : '',
            minimum : undefined,
            maximum : undefined,
            defaultVal : undefined,//tidak pakai 'default' karna reserved keyword, sehingga tidak bisa dibind
            attributesKey : [//digunakan di internal
                {keyBefore : 'enum', keyAfter : 'enums', default : []},
                {key : 'format'},
                {key : 'minimum'},
                {key : 'maximum'},
                {keyBefore : 'default', keyAfter : 'defaultVal'}
            ],
            attributesKeyPublic: [//digunakan di external
                {key : 'enum'},
                {key : 'format'},
                {key : 'minimum'},
                {key : 'maximum'},
                {key : 'default'}
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
                return this.attributesKeyPublic
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
                    enum : this.enums.slice(0,-1),
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
            loadData : function () {
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
                this.$_changeObserverMixin_initObserver(
                    this.attributesKey.map(attr => {
                        let key = attr.key
                        if(key === undefined)key = attr.keyAfter

                        if(key === 'enums'){
                            return {
                                model : 'enums',
                                validator : () => {
                                    let isValid = true
                                    this.enums.forEach(item => isValid &= !isNaN(item))
                                    return isValid
                                }
                            }
                        }
                        else if(key === 'defaultVal'){
                            return {
                                model : 'defaultVal',
                                validator : () => {
                                    return !isNaN(this.defaultVal) || ActionBuilderUtil.isEqual(this.defaultVal,undefined)
                                }
                            }
                        }
                        return key

                    })
                )
            }
        },
        watch : {
            schemaData : function () {
                this.loadData()
            }
        },
        created(){
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
