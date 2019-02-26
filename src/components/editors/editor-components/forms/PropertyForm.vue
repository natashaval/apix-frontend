<template>
    <div>
        <button @click="addProperty">Add</button>
        <div v-for="(property,idx) in propertiesData" v-bind:key="property.id">
            <DataTypeInput :parentIsEditing="property.isEditing"
                           :projectId="projectId"
                           :schemaData="property.schemaData"
                           :ref="'property-'+property.id"
                           :componentId="idx" :fSelfDelete="deleteChild"/>
        </div>
        <button @click="getChangedData">Dump!</button>
    </div>
</template>

<script>
    import DataTypeInput from "../inputs/DataTypeInput";
    export default {
        name: "PropertyForm",
        props : ['schemaData'],
        components: {DataTypeInput},
        data : () => ({
            propertiesData : [],
            propertyId : 0,
            //menyimpan property yang didelete, tidak menyimpan property yang baru dibuat lalu dihapus
            deletedPropertyQuery : [],

        }),
        computed : {
            projectId : function () {
                return this.$route.params.projectId
            }
        },
        methods : {
            addProperty : function () {
                this.propertiesData.push({id : this.propertyId++,isEditing : true})
            },
            loadData : function () {
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
            },
            deleteChild : function (childIndex) {
                //jika bukan property baru, maka bikin query delete
                if(this.propertiesData[childIndex].schemaData !== undefined){
                    this.deletedPropertyQuery.push({
                        action : 'delete',
                        key : this.propertiesData[childIndex].schemaData.name
                    })
                }
                this.propertiesData.splice(childIndex,1)
            },
            getChangedData : function (query) {
                for(let i = 0; i < this.propertiesData.length; i++){
                    let id = this.propertiesData[i].id
                    this.$refs['property-'+id][0].getChangedData(query)
                }

                if(this.deletedPropertyQuery.length > 0){
                    if(query._actions === undefined){
                        query._actions = []
                    }
                    this.deletedPropertyQuery.forEach(x => query._actions.push(x))
                }

                if(query._actions !== undefined && query._actions.length === 0){
                    delete query._hasActions
                    delete query._actions
                }
            }
        },
        created() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>