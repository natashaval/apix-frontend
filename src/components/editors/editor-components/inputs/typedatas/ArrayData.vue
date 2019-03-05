<template>
    <div>
        <div v-if="isEditing">
            <div class="form-inline row float-right">
                <div class="form-inline col-6 row">
                    <label class="col-6">Min items:</label>
                    <b-input type="number" class="col-6" v-model="minItems"></b-input>
                </div>
                <div class="form-inline col-6 row">
                    <label class="col-6">Max items:</label>
                    <b-input type="number" class="col-6" v-model="maxItems"></b-input>
                </div>
            </div>
            <div class="form-inline row float-right">
                <label>Unique items</label>
                <b-checkbox v-model="uniqueItems"></b-checkbox>
            </div>
        </div>
        <div v-else class="float-right">
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
            isEditing : Boolean,
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
                return {
                    type : 'array',
                    minItems : parseInt(this.minItems),
                    maxItems : parseInt(this.maxItems),
                    uniqueItems : this.uniqueItems
                }
            },
            getActions : function () {
                let tmp = this.schemaData
                if(tmp !== undefined && tmp.type !== 'array')tmp = {}
                return ActionBuilder.createActions(tmp, this._data, this.attributesKey)
            },
            _toString : function (value) {
                return (value !== undefined)?value.toString():undefined
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