<template>
    <div class="dot-border">
        <div class="row justify-content-end ">
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
                        <div v-if="isEditing" class="form-inline">
                            <label v-if="hasName" class="col-4">Name :</label>
                            <b-input v-if="hasName" class="col-8" v-model="name"></b-input>
                            <label class="col-4">Type :</label>
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
                        <div v-if="isEditing">
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
                        <div v-bind:style="{display: (isEditing)?moreDisplay:'block'}">
                            <!--more attributes of selected datatype-->
                            <div class="w-100"></div>
                            <StringData ref="curDataType" v-if="type === 'string'"
                                        :isEditing="isEditing" :schemaData="schemaData"/>
                            <ArrayData ref="curDataType" v-else-if="type === 'array'"
                                       :isEditing="isEditing" :schemaData="schemaData"/>
                            <ObjectData ref="curDataType" v-else-if="type === 'object'"
                                        :isEditing="isEditing" :schemaData="schemaData"/>

                            <NumericData ref="curDataType" v-else-if="type === 'number'"
                                         :numericType="'number'" :isEditing="isEditing"
                                         :schemaData="schemaData"/>

                            <NumericData ref="curDataType" v-else-if="type === 'integer'"
                                         :numericType="'integer'" :isEditing="isEditing"
                                         :schemaData="schemaData"/>

                            <BooleanData ref="curDataType" v-else-if="type === 'boolean'"
                                         :isEditing="isEditing"
                                         :schemaData="schemaData"/>
                            <CustomData ref="curDataType" v-else :scemaData="schemaData" :currentRef="ref"/>
                        </div>
                    </div>
                    <div class="w-100"></div>
                    <!--<div class="col-6">-->
                        <!---->
                    <!--</div>-->
                    <!--tambahan view jika tipe datanya array-->
                    <div class="col-12 w-100" v-if="type === 'array'">
                        <div class="row w-100" v-for="(item,i) in items" v-bind:key="i">
                            <!--editing mode-->
                            <div class="col-6" v-if="isEditing">
                                <label class="col-4">Of :</label>
                                <b-select class="col-8" @change="selectItemType($event,i)" v-model="item.type">
                                    <option v-for="dataType in dataTypes"
                                            v-bind:key="dataType.val"
                                            :value="dataType.val">{{dataType.text}}</option>
                                    <hr/>
                                    <option v-for="(value,name) in customDataTypes"
                                            v-bind:key="name"
                                            :value="name">{{name}}</option>
                                </b-select>
                            </div>
                            <div v-else class="col-6">
                                <div v-if="!isEditing" class="row">
                                    <p>Of :
                                        <b v-if="item.ref === undefined && !isEditing">{{item.type}}</b>
                                        <router-link v-else-if="!isEditing"
                                                     :to="'/projects/'+projectId+'/definitions/'+item.type">{{item.type}}</router-link>
                                    </p>
                                </div>
                            </div>
                            <div class="col-6" style="display:block;">
                                <ArrayData :ref="'array-'+i" v-if="item.type === 'array'"
                                           :schemaData="item" :isEditing="isEditing"/>
                                <StringData ref="itemDataType" v-else-if="item.type === 'string'"
                                            :schemaData="item" :isEditing="isEditing"/>
                                <ObjectData ref="itemDataType" v-else-if="item.type === 'object'"
                                            :schemaData="lastItem" :isEditing="isEditing"/>
                                <NumericData ref="itemDataType" v-else-if="item.type === 'number'"
                                             :numericType="'number'" :schemaData="lastItem" :isEditing="isEditing"/>
                                <NumericData ref="itemDataType" v-else-if="item.type === 'integer'"
                                             :numericType="'integer'" :schemaData="lastItem" :isEditing="isEditing"/>
                                <BooleanData ref="itemDataType" v-else-if="item.type === 'boolean'"
                                             :schemaData="lastItem" :isEditing="isEditing"/>
                                <CustomData ref="itemDataType" v-else :schemaData="lastItem" :currentRef="lastItem.ref"/>
                            </div>
                        </div>
                    </div>
                </div>


                <button @click="dump">Dump!</button>
                <!--<button @click="isEditing = !isEditing">edit : {{isEditing}}</button>-->

            </div>
            <div class="col-1 " style="padding: 10px 25px;">
                <b-button @click="isEditing = !isEditing" class="float-right round-button">
                    <i class="fa fa-pencil-alt"></i>
                </b-button>
                <b-button v-if="!isRoot" @click="selfDelete" class="float-right round-button" style="margin-top:5px;">
                    <i class="fa fa-trash"></i>
                </b-button>
            </div>
        </div>
        <b-collapse :id="childCollapseId" visible>
            <div v-if="type === 'object' || lastItem.type === 'object'">
                <!--child object-->
                <div v-for="(val,i) in propertiesData" v-bind:key="val.id" class="row justify-content-end">
                    <div class="row-3" style="margin-top: -16px;margin-bottom: 16px">
                        <hr class="vline row-3"/>
                    </div>
                    <DataTypeInput :ref="'property-'+val.id" :parentIsEditing="val.isEditing"
                                   :schemaData="val.schemaData" :componentId="i"
                                   :fSelfDelete="deleteChild"
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

    export default {
        name: "DataTypeInput",
        components: {CustomData, BooleanData, NumericData, ObjectData, StringData, ArrayData},
        props : [
            'fSelfDelete',//delete function from parent
            'parentIsEditing',//default value dari @isEditing
            'schemaData',//data dari parent, jika form baru maka null
            'componentId',//id atau index yang diberi oleh parent berdasarkan array childs parent
            'isRoot'//jika root maka tidak punya nama
        ],
        data : () => ({
            projectId : undefined,
            //data editor
            isEditing : false,
            isMoreDisplay : false,
            childCollapseId : Math.random().toString(),
            showChild : 'down',

            //data general
            name : '',
            hasName : true,
            description : '',
            type : undefined,
            selectedType : '',//untuk tampilan saja,hasil watch dari @type dan @ref
            required : false,
            example : '',
            exampleCount : 1,
            ref : undefined,
            //data array
            items : [],
            /*digunakan untuk kasus khusus
            * karna ketika array yang multidimensi diutak atik / array @items, schemaData bisa hilang sehingga validasi tidak valid
            * sehingga validasi/getActions dilakukan di file ini
            * array @schemaItems tidak diutak-atik isinya karna digunakan untuk comparison before dan after
            */
            schemaItems : [],

            //data object
            propertyId : 2,
            propertiesData : [{id : 1}],

            commitChangeCallback : [],

            //menyimpan propertyname yang didelete, tidak menyimpan property yang baru dibuat lalu dihapus
            deletedProperty : [],
            attributesKey : [
                {key : 'type'},
                {key : 'required'},
                {key : 'example'},
                {key : 'description'},
                {key : 'ref'}
            ],

            dataTypes : [
                {text : 'Object', val : 'object'},
                {text : 'Array', val : 'array'},
                {text : 'String', val : 'string'},
                {text : 'Number', val : 'number'},
                {text : 'Integer', val : 'integer'},
                {text : 'Boolean', val : 'boolean'},
            ],
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
            lastItem : function () {
                return (this.items.length === 0)?{}:this.items[this.items.length - 1]
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
                    this.items = []
                    this.items.push({type : 'string'})
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
                    this.items[i].ref = '#/definitions/'+value
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
            commitChange : function () {
                console.log('commit changed datatype input => '+this.name)
                this.commitChangeCallback.forEach(fn => fn())
            },
            getChangedData : function (parentQuery) {
                this.commitChangeCallback = []
                let query = {_hasActions : true, _actions : []}
                let childIsEdited = false

                if(parentQuery._hasActions === undefined){
                    parentQuery._hasActions = true
                    parentQuery._actions = []
                }

                //jika object/field baru
                if(this.schemaData === undefined || (this.schemaData.type !== this.type && this.ref === undefined)){
                    parentQuery._actions.push({
                        action : 'put',
                        key : this.name,
                        value : this.getData().attributes
                    })
                    return undefined
                }//jika ganti nama
                else if(this.schemaData.name !== this.name){
                    parentQuery._actions.push({
                        action : 'rename',
                        key : this.schemaData.name,
                        newKey : this.name
                    })
                    parentQuery[this.name] = query
                }//jika tidak ada perubahan nama
                //ingat undefined == null tapi undefined !== null
                else if(this.name !== '' && this.name != undefined ){
                    parentQuery[this.name] = query
                }
                else{
                    //jika ga punya nama????
                    parentQuery._actions = []
                    parentQuery._hasActions = true
                    query = parentQuery
                }


                let actions = this.getActions()
                if(this.$refs.curDataType !== undefined){
                    this.$refs.curDataType.getActions().forEach(x => actions.push(x))
                }
                this.deletedProperty.forEach(x => actions.push({action : 'delete',key : x}))

                query._actions = actions

                if(this.type === 'object'){
                    for(let i = 0; i < this.propertiesData.length; i++){
                        let id = this.propertiesData[i].id
                        //nandain apakah didalamnya ada diedit
                        let callback = this.$refs['property-'+id][0].getChangedData(query)
                        if(callback !== undefined){
                            childIsEdited = true
                            this.commitChangeCallback.push(callback)
                        }
                    }
                }
                else if(this.type === 'array') {
                    query.items = {}
                    let pointer = query
                    let lastEditedPointer = pointer
                    let sdItemPointer = this.schemaData.items
                    for(let i = 0; i < this.items.length - 1; i++){
                        pointer = pointer.items
                        // let tmp = this.$refs['array-' + i][0].getActions()
                        let tmp = ActionBuilder.createActions(
                            this.schemaItems[i],
                            this.$refs['array-' + i][0].getAttributes(),
                            this.$refs['array-' + i][0].getAttributesKey()
                        )

                        if(tmp.length > 0 || sdItemPointer === undefined){
                            lastEditedPointer = pointer
                            pointer._hasActions = true
                            pointer._actions = tmp
                            childIsEdited = true
                        }

                        pointer.items = {}
                        if(sdItemPointer !== undefined){
                            sdItemPointer = sdItemPointer.items
                        }
                    }
                    let getChilds = () => {
                        let childs = {}
                        for (let i = 0; i < this.propertiesData.length; i++) {
                            let id = this.propertiesData[i].id
                            //nandain apakah didalamnya ada diedit
                            let tmp = this.$refs['property-' + id][0].getData()
                            childs[tmp.name] = tmp.attributes
                        }
                        return childs
                    }
                    //dimensi array berubah menjadi lebih pendek
                    if(sdItemPointer !== undefined && sdItemPointer.type === 'array'){
                        let objVal = this.$refs.itemDataType[0].getAttributes()
                        if(this.lastItem.type === 'object'){
                            objVal.properties = getChilds()
                        }
                        if(pointer._hasActions === undefined){
                            pointer._hasActions = true
                            pointer._actions = []

                        }
                        childIsEdited = true
                        pointer._actions.push({
                            action : 'put',
                            put : 'items',
                            value : objVal
                        })
                        delete pointer.items
                    }//tipe data child berubah
                    else if(sdItemPointer !== undefined && sdItemPointer.type !== this.lastItem.type){
                        let value = undefined
                        if(this.lastItem.type === 'object'){
                            value = {
                                type : 'object',
                                properties : getChilds()
                            }
                        }
                        else{
                            value = this.$refs.itemDataType[0].getAttributes()
                        }
                        pointer._hasActions = true
                        pointer._actions = [{
                            action : 'put',
                            key : 'items',
                            value : value
                        }]
                        childIsEdited = true
                        delete pointer.items
                    }
                    //ngecek child dari last item berubah atau tidak
                    else if (this.lastItem.type === 'object') {
                        pointer = pointer.items
                        let tmp = {}
                        let itemIsEdited = false
                        for (let i = 0; i < this.propertiesData.length; i++) {
                            let id = this.propertiesData[i].id
                            //nandain apakah didalamnya ada diedit
                            let callback = this.$refs['property-' + id][0].getChangedData(tmp)
                            if(callback !== undefined){
                                itemIsEdited = true
                            }
                        }
                        if (itemIsEdited) {
                            pointer.properties = tmp
                            childIsEdited = true
                        }else{
                            delete lastEditedPointer.items
                        }
                    }
                    else if(this.lastItem.ref !== undefined){
                        if(pointer._hasActions === undefined){
                            pointer._hasActions = true
                            pointer._actions = []

                        }
                        pointer._actions.push({
                            action : 'put',
                            key : 'items',
                            value : {ref : this.lastItem.ref}
                        })
                    }
                    //ngecek attribute last item berubah atau tidak
                    else {
                        pointer = pointer.items
                        let tmp = ActionBuilder.createActions(
                            this.schemaItems[this.schemaItems.length-1],
                            this.$refs.itemDataType[0].getAttributes(),
                            this.$refs.itemDataType[0].getAttributesKey()
                        )

                        if (tmp.length > 0) {
                            pointer._actions = tmp
                            pointer._hasActions = true
                            childIsEdited = true
                        }else {
                            delete lastEditedPointer.items
                        }
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
                if(this.type === 'object' || this.lastItem.type === 'object'){
                    res.properties = {}
                    for(let i=0; i <  this.propertiesData.length; i++){
                        let id = this.propertiesData[i].id
                        let data = this.$refs['property-'+id][0].getData()
                        res.properties[data.name] = data.attributes
                    }
                }

                if(this.type === 'array'){
                    let pointer = res
                    //item terakhir bukan array
                    for(let i = 0; i < this.items.length-1; i++){
                        pointer.items = this.$refs['array-'+i][0].getAttributes()
                        pointer = pointer.items
                    }
                    pointer.items = this.$refs.itemDataType[0].getAttributes()
                    pointer.items.properties = res.properties
                    delete res.properties
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
                this.getChangedData(tmp)
                console.log(tmp)
            },
            /*
            * input : #/definitions/mydatatype
            * output : mydatatype
            * */
            loadSchemaData : function () {
                this.projectId = this.$router.currentRoute.params.projectId

                this.deletedProperty = []

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
                    if(sd['ref'] !== undefined){
                        this.ref = sd['ref']
                        this.selectedType = this.refName
                    }

                    if(this.type === 'array'){
                        this.items = []
                        this.schemaItems = []
                        let initItems = (pointer) => {
                            let copy = Object.assign({},pointer)
                            if(copy['ref'] !== undefined){
                                copy.ref = copy['ref']
                                copy.type = copy.ref.split('/')[2]
                            }
                            this.items.push(copy)
                            this.schemaItems.push(pointer)
                            if(pointer.type === 'array'){
                                initItems(pointer.items)
                            }
                        }

                        initItems(this.schemaData.items)

                    }

                    //punya properties/child
                    if(sd.properties !== undefined){
                        //buang default field
                        // this.propertiesData.pop()
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

                if(this.isRoot === true){
                    this.hasName = false
                }
            },
        },
        watch : {
            schemaData : function () {
                this.loadSchemaData()
            }
        },
        created(){
            this.loadSchemaData()

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