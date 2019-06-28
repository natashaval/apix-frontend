<template>
    <div class="container-fluid">
        <div class="row justify-content-between no-gutters">
            <div class="col-4">
                <div v-html="name"></div>
                <div v-html="description"></div>
                TITLE HERE
            </div>
            <div class="col-4" v-show="isEdited">
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
            isEdited: Boolean
        },
        methods: {
            onSubmit: function(){
                let res = this.submit();
                console.log(res);
            },
            onCancel: function(){
                this.cancel()
            }
        }
    }
</script>

<style scoped>

</style>