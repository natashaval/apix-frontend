<template>
    <div :class="(borderable)?'dot-border':''">
        <div class="row justify-content-end" style="margin-left: -10%">
            <div class="col-10 mt-3">
                <div class="container row">
                    <!--kolom kiri-->
                    <div class="col-6">
                        <div v-if="showEdit" class="form-row">
                            <b-form-group v-if="nameable" class="form-row mb-2 w-100"
                                          :state="nameState" :invalid-feedback="nameInvalidFeedback"
                                          label="name * :"
                                          label-cols="2">
                                <slot v-if="disableName">
                                    <b-form-input class="col-10 form-control" disabled v-model="name" :name="_uid+'-name'"/>
                                </slot>
                                <slot v-else>
                                    <b-form-input class="form-control" v-model="name"
                                                  :state="nameState" trim
                                                  :name="_uid+'-name'" id="target1" ref="yay"/>
                                </slot>
                            </b-form-group>
                            <div class="form-row w-100 mb-2">
                                <label class="shrinkable-text col-2 mt-auto">{{(isSubArray)?'Of :':'Type :'}}</label>
                                <b-select class="form-control col-10" :name="_uid+'-select-type'" v-model="selectedType">
                                    <optgroup label="Data Type"/>
                                    <hr/>
                                    <option v-for="dataType in dataTypes"
                                            v-bind:key="dataType.val"
                                            :value="dataType.val">{{dataType.text}}</option>
                                    <hr/>
                                    <optgroup label="Model / Custom DataType"/>
                                    <hr/>
                                    <option v-for="dataType in customDataTypes"
                                            v-bind:key="dataType.value"
                                            :value="dataType.value">{{dataType.name}}</option>
                                </b-select>
                            </div>
                            <div class="form-row w-100">
                                <label class="shrinkable-text mt-1">Required :</label>
                                <input type="checkbox" style="margin-left: 0.5em" v-model="required" :name="_uid+'-is-required'"/>
                            </div>
                        </div>
                        <div v-else class="row">
                            <p v-if="isSubArray">Of: </p>
                            <p>{{name}}</p>
                            <div class="w-100"></div>
                            <p v-if="type !== '' && type !== undefined">{{type}}</p>
                            <router-link v-else
                                         :to="'/projects/'+projectId+'/definitions/'+refName">
                                {{refName}}
                            </router-link>
                            <div class="col-1"></div>
                            <b>{{(required?"Required":"Optional")}}</b>
                        </div>
                    </div>
                    <!--kolom kanan-->
                    <div class="col-6">
                        <div v-if="showEdit">
                            <div class="form-row mb-2">
                                <label class="shrinkable-text col-3 mt-auto">Description :</label>
                                <input class="col-9 form-control" v-model="description" :name="_uid+'-description'"/>
                            </div>
                            <div class="form-row">
                                <label class="shrinkable-text col-3 mt-auto">Example :</label>
                                <input class="col-9 form-control" v-model="example"/>
                            </div>
                            <div class="form-row mt-2 mb-2">
                                <a v-bind:id="_uid+'-more-attribute'"
                                   class="btn-text more-attribute text-right w-100" @click="clickMoreDisplay"
                                v-html="(isMoreDisplay)?'less':'more attributes'"
                                >more attributes</a>
                            </div>
                        </div>
                        <div v-else style="padding-left: 50%">
                            <div class="row" style="display: block;">
                                <p v-if="description !== undefined">Description : {{description}}</p>
                            </div>
                            <div class="row" style="display: block;">
                                <p v-if="example !== undefined">Example : {{example}}</p>
                            </div>
                        </div>
                        <div v-bind:style="{display: (showEdit)?moreDisplay:'block'}"
                            v-bind:id="_uid+'-more-attr-form'">
                            <StringData ref="curDataType" v-if="type === 'string'"
                                        :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                        :is-editing="showEdit" :schema-data="schemaData"/>
                            <ArrayData ref="curDataType" v-else-if="type === 'array'"
                                       :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                       :is-editing="showEdit" :schema-data="schemaData"/>
                            <ObjectData ref="curDataType" v-else-if="type === 'object'"
                                        :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                        :is-editing="showEdit" :schema-data="schemaData"/>

                            <NumericData ref="curDataType" v-else-if="type === 'number'"
                                         :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                         :numeric-type="'number'" :is-editing="showEdit"
                                         :schema-data="schemaData"/>

                            <NumericData ref="curDataType" v-else-if="type === 'integer'"
                                         :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                         :numeric-type="'integer'" :is-editing="showEdit"
                                         :schema-data="schemaData"/>

                            <BooleanData ref="curDataType" v-else-if="type === 'boolean'"
                                         :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                         :is-editing="showEdit"
                                         :schema-data="schemaData"/>
                            <CustomData ref="curDataType" v-else-if="ref !== undefined"
                                        :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                        :schema-data="schemaData" :current-ref="ref"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-1 " style="padding: 10px 25px;">
                <button v-if="editable" @click="isEditing = !isEditing"
                        class="float-right round-button btn" v-bind:id="_uid+'-edit-btn'">
                    <i class="fa fa-pencil-alt"></i>
                </button>
                <button v-if="deleteable" @click="selfDelete" class="float-right round-button btn"
                        style="margin-top:5px;" v-bind:id="_uid+'-delete-btn'">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
        <!--tambahan view jika tipe datanya array-->
        <div class="w-100" v-if="type === 'array'">
            <HighLvlJsonEditor ref="arrayItem" :schema-data="(schemaData !== undefined)?schemaData.items:undefined"
                           :borderable="false"
                           :nameable="false" :deleteable="false" :editable="false"
                           :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                           :is-sub-array="true" :parent-is-editing="showEdit"/>
        </div>
        <div>
            <button class="round-button btn"
                    style="margin: 10px"
                    v-if="type === 'object'"
                    @click="showChild = (showChild === 'down')?'':'down'"
                    v-b-toggle="_uid+'-child-collapse'">
                <i class="fa fa-angle-right rotate"
                   v-bind:class="showChild"></i>
            </button>
            <div class="w-100"></div>
        </div>

        <b-collapse v-bind:id="_uid+'-child-collapse'" visible>
            <div v-if="type === 'object'" style="padding-right: 0">
                <!--child object-->
                <div v-for="(val,i) in propertiesData" v-bind:key="val.id" class="row justify-content-end" style="">
                    <div style="margin-top: -16px;margin-bottom: 16px">
                        <hr class="vline"/>
                    </div>
                    <HighLvlJsonEditor :ref="'property-'+val.id" :parent-is-editing="val.isEditing"
                                   :schema-data="val.schemaData" :component-id="i"
                                   :parent-functions="publicFunctions"
                                   :editable="editable"
                                   :deleteable="editable"
                                   :$_changeObserverMixin_parent="$_changeObserverMixin_this"
                                   v-on:delete="deleteChild" class="col-11"/>
                </div>
                <a :ref="_uid+'-add-child-btn'" @click="addNewProperty" class="btn-text">
                    <i class="fas fa-plus"></i> Add more property
                </a>
            </div>
        </b-collapse>
    </div>

</template>

<script>
    import ArrayData from "./typedatas/ArrayData";
    import StringData from "./typedatas/StringData";
    import ObjectData from "./typedatas/ObjectData";
    import NumericData from "./typedatas/NumericData";
    import BooleanData from "./typedatas/BooleanData";

    import ActionBuilder from '@/utils/ActionBuilderUtil'
    import CustomData from "./typedatas/CustomData";
    import ActionExecutorUtil from "@/utils/ActionExecutorUtil";
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin";

    export default {
        name: "HighLvlJsonEditor",
        components: {CustomData, BooleanData, NumericData, ObjectData, StringData, ArrayData},
        mixins : [ChangeObserverMixin],
        props : {
            parentFunctions : {//wrapper function dari parent yang bisa diakses child
                type : Object,
                default : ()=>({
                    isValidName : ()=>true
                })
            },
            parentIsEditing : {//default value dari @isEditing
                type : Boolean
            },
            schemaData : {//data dari parent, jika form baru maka null
                type : Object
            },
            componentId : {//id atau index yang diberi oleh parent berdasarkan array childs parent
                type : Number
            },
            nameable : {//punya nama (default : true)
                type : Boolean,
                default : true
            },
            disableName : {
                type : Boolean,
                default : false
            },
            fixedName : {//jika @nameable == false, maka nama yang dipakai adalah @fixedName
                type : String
            },
            borderable : {//punya border (default : true)
                type : Boolean,
                default : true
            },
            deleteable : {//punya tombol delete (default : true)
                type : Boolean,
                default : true
            },
            editable : {//jika false maka edit hanya bisa di trigger dari parentnya karna tidak ada tombol edit
                type : Boolean,
                default : true
            },
            isSubArray : {//jika merupakan subarray dari parentnya / parentnya adalah array
                type : Boolean,
                default : false
            },

        },
        data : () => ({
            projectId : undefined,
            //data editor
            isEditing : false,
            isMoreDisplay : false,
            childCollapseId : Math.random().toString(),
            showChild : 'down',

            //data general
            name : '',
            description : '',
            type : undefined,
            selectedType : '',//untuk tampilan saja,karna untuk 'ref' value dan text di select option tidak sama
            required : false,
            example : '',
            exampleCount : 1,
            ref : undefined,

            //data object
            propertyId : 2,
            propertiesData : [{id : 1,isEditing : true}],

            commitChangeCallback : [],
            actionsQuery : [],
            propertiesActionQuery : [],//query yang ada di properties dari object

            //menyimpan propertyname yang didelete, tidak menyimpan property yang baru dibuat lalu dihapus
            deletedProperty : [],
            attributesKey : [
                {key : 'type'},
                {key : 'required'},
                {key : 'example'},
                {key : 'description'}
            ],

            dataTypes : [
                {text : 'Object', val : 'object'},
                {text : 'Array', val : 'array'},
                {text : 'String', val : 'string'},
                {text : 'Number', val : 'number'},
                {text : 'Integer', val : 'integer'},
                {text : 'Boolean', val : 'boolean'}
            ]
        }),
        computed : {
            nameState: function(){
                return this.$_changeObserverMixin_isValid('name')
            },
            nameInvalidFeedback() {
                return this.$_changeObserverMixin_getErrors('name')[0]
            },
            refName : function () {
                if(this.ref === undefined){
                    return undefined
                }
                let defId = this.ref.split('/')[2]
                let res = this.$store.getters['project/getDefinitionDataById'](defId)
                if(res === undefined)return ''
                return res.name
            },
            moreDisplay: function () {
                return (this.isMoreDisplay)?'block':'none'
            },
            customDataTypes : function () {
                let defs = this.$store.getters['project/getDefinitions']
                return Object.keys(defs).map(key => {
                    return {name : defs[key].name, value : '#/definitions/'+key}
                })
            },
            showEdit : function () {
                if(this.isSubArray){
                    return this.parentIsEditing
                }
                return this.isEditing
            },
            publicFunctions : function () {
                return {
                    deleteChild : this.deleteChild,
                    isValidName : this.isValidName
                }
            },
            nameError : function () {
                return this.$_changeObserverMixin_getErrors('name');
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
            isDefaultDataType : function (type) {
                return this.dataTypes.find(item => type === item.val) !== undefined
            },
            clickMoreDisplay : function(){
                this.isMoreDisplay = ! this.isMoreDisplay
            },
            selectItemType : function (value,i) {
                if(value === 'array' && i === this.items.length -1 ){
                    this.items.push({
                        type : 'string'
                    })
                }
                else{
                    this.items = this.items.slice(0,i+1)
                }

            },
            getActions : function () {
                let tmp = this.schemaData
                return ActionBuilder.createActions(tmp, this._data, this.attributesKey)
            },
            //mengcopy hasil edit ke nameState vuex project
            commitChange : function () {
                ActionExecutorUtil.executeActions(this.schemaData, this.actionsQuery)
                if(this.type === 'object' ){
                    //execute actions yang ada di properties
                    ActionExecutorUtil.executeActions(
                        this.schemaData.properties,
                        this.propertiesActionQuery
                    )
                }
                this.commitChangeCallback.forEach(fn => fn())
            },
            /* parameter : @parentQuery(pointer object dari parent, semua query akan langsung di assign ke pointer,
            * tidak melalui return value)
            * return : fungsi callback(digunakan untuk commit change) jika data dirinya atau childnya teredit
            * */
            buildQuery : function (parentQuery) {
                this.commitChangeCallback = []
                let query = {_hasActions : true, _actions : []}
                let childIsEdited = false
                if(parentQuery._hasActions === undefined){
                    parentQuery._hasActions = true
                    parentQuery._actions = []
                }

                let name = this.name
                if(this.isSubArray){
                    name = 'items'
                }
                else if(!this.nameable){
                    name = this.fixedName
                }

                if(this.schemaData === undefined){//jika object/field baru
                    parentQuery._actions.push({
                        action : 'put',
                        key : name,
                        value : this.getData()
                    })
                    return undefined
                }
                else if(this.schemaData.type !== this.type){//jika ganti tipe data
                    parentQuery._actions.push({
                        action : 'put',
                        key : name,
                        value : this.getData()
                    })
                    return undefined
                }
                else if(this.nameable && this.schemaData.name !== this.name){//jika ganti nama
                    parentQuery._actions.push({
                        action : 'rename',
                        key : this.schemaData.name,
                        newKey : this.name
                    })
                    parentQuery[this.name] = query
                }//ingat undefined == null tapi undefined !== null
                else if(name !== '' && name != undefined ){//jika tidak ada perubahan nama
                    if(parentQuery[name] === undefined){
                        parentQuery[name] = query
                    }
                }
                else{
                    throw 'Name can\'t be empty!'
                }


                let actions = this.getActions()
                if(this.$refs.curDataType !== undefined){
                    this.$refs.curDataType.getActions().forEach(x => actions.push(x))
                }

                query._actions = actions

                if(this.type === 'object'){
                    query.properties = {
                        _actions : this.propertiesActionQuery = [],
                        _hasActions : true
                    }

                    this.deletedProperty.forEach(x => query.properties._actions.push({action : 'delete',key : x}))
                    for(let i = 0; i < this.propertiesData.length; i++){
                        let id = this.propertiesData[i].id
                        //nandain apakah didalamnya ada diedit
                        let callback = this.$refs['property-'+id][0].buildQuery(query.properties)
                        if(callback !== undefined){
                            childIsEdited = true
                            this.commitChangeCallback.push(callback)
                        }
                    }

                    if(query.properties._actions.length === 0){
                        delete query.properties._actions
                        delete query.properties._hasActions
                    }
                    else{
                        childIsEdited = true
                    }

                    if(!childIsEdited){
                        delete query.properties
                    }
                }
                else if(this.type === 'array') {
                    let callback = this.$refs['arrayItem'].buildQuery(query)
                    if(callback !== undefined){
                        childIsEdited = true
                        this.commitChangeCallback.push(callback)
                    }
                    else{
                        delete query.items
                    }
                }

                let isEdited = query._actions.length > 0 || childIsEdited
                if(!isEdited){
                    delete parentQuery[this.name]
                }
                else{
                    if(query._actions.length === 0){
                        delete query._hasActions
                        delete query._actions
                    }
                    else{
                        this.actionsQuery = query._actions
                        isEdited = true
                    }
                }

                return (isEdited)?this.commitChange : undefined
            },
            getData : function () {
                let res = this.$refs.curDataType.getAttributes()

                if(this.nameable){
                    res.name = this.name
                }

                res.description = this.description
                res.example = this.example
                res.required = this.required
                if(this.type === 'object'){
                    res.properties = {}
                    for(let i=0; i <  this.propertiesData.length; i++){
                        let id = this.propertiesData[i].id
                        let data = this.$refs['property-'+id][0].getData()
                        res.properties[data.name] = data
                    }
                }
                else if(this.type === 'array'){
                    res.items = this.$refs['arrayItem'].getData()
                }
                return res
            },
            addNewProperty : function() {
                this.propertiesData.push({id : this.propertyId++,isEditing : true})
            },
            selfDelete() {
                this.parentFunctions.deleteChild(this.componentId)
                // this.$_changeObserverMixin_selfDelete()
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
            dump : function () {
                let tmp = {}
                this.buildQuery(tmp)
            },
            reloadData : function(){
                this.loadData()
            },
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.projectId = this.$route.params.projectId

                this.deletedProperty = []
                this.propertiesData = []

                if(this.parentIsEditing !== undefined){
                    this.isEditing = this.parentIsEditing
                }
                if(this.schemaData !== undefined){
                    let sd = this.schemaData
                    this.name = sd.name
                    this.type = sd.type
                    this.selectedType = sd.type
                    this.description = sd.description
                    this.required = sd.required
                    this.example = sd.example
                    if(sd['$ref'] !== undefined){
                        this.ref = sd['$ref']
                        this.selectedType = this.ref
                    }

                    //punya properties/child
                    if(sd.properties !== undefined){
                        this.propertiesData = []
                        let pr = sd.properties
                        for(let key in pr){
                            let tmp = pr[key]
                            tmp.name = key
                            this.propertiesData.push({
                                id : this.propertyId++,
                                schemaData : pr[key],
                                isEditing : false
                            })
                        }
                    }
                    else{
                        this.ref = undefined
                    }
                }

                if(!this.nameable){
                    this.name = this.fixedName
                }

                if(this.type === undefined && this.ref === undefined){
                    this.type = 'string'
                    this.selectedType = 'string'
                }

                //init observer dari mixin
                let watchList = ['propertiesData.length','selectedType',
                    {
                        model : 'name',
                        validator : () => {
                            if(this.nameable){
                                if(this.name.length === 0){
                                    return ['name can\'t be empty']
                                }
                                else if(!this.parentFunctions.isValidName(this.name))
                                    return ['name must be unique']
                            }
                            return []
                        }
                    }
                ]
                this.attributesKey.forEach(attr => watchList.push(attr.key))
                this.$_changeObserverMixin_initObserver(watchList)
            }
        },
        watch : {
            schemaData : function () {
                this.loadData()
            },
            selectedType : function () {
                let value = this.selectedType
                this.selectedType = value
                if(value === 'array'){
                    this.type = 'array'
                }
                else if(this.isDefaultDataType(value)){
                    this.type = value
                }
                else{
                    this.ref = value
                    this.type = undefined
                }
            }
        },
        mounted() {
            this.loadData()
        }
    }
</script>

<style scoped>
    div{
        font-size: 12px;
    }

    .more-attribute{
        float: right;color: #4493e2;cursor: pointer;
    }

    .vline{
        border-left: 6px solid rgba(226, 116, 0, 0.41);
        height: 100%;
    }


    .rotate {
        -moz-transition: all .5s linear;
        -webkit-transition: all .5s linear;
        transition: all .2s linear;
    }

    .rotate.down{
        -moz-transform:rotate(90deg);
        -webkit-transform:rotate(90deg);
        transform:rotate(90deg);
    }

</style>
