<template>
    <div class="pr-0">
        <slot v-if="isEditing">
            <div class="form-row float-right mb-2 w-100" v-for="(key,i) in enumCount" v-bind:key="i">
                <label class="col-3 text-left shrinkable-text mt-auto">Enum :</label>
                <input class="col-9 form-control" @keyup="onEnumTyped(i)" v-model="enums[i]" name="enum"/>
            </div>
            <div class="form-row float-right mb-2 w-100">
                <label class="col-3 text-left shrinkable-text mt-auto">Pattern :</label>
                <input class="col-9 form-control" v-model="pattern" name="pattern"/>
            </div>
            <div class="form-row float-right mb-2 w-100">
                <div class="form-row col-6">
                    <label class="col-3 text-left mt-auto">Min length:</label>
                    <input type="number" class="col-9 form-control" v-model="minLength" name="min-length">
                </div>
                <div class="form-row float-right col-6 ml-auto">
                    <label class="col-3 text-left mt-auto">Max length:</label>
                    <input type="number" class="col-9 form-control" v-model="maxLength" name="max-length">
                </div>
            </div>
            <div class="form-row float-right w-100">
                <label class="col-3 text-left shrinkable-text mt-auto">Default :</label>
                <input class="col-9 form-control" v-model="defaultVal" name="default-val">
            </div>
        </slot>
        <div v-else class="float-right">
            <div class="row" v-if="enums.length !== 1">
                <p class="col">Enum :</p>
                <div class="col">
                    <p class="text-right" v-for="_enum in enums" v-bind:key="_enum">{{_enum}}</p>
                </div>
            </div>
            <div class="row" v-if="pattern !== undefined">
                <p class="col text-right">Pattern : {{pattern}}</p>
            </div>
            <div class="row" v-if="minLength !== '' && minLength !== undefined">
                <p class="col text-right">Min length : {{minLength}}</p>
            </div>
            <div v-if="maxLength !== '' && maxLength !== undefined" class="row">
                <p class="col text-right">Max length : {{maxLength}}</p>
            </div>
            <div class="row" v-if="defaultVal !== '' && defaultVal !== undefined">
                <p class="col text-right">Default : {{defaultVal}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import ActionBuilder from '@/utils/ActionBuilderUtil'
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";

    export default {
        name: "StringData",
        mixins : [ChangeObserverMixin],
        props : {
            isEditing : {
                type : Boolean,
                default : false
            },
            schemaData : Object
        },
        data : () => ({
            enums : [''],
            enumCount : 1,
            minLength : undefined,
            maxLength : undefined,
            pattern : undefined,
            defaultVal : undefined,//tidak pakai 'default' karna reserved keyword, sehingga tidak bisa dibind
            attributesKey : [//digunakan di internal
                {keyBefore : 'enum', keyAfter : 'enums', default : []},
                {key : 'minLength'},
                {key : 'maxLength'},
                {key : 'pattern'},
                {keyBefore : 'default', keyAfter : 'defaultVal'}
            ],
            publicAttributesKey: [//digunakan public
                {key : 'enum'},
                {key : 'minLength'},
                {key : 'maxLength'},
                {key : 'pattern'},
                {key : 'default'}
            ]
        }),
        methods : {
            getAttributesKey : function () {
                return this.publicAttributesKey
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
                    type : 'string',
                    enum : this.enums.slice(0,-1),
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

            if(this.schemaData !== undefined && this.schemaData.type === 'string'){
                let sd = this.schemaData
                if(sd.enum !== undefined){
                    this.enums = Object.assign([],sd.enum)
                    this.enums.push('')
                    this.enumCount = this.enums.length
                }
                this.pattern = this._toString(sd.pattern)
                this.minLength = this._toString(sd.minLength)
                this.maxLength = this._toString(sd.maxLength)
                this.defaultVal = this._toString(sd.default)
            }

            this.$_changeObserverMixin_initObserver(
                this.attributesKey.map(attr => {
                    if(attr.key !== undefined)return attr.key
                    return attr.keyAfter
                })
            )

        }
    }
</script>

<style scoped>

</style>
