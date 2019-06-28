<template>
    <div>
        <li @click="methodClick" class="px-4">
            <div v-html="operationBadge"></div>
        </li>
    </div>
</template>

<script>
    export default {
        name: "OperationBar",
        props : [
            'apiData','operationApi','pathApi','sectionApi'
        ],
        computed: {
          operationBadge() {
              switch (this.operationApi) {
                  case "get":
                      return '<a class="badge badge-success">GET</a>'
                  case "post":
                      return '<a class="badge badge-warning">POST</a>'
                  case "put":
                      return '<a class="badge badge-info">PUT</a>'
                  case "delete":
                      return '<a class="badge badge-danger">DELETE</a>'
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

</style>
