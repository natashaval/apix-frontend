<template>
    <div class="modal-content">
        <b-form-group class="form-row mb-2 w-100"
                      :state="definitionState.length === 0" :invalid-feedback="definitionState[0]"
                      label="name * :"
                      label-cols="3">
        <b-input :state="definitionState.length === 0"
                 name="extract-data-name" type="text" v-model="modelName" class="form-control"></b-input>
        </b-form-group>

        <button class="mt-3 btn btn-success" @click="extractModel">extract</button>
    </div>
</template>

<script>
    import DeepTreeBuilderUtil from "@/utils/DeepTreeBuilderUtil";
    import uuidv4 from 'uuid/v4';
    import Vue from 'vue'
    import * as axios from "axios"
    import {BASE_PROJECT_URL} from "@/stores/actions/const";

    export default {
        name: "ExtractDataTypeModal",
        props : {
            initName : String,
            schemaData : {
                type : Object,
                required : true
            }
        },
        data : ()=>({
            modelName : ''
        }),
        computed : {
            definitionState : function () {
                if(this.modelName){
                    let definitions = this.$store.getters['project/getDefinitions']
                    for(let key in definitions){
                        if(definitions.hasOwnProperty(key) && definitions[key].name === this.modelName){
                            return ['Model name must be unique']
                        }
                    }
                    return []
                }
                return ['name can\'t be empty']
            }
        },
        methods : {
            extractModel : function () {
                let callbacks = []
                let tree = DeepTreeBuilderUtil.buildDeepTree(['definitions'])
                let projectData = this.$store.getters['project/getProjectData']
                tree.root._signature = projectData._signature

                let modelUid = uuidv4()
                let modelRef ='#/definitions/'+modelUid
                let schemaData = this.schemaData
                let futureDefData = {
                    name : this.modelName,
                    description : '',
                    schema : Object.assign({},schemaData)
                }
                callbacks.push(()=>{
                    Vue.set(projectData.definitions, modelUid, futureDefData)
                })

                tree.leaf._actions = [{
                    action : 'put',
                    key : modelUid,
                    value : futureDefData
                }]
                tree.leaf._hasActions = true
                let projectId = this.$route.params.projectId
                console.log(tree.root)
                axios.put(BASE_PROJECT_URL+'/'+projectId,tree.root).then(
                    (response) => {
                        if(response.status === 200){
                            projectData._signature = response.data.new_signature
                            callbacks.forEach(fn => fn())
                            this.$emit('extractComplete',modelRef)
                        }
                    }
                ).catch(error => {
                    console.error(error)
                    this.$bvToast.toast(error.response.data.message + ' , Please refresh the page.', {
                        title: 'Failed',
                        variant: 'danger'
                    })
                })



            }
        },
        watch : {
            initName : function () {
                this.modelName = this.initName
            }
        },
        mounted() {
            this.modelName = this.initName
        }
    }
</script>

<style scoped>
</style>
