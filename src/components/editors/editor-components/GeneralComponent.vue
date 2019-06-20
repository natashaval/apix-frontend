<template>
    <!--to display name and description (required in section / path)-->
    <div>
        <h4>External Docs </h4>
        {{externalDocs}}
        <!--<InputEditor :apiData="apiData.externalDocs.url" :apiTitle="`url`" :isEditing="isEditing"></InputEditor>-->
        <!--<TextDocInput id="externaldocs-description" :apiData="apiData.externalDocs.description" :apiTitle="`Description`" :isEditing="isEditing"/>-->
        Name: <input type="text" v-model="name" />
        Email: <input type="text" v-model="email" />
        Url: <input type="text" v-model="url" />
        <vue-editor v-model="description"></vue-editor>

    </div>
</template>

<script>
    import { VueEditor } from 'vue2-editor'
    import ActionBuilderUtil from "../../../utils/ActionBuilderUtil";
    // import ActionExecutorUtil from "../../../utils/ActionExecutorUtil";
    import ChangeObserverMixin from "../../../mixins/ChangeObserverMixin";

    export default {
        name: "GeneralComponent",
        props: ['externalDocs'],
        components: {VueEditor},
        mixins: [ChangeObserverMixin],
        data: () => ({
            name: '',
            email: '',
            url: '',
            description: '',
            attributesKey: [{key : 'name'},{key : 'email'}, {key : 'url'},{key : 'description'}],

        }),
        methods: {
            loadData: function(){
                this.$_changeObserverMixin_unObserve()
                this.name = this.externalDocs.name
                this.email = this.externalDocs.email
                this.url = this.externalDocs.url
                this.description = this.externalDocs.description

                this.$_changeObserverMixin_initObserver(['name','email', 'url', 'description'])
            },
            buildQuery: function () {
                console.log('External docs build query')
                this.exActions = this.getActions()
                return this.exActions
            },
            getData: function () {
               let res = {}
               res.name = this.name
                res.email = this.email
                res.url = this.url
                res.description = this.description
                return res
            },
            getActions: function(){
                return ActionBuilderUtil.createActions(this.externalDocs,this._data,this.attributesKey)
            },
        },
        created() {
          this.loadData()
        },
        watch: {
            $route: function () {
                this.loadData();
            },
            externalDocs: function () {
                this.loadData();
            }
        },
        mounted() {
            this.loadData()
        }


    }
</script>

<style scoped>

</style>