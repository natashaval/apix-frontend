<template>
    <div>
        <div v-if="isEditing" class="form-inline w-100">
            <label class="col-3 text-left">Additional properties:</label>
            <input type="checkbox" class="form-check" value="true"
                   name="additional-properties" v-model="additionalProperties"/>
        </div>
        <div v-else style="padding-left: 46%">
            <p>Additional Properties : {{additionalProperties}}</p>
        </div>
    </div>
</template>

<script>
    import ActionBuilder from '@/utils/ActionBuilderUtil'
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";

    export default {
        name: "ObjectData",
        mixins : [ChangeObserverMixin],
        props : {
            isEditing : {
                type : Boolean,
                default : false
            },
            schemaData : {
                type : Object
            }
        },
        data : () => ({
            additionalProperties : true,
            attributesKey : [//public dan internal
                {key : 'additionalProperties'}
            ],
        }),
        methods : {
            getAttributesKey : function () {
                return this.attributesKey
            },
            getAttributes : function(){
                return {
                    type : 'object',
                    additionalProperties: this.additionalProperties
                }
            },
            getActions : function () {
                let tmp = this.schemaData
                if(tmp !== undefined && tmp.type !== 'object')tmp = {}
                return ActionBuilder.createActions(tmp, this._data, this.attributesKey)
            }
        },
        created(){

            if(this.schemaData !== undefined && this.schemaData.type === 'object'){
                this.additionalProperties = this.schemaData.additionalProperties
            }
            this.$_changeObserverMixin_initObserver(this.attributesKey.map(attr => attr.key))

        }
    }
</script>

<style scoped>

</style>
