<template>
    <div>
        <div class="form-group">
            <div class="form-row red-frame flex-md-wrap">
                <!--kolom kiri-->
                <div class="col-6">
                    <div v-if="isEditing" class="form-inline">
                        <label v-if="isHasName" class="col-4">Name :</label>
                        <b-input v-if="isHasName" class="col-8" v-model="name"></b-input>
                        <label class="col-4">Type :</label>
                        <b-select class="col-8"  v-model="type" @change="selectType">
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
                    <div v-else>
                        <h3>ini preview basic-kiri</h3>
                        <p>{{name}}</p>
                        <p>{{type}} <b>{{(required?"Required":"Optional")}}</b></p>
                    </div>
                </div>
                <!--kolom kanan-->
                <div class="col-6 blue-frame">
                    <div v-bind:style="{display: (isEditing)?'block':'none'}">
                        <div class="form-inline">
                            <label class="col-4">Description :</label>
                            <b-input class="col-8" v-model="description"></b-input>
                        </div>
                        <div class="form-inline float-right">
                            <label class="col-4">Example :</label>
                            <b-input class="col-8" v-model="example"></b-input>
                        </div>
                        <div class="form-inline float-right w-100">
                            <a style="float: right;color: #4493e2;cursor: pointer;"
                               class="more-attribute btn-link" @click="clickMoreDisplay">more attributes</a>
                        </div>
                        <br/>
                    </div>

                    <div v-if="!isEditing">
                        <h3>Ini preview basic-kanan</h3>
                        <p v-if="description !== ''">Description : {{description}}</p>
                        <p v-if="example !== ''">Example : {{example}}</p>
                    </div>
                    <div v-bind:style="{display: (isEditing)?moreDisplay:'block'}">
                        <!--more attributes of selected datatype-->
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
                    </div>
                </div>
            </div>

            <!--tambahan view jika tipe datanya array-->
            <div class="form-row blue-frame" v-if="type === 'array'">
                <div class="row w-100" v-for="(item,i) in items" v-bind:key="i">
                    <div class="col-6" v-if="isEditing">
                        <label class="col-4">Of :</label>
                        <b-select class="col-8" @change="selectItemType($event,i)" v-model="item.type">
                            <option v-for="dataType in dataTypes"
                                    v-bind:key="dataType.val"
                                    :value="dataType.val">{{dataType.text}}</option>
                        </b-select>
                    </div>
                    <div class="col-6">
                        {{item.type}}
                        <ArrayData :ref="'array-'+i" v-if="item.type === 'array'"
                                   :schemaData="item" :isEditing="isEditing"/>
                        <StringData ref="itemDataType" v-else-if="item.type === 'string'"
                                    :schemaData="item" :isEditing="isEditing"/>
                        <ObjectData ref="itemDataType" v-else-if="item.type === 'object'"
                                    :schemaData="lastItem" :isEditing="isEditing"/>
                        <NumericData ref="itemDataType" v-else-if="item.type === 'number'"
                                     :numericType="'number'" :schemaData="lastItem" :isEditing="isEditing"/>
                        <NumericData ref="itemDataType" v-else-if="item.type === 'integer'"
                                     :numericType="'integer'" schemaData="lastItem" :isEditing="isEditing"/>
                        <BooleanData ref="itemDataType" v-else-if="item.type === 'boolean'"
                                     :schemaData="lastItem" :isEditing="isEditing"/>
                    </div>
                </div>
            </div>

            <div v-if="type === 'object' || lastItem.type === 'object'" style="padding-left: 5%">
                <!--child object-->
                <div v-for="(val,i) in propertiesId" v-bind:key="val.id">
                    <DataTypeInput :ref="'property-'+val.id" :parentIsEditing="isEditing" :schemaData="val.schemaData"/>
                    <button @click="deleteProperty(i)">delete property</button>
                </div>
                <button @click="addNewProperty">Add more property</button>
            </div>
            <button @click="dump">check!</button>
            <button @click="isEditing = !isEditing">edit : {{isEditing}}</button>
        </div>
    </div>

</template>

<script>
    import ArrayData from "./typedatas/ArrayData";
    import StringData from "./typedatas/StringData";
    import ObjectData from "./typedatas/ObjectData";
    import NumericData from "./typedatas/NumericData";
    import BooleanData from "./typedatas/BooleanData";

    import CompareUtil from '@/utils/CompareUtil'


    export default {
        name: "DataTypeInput",
        components: {BooleanData, NumericData, ObjectData, StringData, ArrayData},
        props : ['parentIsEditing','schemaData'],
        data : () => ({
            //data editor
            isEditing : false,
            isMoreDisplay : false,

            //data general
            name : '',
            isHasName : true,
            description : '',
            type : 'string',
            required : false,
            example : '',
            exampleCount : 1,

            //data array
            arrayDimension : 0,
            itemType : '',
            items : [],

            //data object
            propertyId : 2,
            propertiesId : [{id : 1}],

            attributesKey : [
                {key : 'name'},
                {key : 'type'},
                {key : 'required'},
                {key : 'example'},
                {key : 'description'}
            ]

        }),
        computed : {
            moreDisplay: function () {
                return (this.isMoreDisplay)?'block':'none'
            },
            dataTypes : function () {
                return [
                    {text : 'Object', val : 'object'},
                    {text : 'Array', val : 'array'},
                    {text : 'String', val : 'string'},
                    {text : 'Number', val : 'number'},
                    {text : 'Integer', val : 'integer'},
                    {text : 'Boolean', val : 'boolean'},
                ]
            },
            customDataTypes : function () {
                return this.$store.getters['project/getDataTypes']
            },
            lastItem : function () {
                return (this.items.length === 0)?{}:this.items[this.items.length - 1]
            }
        },
        methods : {
            clickMoreDisplay : function(){
                this.isMoreDisplay = ! this.isMoreDisplay
            },
            selectType : function (value) {
                if(value === 'array'){
                    this.items = []
                    this.items.push({type : 'string'})
                }
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
            isEdited : function () {
                if(this.schemaData.type !== this.type)return true
                return CompareUtil.isChanged(this.schemaData, this._data, this.attributesKey)

            },
            /*
            * if ada perubahan, return {name,attributes}
            * else, return undefined
            * */
            getChangedData : function () {

                let isEdited = this.isEdited() || this.$refs.curDataType.isEdited()
                let res = this.$refs.curDataType.getAttributes()
                res.name = this.name
                res.description = this.description
                res.example = this.example

                let getChangedProperties = () => {
                    let properties = {}
                    let isEdited = false
                    for(let i=0; i <  this.propertiesId.length; i++){
                        let id = this.propertiesId[i].id
                        let data = this.$refs['property-'+id][0].getChangedData()
                        //jika tidak ada perubahan data dalam child => continue
                        if(data === undefined)continue
                        isEdited = true
                        properties[data.name] = data.attributes
                    }
                    if(isEdited){return properties}
                    return undefined
                }

                if(this.type === 'object'){
                    let propData = getChangedProperties()
                    //jika childnya juga tidak ada yg berubah
                    if(propData === undefined)return undefined
                    isEdited = true
                    res.properties = propData
                }
                else if(this.type === 'array'){
                    let pointer = res
                    //item terakhir bukan array
                    for(let i = 0; i < this.items.length-1; i++){
                        if(!isEdited){
                            isEdited |= this.$refs['array-'+i][0].isEdited()
                        }
                        pointer.items = this.$refs['array-'+i][0].getAttributes()
                        pointer = pointer.items
                    }

                    pointer.items = this.$refs.itemDataType[0].getAttributes()

                    if(this.lastItem.type === 'object'){
                        let propData = getChangedProperties()
                        if(propData !== undefined){
                            isEdited |= true
                            //jika child dari tipe data item array tidak berubah
                            pointer.items.properties = propData.properties
                        }
                    }
                    else if(!isEdited){
                        isEdited |= this.$refs.itemDataType[0].isEdited()
                    }
                }

                if(!isEdited)return undefined

                return {
                    name : this.name,
                    attributes : res
                }
            },
            addNewProperty : function() {
                this.propertiesId.push({id : this.propertyId++})
            },
            deleteProperty(i) {
                this.propertiesId.splice(i,1)
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
                console.log(this.getChangedData())
            }
        },
        created(){
            if(this.parentIsEditing !== undefined){
                this.isEditing = this.parentIsEditing
            }
            if(this.schemaData !== undefined){
                let sd = this.schemaData
                this.name = sd.name
                this.type = sd.type
                this.description = sd.description
                this.required = sd.required
                this.example = sd.example

                if(this.type === 'array'){
                    this.arrayDimension = 1
                    let initItems = (pointer) => {
                        this.items.push(pointer)
                        if(pointer.type === 'array'){
                            initItems(pointer.items)
                        }
                    }

                    initItems(this.schemaData.items)

                }

                //punya properties/child
                if(sd.properties !== undefined){
                    //buang default field
                    this.propertiesId.pop()
                    let pr = sd.properties
                    for(let key in pr){
                        let tmp = pr[key]
                        tmp.name = key
                        this.propertiesId.push({
                            id : this.propertyId++,
                            schemaData : pr[key]
                        })
                    }
                }
            }



            if(this.type === undefined){
                this.type = 'string'
            }

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
</style>