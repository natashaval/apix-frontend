<template>
    <div class="form-group">
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
                    <b-select class="col-8" @change="selectItemType($event,i)">
                        <option v-for="dataType in dataTypes" v-bind:key="dataType" :value="dataType">{{dataType}}</option>
                    </b-select>
                </div>
            </div>
            <div class="col-6 blue-frame">
                <div class="form-inline">
                    <label class="col-4">Description :</label>
                    <b-input class="col-8" v-model="description"></b-input>
                </div>
                <div class="form-inline">
                    <label class="col-4">Example :</label>
                    <b-input class="col-8" v-model="examples"></b-input>
                </div>
                <a style="float: right;color: #4493e2;cursor: pointer;"
                   class="more-attribute btn-link" @click="clickMoreDisplay">more attributes</a>
                <br/>
                <div v-bind:style="{display: moreDisplay}">
                    <!--more attributes of selected datatype-->
                    <StringData v-if="type === 'String'"/>
                    <ArrayData v-else-if="type === 'Array'"/>
                    <ObjectData v-else-if="type === 'Object'"/>
                    <NumericData v-else-if="type === 'Number'" :numericType="'Number'"/>
                    <NumericData v-else-if="type === 'Integer'" :numericType="'Integer'"/>
                    <BooleanData v-else-if="type === 'Boolean'"/>
                </div>
                <div v-if="itemType !== undefined" v-bind:style="{display: moreDisplay}">
                    <!--more attributes of array-->
                    <StringData v-if="itemType === 'String'"/>
                    <ObjectData v-else-if="itemType === 'Object'"/>
                    <NumericData v-else-if="itemType === 'Number'" :numericType="'Number'"/>
                    <NumericData v-else-if="itemType === 'Integer'" :numericType="'Integer'"/>
                    <BooleanData v-else-if="itemType === 'Boolean'"/>
                </div>
            </div>
        </div>
        <div>
            <!--child object-->
            <DataTypeInput v-if="type === 'Object' || itemType === 'Object'" style="padding-left: 5%"/>
        </div>
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
             name : '',
             description : '',
             type : 'String',
             examples : '',
             childData : Object,
             isMoreDisplay : false,
             arrayDimension : 0,
             itemType : ''

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