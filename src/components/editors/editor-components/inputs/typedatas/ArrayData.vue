<template>
    <div class="pr-0">
        <slot v-if="isEditing">
            <div class="form-row float-right w-100">
                <div class="form-row col-6">
                    <label class="col-3 text-left mt-auto">Min items:</label>
                    <input type="number" name="min-items" class="col-9 form-control" v-model="minItems"/>
                </div>
                <div class="form-row col-6 ml-2">
                    <label class="col-3 text-left mt-auto">Max items:</label>
                    <input type="number" name="max-items" class="col-9 form-control" v-model="maxItems"/>
                </div>
            </div>
            <div class="form-inline w-100">
                <label class="col-4 shrinkable-text text-left mt-auto ml-0">Unique items:</label>
                <input type="checkbox" name="unique-items" v-model="uniqueItems" class="form-check">
            </div>
        </slot>
        <div v-else class="w-100" style="padding-left: 50%">
            <div class="row">
                <p v-if="minItems !== undefined">Min items : {{minItems}}</p>
            </div>
            <div class="row">
                <p v-if="maxItems !== undefined">Max items : {{maxItems}}</p>
            </div>
            <div class="row">
                <p>unique items : {{uniqueItems}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import ActionBuilder from '@/utils/ActionBuilderUtil'
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";

    export default {
        name: "ArrayData",
        mixins : [ChangeObserverMixin],
        props : {
            isEditing : {
                type : Boolean,
                default : false
            },
            schemaData : Object
        },
        data : () => ({
            minItems : undefined,
            maxItems : undefined,
            uniqueItems : false,

            attributesKey : [//public dan internal sama, karna tidak ada attribute yang dicustom namanya
                {key : 'minItems'},
                {key : 'maxItems'},
                {key : 'uniqueItems',default : false}
            ]
        }),
        methods : {
            getAttributesKey : function () {
                return this.attributesKey
            },
            getAttributes : function () {
                let minItems = parseInt(this.minItems)
                let maxItems = parseInt(this.maxItems)
                return {
                    type : 'array',
                    minItems : minItems?minItems:null,
                    maxItems : maxItems?maxItems:null,
                    uniqueItems : this.uniqueItems
                }
            },
            getActions : function () {
                let tmp = this.schemaData
                if(tmp !== undefined && tmp.type !== 'array')tmp = {}
                return ActionBuilder.createActions(tmp, this._data, this.attributesKey)
            },
            _toString : function (value) {
                return (value !== undefined && value !== null)?value.toString():undefined
            }
        },
        created(){

            if(this.schemaData !== undefined && this.schemaData.type === 'array'){
                let sd = this.schemaData
                this.minItems = this._toString(sd.minItems)
                this.maxItems = this._toString(sd.maxItems)
                this.uniqueItems = (sd.uniqueItems === undefined)?false:sd.uniqueItems
            }

            this.$_changeObserverMixin_initObserver( this.attributesKey.map(attr => attr.key) )
        }
    }
</script>

<style scoped>

</style>
