<template>
    <div>
        <div>
            <label class="col-4">of*</label>
            <b-select class="col-7" v-model="of">
                <option v-for="dataType in dataTypes" v-bind:key="dataType" :value="dataType">{{dataType}}</option>
            </b-select>
        </div>
        <div>
            <ArrayItem v-if="of === 'Array'" :dataTypes="dataTypes"/>
            <StringData v-if="of === 'String'"/>
            <ObjectData v-else-if="of === 'Object'"/>

        </div>
    </div>
</template>

<script>
    import StringData from "./StringData";
    import ObjectData from "./ObjectData";
    export default {
        name: "ArrayItem",
        components: {ObjectData, StringData},
        props : ['dataTypes'],
        data() {
            return {
                of : null
            }
        },
        computed : {
        }
    }
</script>

<style scoped>

</style>