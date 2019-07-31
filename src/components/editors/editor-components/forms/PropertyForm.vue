<template>
    <div>
        <p v-if="editable" @click="addProperty" class="text-primary btn-text" style="font-size: 15px"
            :id="_uid+'-add-property'">
            <i class="fas fa-plus"></i> Add
        </p>
        <div v-for="(property,idx) in propertiesData" v-bind:key="property.id">
            <HighLvlJsonEditor :ref="'property-'+property.id"
                           :parent-is-editing="property.isEditing"
                           :project-id="projectId"
                           :editable="editable"
                           :deleteable="editable"
                           :parent-functions="publicFunctions"
                           :schema-data="property.schemaData"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                           :component-id="idx"/>
        </div>
    </div>
</template>

<script>
    import HighLvlJsonEditor from "../inputs/HighLvlJsonEditor";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";
    export default {
        name: "PropertyForm",
        mixins : [ChangeObserverMixin],
        props : {
            schemasData : {
                type : Object
            },
            editable : {
                type : Boolean,
                default : true
            }
        },
        components: {HighLvlJsonEditor},
        data : () => ({
            propertiesData : [],
            propertyId : 0,
            //menyimpan property yang didelete, tidak menyimpan property yang baru dibuat lalu dihapus
            deletedProperty : [],
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
            },
            myRef : function () {
                return this.$refs
            }
        },
        methods : {
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
            getData : function () {
                let res = {}
                for(let i = 0; i < this.propertiesData.length; i++){
                    let id = this.propertiesData[i].id
                    let child = this.$refs['property-'+id][0].getData()
                    res[child.name] = child
                }
                return res
            },
            addProperty : function () {
                this.propertiesData.push({id : this.propertyId++,isEditing : true})
            },
            reloadData : function () {
                this.loadData()
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.propertiesData.length = 0
                this.deletedProperty = []
                if (this.schemasData) {
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
            deleteChild : function (childIndex) {
                //jika bukan property baru, maka bikin query delete
                if(this.propertiesData[childIndex].schemaData !== undefined){
                    this.deletedProperty.push(
                        this.propertiesData[childIndex].schemaData.name
                    )
                }
                this.propertiesData.splice(childIndex,1)
            },
            buildQuery :function (query) {
                let callbacks = []
                let isEdited = false
                for(let i = 0; i < this.propertiesData.length; i++){
                    let id = this.propertiesData[i].id
                    let callback = this.$refs['property-'+id][0].buildQuery(query)
                    if( callback !== undefined ){
                        isEdited = true
                        callbacks.push(callback)
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
                        let propertiesActions = query._actions
                        let schemasData = this.schemasData
                        callbacks.push(()=>{
                            ActionExecutorUtil.executeActions(schemasData, propertiesActions)
                        })
                    }
                }
                return (isEdited)?()=>{callbacks.forEach(fn => fn())}: undefined
            }
        },
        watch : {
            schemasData : function () {
                this.loadData()
            }
        },

        mounted() {
            this.loadData()
        }
    }
</script>

<style scoped>

</style>
