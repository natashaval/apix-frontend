<template>
    <div class="sidebar-content" @mouseover="onHover=true" @mouseleave="onHover=false" style="height: 2em;">
        <li @click="methodClick" style="padding-left: 4em;font-size: 14px" class="row">

            <div class="col-2" style="margin-top: 0.3em" v-html="operationBadge"></div>
            <span class="shrinkable-text col-8" style="margin-top: 0.35em;margin-left: 0.2em;">
                {{apiData.summary}}</span>
            <button class="btn-circle" style="margin-right: 1em;"
                    :class="onHover ? 'visible': 'invisible' ">
                <i style="font-size: 13px;" class="fas fa-trash"></i>
            </button>
        </li>
    </div>
</template>

<script>
    export default {
        name: "OperationBar",
        props : [
            'apiData','operationApi','pathApi','sectionApi'
        ],
        data : ()=>({
            onHover : false,
        }),
        computed: {
            operationBadge() {
                switch (this.operationApi) {
                    case "get":
                        return '<a class="badge badge-success" style="width: 4.5em;text-align: center">GET</a>'
                    case "head":
                        return '<a class="badge badge-success" style="width: 4.5em;text-align: center">HEAD</a>'
                    case "option":
                        return '<a class="badge badge-success" style="width: 4.5em;text-align: center">OPTION</a>'
                    case "post":
                        return '<a class="badge badge-warning" style="width: 4.5em;text-align: center">POST</a>'
                    case "PATCH":
                        return '<a class="badge badge-warning" style="width: 4.5em;text-align: center">PATCH</a>'
                    case "put":
                        return '<a class="badge badge-info" style="width: 4.5em;text-align: center">PUT</a>'
                    case "delete":
                        return '<a class="badge badge-danger" style="width: 4.5em;text-align: center">DELETE</a>'
                }
                return null
            }
        },
        methods : {
            methodClick : function () {
                this.$router.push({
                    name :'operation-editor',
                    params: {
                        sectionApi : this.sectionApi,
                        pathApi : this.pathApi,
                        operationApi : this.operationApi
                    }
                })
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/app.css";

</style>
