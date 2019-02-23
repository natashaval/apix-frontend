<template>
    <div>
        <BodyForm :bodyData="operationData.requestBody"
                  :projectId="projectId"/>
    </div>
</template>

<script>
    import BodyForm from "./BodyForm";
    export default {
        name: "RequestComponent",
        components: {BodyForm},
        props : ['operationData','projectId']
    }
</script>

<style scoped>

</style>