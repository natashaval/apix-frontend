<template>
    <div :class="(borderAble)?'dot-border':''">
        <div class="row justify-content-end" style="margin-left: -10%">
            <div class="col-1 ">
                <b-button class="round-button"
                          style="margin: 10px"
                          v-if="type === 'object'"
                          @click="showChild = (showChild === 'down')?'':'down'"
                    v-b-toggle="childCollapseId">
                    <i class="fa fa-angle-right rotate"
                       v-bind:class="showChild"></i>
                </b-button>
                <div class="w-100"></div>
                <!--<hr class="vline"/>-->
            </div>
            <div class="col-10 justify-content-end">
                <div class="container row">
                    <!--kolom kiri-->
                    <div class="col-6">
                        <div v-if="showEdit" class="form-inline">
                            <label v-if="nameAble" class="col-4">Name :</label>
                            <b-input v-if="nameAble" class="col-8" v-model="name"></b-input>
                            <label class="col-4">{{(isSubArray)?'Of :':'Type :'}}</label>
                            <b-select class="col-8" v-model="selectedType" @change="selectType">
                                <option v-for="dataType in dataTypes"
                                        v-bind:key="dataType.val"
                                        :value="dataType.val">{{dataType.text}}</option>
                                <hr/>
                                <option v-for="(value,name) in customDataTypes"
                                        v-bind:key="name"
                                        :value="name">{{name}}</option>
                            </b-select>
                            <label>Required : </label>
                            <b-checkbox v-model="required"/>
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
                            <div class="row">
                                <label class="col-4">Description :</label>
                                <b-input class="col-8" v-model="description"></b-input>
                            </div>
                            <div class="row">
                                <label class="col-4">Example :</label>
                                <b-input class="col-8" v-model="example"></b-input>
                            </div>
                            <div class="form-inline float-right w-100">
                                <a style="float: right;color: #4493e2;cursor: pointer;"
                                   class="more-attribute btn-link" @click="clickMoreDisplay">more attributes</a>
                            </div>
                            <br/>
                        </div>
                        <div v-else class="container">
                            <div class="row" style="text-align: right;display: block;">
                                <p v-if="description !== undefined">Description : {{description}}</p>
                            </div>
                            <div class="row" style="text-align: right;display: block;">
                                <p v-if="example !== undefined">Example : {{example}}</p>
                            </div>
                        </div>
                        <div v-bind:style="{display: (showEdit)?moreDisplay:'block'}">
                            <!--more attributes of selected datatype-->
                            <div class="w-100"></div>
                            <StringData ref="curDataType" v-if="type === 'string'"
                                        :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                                        :isEditing="showEdit" :schemaData="schemaData"/>
                            <ArrayData ref="curDataType" v-else-if="type === 'array'"
                                       :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                                       :isEditing="showEdit" :schemaData="schemaData"/>
                            <ObjectData ref="curDataType" v-else-if="type === 'object'"
                                        :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                                        :isEditing="showEdit" :schemaData="schemaData"/>

                            <NumericData ref="curDataType" v-else-if="type === 'number'"
                                         :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                                         :numericType="'number'" :isEditing="showEdit"
                                         :schemaData="schemaData"/>

                            <NumericData ref="curDataType" v-else-if="type === 'integer'"
                                         :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                                         :numericType="'integer'" :isEditing="showEdit"
                                         :schemaData="schemaData"/>

                            <BooleanData ref="curDataType" v-else-if="type === 'boolean'"
                                         :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                                         :isEditing="showEdit"
                                         :schemaData="schemaData"/>
                            <CustomData ref="curDataType" v-else
                                        :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                                        :scemaData="schemaData" :currentRef="ref"/>
                        </div>
                    </div>
                </div>


                <button @click="dump">Dump!</button>

            </div>
            <div class="col-1 " style="padding: 10px 25px;">
                <b-button v-if="editAble" @click="isEditing = !isEditing" class="float-right round-button">
                    <i class="fa fa-pencil-alt"></i>
                </b-button>
                <b-button v-if="deleteAble" @click="selfDelete" class="float-right round-button" style="margin-top:5px;">
                    <i class="fa fa-trash"></i>
                </b-button>
            </div>
        </div>
        <!--tambahan view jika tipe datanya array-->
        <div class="w-100" v-if="type === 'array'">
            <DataTypeInput ref="arrayItem" :schemaData="(schemaData !== undefined)?schemaData.items:undefined"
                           :borderAble="false"
                           :nameAble="false" :deleteAble="false" :editAble="false"
                           :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                           :isSubArray="true" :parentIsEditing="showEdit"/>
        </div>

        <b-collapse :id="childCollapseId" visible>
            <div v-if="type === 'object'">
                <!--child object-->
                <div v-for="(val,i) in propertiesData" v-bind:key="val.id" class="row justify-content-end">
                    <div style="margin-top: -16px;margin-bottom: 16px">
                        <hr class="vline"/>
                    </div>
                    <DataTypeInput :ref="'property-'+val.id" :parentIsEditing="val.isEditing"
                                   :schemaData="val.schemaData" :componentId="i"
                                   :fSelfDelete="deleteChild"
                                   :$_changeObserverMixin_ParentCallback="$_changeObserverMixin_onDataChanged"
                                   v-on:delete="deleteChild" class="col-11"/>
                    <!--<button @click="deleteProperty(i)">delete property</button>-->
                </div>
                <button @click="addNewProperty">Add more property</button>
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
        name: "DataTypeInput",
        components: {CustomData, BooleanData, NumericData, ObjectData, StringData, ArrayData},
        mixins : [ChangeObserverMixin],
        props : {
            fSelfDelete : {//delete function from parent
                type : Function
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
            nameAble : {//punya nama (default : true)
                type : Boolean,
                default : true
            },
            borderAble : {//punya border (default : true)
                type : Boolean,
                default : true
            },
            deleteAble : {//punya tombol delete (default : true)
                type : Boolean,
                default : true
            },
            editAble : {//jika false maka edit hanya bisa di trigger dari parentnya karna tidak ada tombol edit
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
                {text : 'Boolean', val : 'boolean'},
            ]
        }),
        computed : {
            refName : function () {
                if(this.ref === undefined){
                    return undefined
                }
                return this.ref.split('/')[2]
            },
            moreDisplay: function () {
                return (this.isMoreDisplay)?'block':'none'
            },
            customDataTypes : function () {
                return this.$store.getters['project/getDataTypes']
            },
            showEdit : function () {
                if(this.isSubArray){
                    return this.parentIsEditing
                }
                return this.isEditing
            }
        },
        methods : {
            isDefaultDataType : function (type) {
                return this.dataTypes.find(item => type === item.val) !== undefined
            },
            clickMoreDisplay : function(){
                this.isMoreDisplay = ! this.isMoreDisplay
            },
            selectType : function (value) {
                this.selectedType = value
                if(value === 'array'){
                    this.type = 'array'
                    // this.items = []
                    // this.items.push({type : 'string'})
                }
                else if(this.isDefaultDataType(value)){
                    this.type = value
                }
                else{
                    this.ref = '#/definitions/'+value
                    this.type = undefined
                }
            },
            selectItemType : function (value,i) {
                if(!this.isDefaultDataType(value)){
                    // this.items[i].ref = '#/definitions/'+value
                }
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
            //mengcopy hasil edit ke state vuex project
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


                if(this.schemaData === undefined){//jika object/field baru atau ganti tipe data
                    parentQuery._actions.push({
                        action : 'put',
                        key : this.name,
                        value : this.getData().attributes
                    })
                    return undefined
                }
                else if(this.schemaData.type !== this.type){//jika ganti tipe data
                    parentQuery._actions.push({
                        action : 'put',
                        key : (this.isSubArray)?'items':this.name,
                        value : this.getData().attributes
                    })
                }
                else if(this.schemaData.name !== this.name){//jika ganti nama
                    parentQuery._actions.push({
                        action : 'rename',
                        key : this.schemaData.name,
                        newKey : this.name
                    })
                    parentQuery[this.name] = query
                }//ingat undefined == null tapi undefined !== null
                else if(this.name !== '' && this.name != undefined ){//jika tidak ada perubahan nama
                    parentQuery[this.name] = query
                }
                else if(this.isSubArray){
                    parentQuery['items'] = query
                }
                else{//jika ga punya nama / jika root
                    parentQuery._actions = []
                    parentQuery._hasActions = true
                    query = parentQuery
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
            /*
            * if ada perubahan, return {name,attributes}
            * else, return undefined
            * */
            getData : function () {
                let res = this.$refs.curDataType.getAttributes()
                res.name = this.name
                res.description = this.description
                res.example = this.example
                if(this.type === 'object'){
                    res.properties = {}
                    for(let i=0; i <  this.propertiesData.length; i++){
                        let id = this.propertiesData[i].id
                        let data = this.$refs['property-'+id][0].getData()
                        res.properties[data.name] = data.attributes
                    }
                }
                else if(this.type === 'array'){
                    res.items = this.$refs['arrayItem'][0].getData().attributes
                }
                return {
                    name : this.name,
                    attributes : res
                }
            },
            addNewProperty : function() {
                this.propertiesData.push({id : this.propertyId++,isEditing : true})
            },
            selfDelete() {
                //panggil deleteChild() dari parent
                this.fSelfDelete(this.componentId)
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
            onExampleTyped : function(i) {
                if(i === this.exampleCount - 1 ){
                    if(this.examples[i] !== ''){
                        this.exampleCount++
                        this.examples.push('')
                    }
                }
                else if(i === this.exampleCount - 2){
                    if(this.examples[i] === ''){
                        this.exampleCount--
                        this.examples.pop()
                    }
                }
            },
            dump : function () {
                let tmp = {}
                this.buildQuery(tmp)
                console.log(tmp)
            },
            /*
            * input : #/definitions/mydatatype
            * output : mydatatype
            * */
            loadData : function () {
                this.$_changeObserverMixin_unObserve()
                this.projectId = this.$router.currentRoute.params.projectId

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
                        this.selectedType = this.refName
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
                }

                if(this.type === undefined && this.ref === undefined){
                    this.type = 'string'
                    this.selectedType = 'string'
                }

                //init observer dari mixin
                let watchList = ['propertiesData.length','selectedType']
                // watchList.push(this.attributesKey)
                this.attributesKey.forEach(attr => watchList.push(attr.key))
                this.$_changeObserverMixin_initObserver(watchList)
            },
            reloadData : function () {
                this.loadData()
            }
        },
        watch : {
            schemaData : function () {
                this.loadData()
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

    .round-button{
        border-radius: 50%;
        width: 35px;
        height: 35px;
        background: rgba(187, 184, 172, 0.49);
        display: inline-block;
        box-shadow: 0px 0px 2px #888;
        padding: 0.5em 0.6em;
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