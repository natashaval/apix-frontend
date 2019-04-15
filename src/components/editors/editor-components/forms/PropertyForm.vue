<template>
    <div>
        <button @click="addProperty">Add</button>
        <div v-for="(property,idx) in propertiesData" v-bind:key="property.id">
            <DataTypeInput :parent-is-editing="property.isEditing"
                           :project-id="projectId"
                           :schema-data="property.schemaData"
                           :ref="'property-'+property.id"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                           :component-id="idx"
                           :parent-functions="publicFunctions"/>
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
        props : {
            schemasData : {
                type : Object
            }
        },
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
            },
            publicFunctions : function () {
                return {
                    deleteChild : this.deleteChild,
                    isValidName : this.isValidName
                }
            }
        },
        watch : {
            schemasData : function () {
                this.loadData()
            }
        },
        methods : {
            getData : function () {
                let res = {}
                for(let i = 0; i < this.propertiesData.length; i++){
                    let id = this.propertiesData[i].id
                    let child = this.$refs['property-'+id][0].getData()
                    res[child.name] = child.attributes
                }
                return res
            },
            isValidName : function (name) {
                let p = this.propertiesData
                let len = p.length
                let count = 0
                for(let i = 0; i < len; ++i){
                    let id = p[i].id
                    if(name === this.$refs['property-'+id][0]._data.name){
                        count++
                    }
                }
                return count === 1 && name !== '' && name !== undefined
            },
            addProperty : function () {
                this.propertiesData.push({id : this.propertyId++,isEditing : true})
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.propertiesData = []
                if (this.schemasData !== undefined) {
                    let sd = this.schemasData
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
            commitChange : function () {
                ActionExecutorUtil.executeActions(this.schemasData, this.actionsQuery)
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
