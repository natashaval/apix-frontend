<template>
    <div>
        <button @click="addProperty">Add</button>
        <div v-for="(property,idx) in propertiesData" v-bind:key="property.id">
            <DataTypeInput :parentIsEditing="property.isEditing"
                           :projectId="projectId"
                           :schemaData="property.schemaData"
                           :ref="'property-'+property.id"
                           :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                           :componentId="idx" :fSelfDelete="deleteChild"/>
        </div>
        <button @click="buildQuery">Dump!</button>
    </div>
</template>

<script>
    import DataTypeInput from "../inputs/DataTypeInput";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    export default {
        name: "PropertyForm",
        mixins : [ChangeObserverMixin],
        props : ['schemaData'],
        components: {DataTypeInput},
        data : () => ({
            propertiesData : [],
            propertyId : 0,
            //menyimpan property yang didelete, tidak menyimpan property yang baru dibuat lalu dihapus
            deletedProperty : [],
            commitChangeCallback : [],
            actionsQuery : []

        }),
        computed : {
            projectId : function () {
                return this.$route.params.projectId
            }
        },
        watch : {
            schemaData : function () {
                this.loadData()
            }
        },
        methods : {
            addProperty : function () {
                this.propertiesData.push({id : this.propertyId++,isEditing : true})
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.propertiesData = []
                if (this.schemaData !== undefined) {
                    let sd = this.schemaData
                    for (let key in sd) {
                        let tmp = sd[key]
                        tmp.name = key
                        this.propertiesData.push({
                            id: this.propertyId++,
                            schemaData: sd[key],
                            isEditing : false
                        })
                    }
                }
                this.$_changeObserverMixin_initObserver(['propertiesData.length'])
            },
            reloadData : function () {
                this.loadData()
            },
            commitChange : function () {
                ActionExecutorUtil.executeActions(this.schemaData, this.actionsQuery)
                this.commitChangeCallback.forEach(fn => fn())
            },
            deleteChild : function (childIndex) {
                //jika bukan property baru, maka bikin query delete
                if(this.propertiesData[childIndex].schemaData !== undefined){
                    this.deletedProperty.push(
                        this.propertiesData[childIndex].schemaData.name
                    )
                }
                this.propertiesData.splice(childIndex,1)
            },
            buildQuery : function (query) {
                this.commitChangeCallback = []
                let isEdited = false
                for(let i = 0; i < this.propertiesData.length; i++){
                    let id = this.propertiesData[i].id
                    let callback = this.$refs['property-'+id][0].buildQuery(query)
                    if( callback !== undefined ){
                        isEdited = true
                        this.commitChangeCallback.push(callback)
                    }
                }

                if(this.deletedProperty.length > 0){
                    isEdited = true
                    if(query._actions === undefined){
                        query._actions = []
                    }
                    this.deletedProperty.forEach(fieldName => query._actions.push({action : 'delete', key : fieldName}))
                }

                if(query._actions !== undefined){
                    if(query._actions.length === 0){
                        delete query._hasActions
                        delete query._actions
                    }
                    else{
                        isEdited = true
                        this.actionsQuery = query._actions
                    }
                }

                return (isEdited)?this.commitChange : undefined
            }
        },
        mounted() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>