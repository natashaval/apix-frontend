<template>
    <div>
        <BodyForm :bodyData="operationData.body"/>
    </div>
</template>

<script>
    import BodyForm from "./BodyForm";
    export default {
        name: "RequestComponent",
        components: {BodyForm},
        props : ['operationData']
    }
</script>

<style scoped>

</style>