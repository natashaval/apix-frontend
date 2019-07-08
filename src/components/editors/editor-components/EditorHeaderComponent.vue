<template>
    <div class="sticky-top">
        <div class="row justify-content-between no-gutters border rounded bg-white shadow-sm p-1 mb-3">
            <div class="col-8">
                <div v-html="name"></div>
                <div v-html="description"></div>
            </div>
            <div v-if="editable" class="col-4" v-show="isEdited">
                <button class="btn btn-secondary float-right" @click="onCancel">Cancel</button>
                <button class="btn btn-primary float-right mx-2" @click="onSubmit">Save</button>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "SaveComponent",
        props: {
            submit: {
                type: Function,
                required: true
            },
            cancel: {
                type: Function,
                required: true
            },
            name: String,
            description: String,
            isEdited: Boolean,
            editable: Boolean
        },
        methods: {
            onSubmit: function(){
                let res = this.submit()
            },
            onCancel: function(){
                this.cancel()
            }
        }
    }
</script>

<style scoped>

</style>
