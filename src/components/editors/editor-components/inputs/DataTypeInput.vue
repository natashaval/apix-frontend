<template>
    <div ref="generall" class="form-group">
        <div class="form-row red-frame flex-md-wrap">
            <div class="col-6 form-inline">
                <label class="col-4">Name :</label>
                <b-input class="col-8" v-model="name"></b-input>
                <label class="col-4">Type :</label>
                <b-select class="col-8"  v-model="type" @change="selectType">
                    <option v-for="dataType in dataTypes" v-bind:key="dataType" :value="dataType">{{dataType}}</option>
                </b-select>
                <div class="form-inline" v-for="i in arrayDimension" v-bind:key="i">
                    <label class="col-4">Of :</label>
                    <b-select class="col-8" @change="selectItemType($event,i)" value="String">
                        <option v-for="dataType in dataTypes" v-bind:key="dataType" :value="dataType">{{dataType}}</option>
                    </b-select>
                </div>
            </div>
            <div class="col-6 blue-frame">
                <div class="form-inline">
                    <label class="col-4">Description :</label>
                    <b-input class="col-8" v-model="description"></b-input>
                </div>
                <div class="form-inline float-right" v-for="(key,i) in exampleCount" v-bind:key="i">
                    <label class="col-4">Example :</label>
                    <b-input class="col-8" @keyup.native="onExampleTyped(i)" v-model="examples[i]"></b-input>
                </div>

                <a style="float: right;color: #4493e2;cursor: pointer;"
                   class="more-attribute btn-link" @click="clickMoreDisplay">more attributes</a>
                <br/>
                <div v-bind:style="{display: moreDisplay}">
                    <!--more attributes of selected datatype-->
                    <StringData ref="curDataType" v-if="type === 'String'"/>
                    <ArrayData ref="curDataType" v-else-if="type === 'Array'"/>
                    <ObjectData ref="curDataType" v-else-if="type === 'Object'"/>
                    <NumericData ref="curDataType" v-else-if="type === 'Number'" :numericType="'Number'"/>
                    <NumericData ref="curDataType" v-else-if="type === 'Integer'" :numericType="'Integer'"/>
                    <BooleanData ref="curDataType" v-else-if="type === 'Boolean'"/>
                </div>
                <div v-if="arrayDimension > 0" v-bind:style="{display: moreDisplay}">
                    <!--more attribues of 'of' of arrayType-->
                    <ArrayData v-for="i in arrayDimension-1" v-bind:key="i" :ref="'array-'+i"/>
                </div>
                <div v-if="itemType !== undefined" v-bind:style="{display: moreDisplay}">
                    <!--more attributes of array-->
                    <StringData ref="itemDataType" v-if="itemType === 'String'"/>
                    <ObjectData ref="itemDataType" v-else-if="itemType === 'Object'"/>
                    <NumericData ref="itemDataType" v-else-if="itemType === 'Number'" :numericType="'Number'"/>
                    <NumericData ref="itemDataType" v-else-if="itemType === 'Integer'" :numericType="'Integer'"/>
                    <BooleanData ref="itemDataType" v-else-if="itemType === 'Boolean'"/>
                </div>
            </div>
        </div>
        <div v-if="type === 'Object' || itemType === 'Object'" style="padding-left: 5%">
            <!--child object-->
            <div v-for="(val,i) in propertiesId" v-bind:key="val">
                <DataTypeInput :ref="'property-'+val"/>
                <button @click="deleteProperty(i)">delete property</button>
            </div>
            <button @click="addNewProperty">Add more property</button>
        </div>
        <button @click="dump">check!</button>
    </div>
</template>

<script>
    import ArrayData from "./typedatas/ArrayData";
    import StringData from "./typedatas/StringData";
    import ObjectData from "./typedatas/ObjectData";
    import NumericData from "./typedatas/NumericData";
    import BooleanData from "./typedatas/BooleanData";


    export default {
        name: "DataTypeInput",
        components: {BooleanData, NumericData, ObjectData, StringData, ArrayData},
        data : () => ({
            //urusan general
                name : '',
                description : '',
                type : 'String',
                isMoreDisplay : false,
                examples : [''],
                exampleCount : 1,

            //urusan array
                arrayDimension : 0,
                itemType : '',

            //urusan object
                propertyId : 2,
                propertiesId : [1]

            }),
        computed : {
            moreDisplay: function () {
                return (this.isMoreDisplay)?'block':'none'
            },
            dataTypes : function () {
                return [
                    'Object','Array','String','Number','Integer','Boolean',
                ]
            },
            tes : function () {
                return this.$store.getters['project/getDataTypes']
            }
        },
        methods : {
            clickMoreDisplay : function(){
                this.isMoreDisplay = ! this.isMoreDisplay
            },
            selectType : function (value) {
                if(value === 'Array'){
                    this.arrayDimension = 1
                    this.itemType = 'String'
                }
                else{
                    this.arrayDimension = 0
                }
            },
            selectItemType : function (value,i) {
                if(value === 'Array'){
                    this.arrayDimension += 1
                }
                else{
                    this.arrayDimension = i
                    this.itemType = value
                }
            },
            getData : function () {
                let res = this.$refs.curDataType.getAttributes()
                res.name = this.name
                res.description = this.description
                res.example
                if(this.type === 'Object'){
                    res.properties = {}
                    for(let i=0; i <  this.propertiesId.length; i++){
                        let id = this.propertiesId[i]
                        console.log('test : property-'+id)
                        let data = this.$refs['property-'+id][0].getData()
                        res.properties[data.name] = data.attributes
                    }
                }
                else if(this.type === 'Array'){
                    let pointer = res
                    for(let i = 1; i < this.arrayDimension; i++){
                        pointer.items = this.$refs['array-'+i][0].getAttributes()
                        pointer = pointer.items
                    }
                    pointer.items = this.$refs.itemDataType.getAttributes()

                }
                return {
                    name : this.name,
                    attributes : res
                }
            },
            addNewProperty : function() {
                this.propertiesId.push(this.propertyId++)
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
                console.log(this.$refs)
                console.log(this.getData())
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