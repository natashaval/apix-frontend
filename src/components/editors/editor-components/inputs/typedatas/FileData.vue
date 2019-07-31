<template>
    <div>
        <div v-if="isEditing">
            <div class="form-inline float-right">
                <label class="col-4">Extension :</label>
                <input class="col-8 form-control" v-model="extension" name="extension"/>
            </div>
            <div class="form-inline row float-right">
                <div class="form-inline col-6 row">
                    <label class="col-6">Min length:</label>
                    <input type="number" class="col-6 form-control" v-model="minLength" name="min-length">
                </div>
                <div class="form-inline col-6 row">
                    <label class="col-6">Max length:</label>
                    <input type="number" class="col-6 form-control" v-model="maxLength" name="max-length">
                </div>
            </div>
        </div>
        <div v-else class="float-right">
            <div class="row" v-if="extension !== undefined">
                <p>Extension : {{extension}}</p>
            </div>
            <div class="row" v-if="minLength !== '' && minLength !== undefined">
                <p>Min length : {{minLength}}, </p>
            </div>
            <div v-if="maxLength !== '' && maxLength !== undefined" class="row">
                <p>Max length : {{maxLength}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    import ActionBuilder from '@/utils/ActionBuilderUtil'

    export default {
        name: "FileData",
        mixins : [ChangeObserverMixin],
        props : {
            isEditing : {
                type : Boolean,
                default : false
            },
            schemaData : Object
        },
        data : () => ({
            enumCount : 1,
            minLength : undefined,
            maxLength : undefined,
            extension : '',
            attributesKey : [//digunakan di internal
                'minLength','maxLength','extension'
            ]
        }),
        methods : {
            getAttributes : function(){
                return {
                    type : 'file',
                    extension : this.extension,
                    minLength : this.minLength,
                    maxLength : this.maxLength
                }
            },
            getActions : function () {
                let tmp = this.schemaData
                if(tmp !== undefined && tmp.type !== 'file'){
                    tmp = {}
                }
                let res = ActionBuilder.createActions(tmp, this._data, this.attributesKey)
                return res
            },
            _toString : function (value) {
                return (value !== undefined)?value.toString():undefined
            }
        },
        created(){
            if(this.schemaData !== undefined && this.schemaData.type === 'file'){
                let sd = this.schemaData
                this.minLength = this._toString(sd.minLength)
                this.maxLength = this._toString(sd.maxLength)
                this.extension = this._toString(sd.extension)
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