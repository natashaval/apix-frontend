<template>
    <div>
        <div v-if="isEditing" class="form-inline w-100">
            <label class="col-3 text-left shrinkable-text">default :</label>
            <input type="checkbox" name="default-val" class="form-check" v-model="defaultVal"/>
        </div>
        <div class="row" style="padding-left: 50%" v-else>
            <p>default : {{defaultVal}}</p>
        </div>
    </div>
</template>

<script>
    import ActionBuilder from '@/utils/ActionBuilderUtil'
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";

    export default {
        name: "BooleanData",
        mixins : [ChangeObserverMixin],
        props : {
            isEditing : Boolean,
            schemaData : Object
        },
        data : () => ({
            defaultVal : false,
            attributesKey : [
                {keyBefore : 'default', keyAfter : 'defaultVal'}
            ],
            attributesKeyPublic : [
                {key : 'default'}
            ]
        }),
        methods : {
            getAttributesKey : function () {
                return this.attributesKeyPublic
            },
            getAttributes : function () {
                return {
                    type : 'boolean',
                    default : this.defaultVal
                }
            },
            getActions : function () {
                let tmp = this.schemaData
                if(tmp !== undefined && tmp.type !== 'boolean')tmp = {}
                return ActionBuilder.createActions(tmp, this._data, this.attributesKey)
            }

        },
        created(){

            if(this.schemaData !== undefined && this.schemaData.type === 'boolean'){
                this.defaultVal = (this.schemaData.default === undefined)?false:this.schemaData.default
            }

            this.$_changeObserverMixin_initObserver(['defaulVal'])
        }
    }
</script>

<style scoped>

</style>
