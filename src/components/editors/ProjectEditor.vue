<template>
    <div>
        <ul v-if="isEdited">
            <li><button @click="submit">Save</button></li>
            <li><button @click="cancel">Cancel</button></li>
        </ul>
        <div class="form-group">
            <label>Title:</label>
            <input name="title" v-model="title">
        </div>
        <div class="form-group">
            <label>Host:</label>
            <input name="host" v-model="host">
        </div>
        <div class="form-group">
            <label>Base Url:</label>
            <input name="baseUrl" v-model="baseUrl">
        </div>
        <div class="form-group">
            <label>Version:</label>
            <input name="version" v-model="version">
        </div>
        <div class="form-group">
            <label>Description:</label>
            <vue-editor style="height: 100px;" name="description" v-model="description"></vue-editor>
        </div>
    </div>
</template>

<script>
    import ChangeObserverMixin from "@/mixins/ChangeObserverMixin"
    import {VueEditor} from "vue2-editor"
    import ActionBuilder from "@/utils/ActionBuilderUtil";

    export default {
        name: "ProjectEditor",
        components: {VueEditor},
        mixins : [ChangeObserverMixin],
        data : ()=>({
            title : '',
            description : '<p></p>',
            host: '',
            baseUrl: '',
            version: '',
            isEdited : false
        }),
        computed : {
            apiData : function () {
                return this.$store.getters['project/getProjectData']
            },
        },
        methods: {
            setLayout (layout) {
                this.$store.commit('layout/SET_LAYOUT', layout);
            },
            loadData: function () {
                if(this.apiData && this.apiData.info){
                    this.$_changeObserverMixin_unObserve()
                    let p = this.apiData
                    this.title = p.info.title
                    this.description = p.info.description
                    this.host = p.host
                    this.baseUrl = p.basePath
                    this.version = p.info.version
                    this.$_changeObserverMixin_initObserver(['title','description','host','baseUrl','version'])
                }
            },
            submit : function () {
                let infoQuery = ActionBuilder.createActions(this.apiData, this._data, ['title','version','description'])
                
            },
            cancel : function () {

            }
        },
        props : ['projectId'],
        mounted: function () {
            this.$nextTick(function () {
                this.setLayout('single-layout');
            });
            this.loadData()
        }
    }
</script>

<style scoped>

</style>