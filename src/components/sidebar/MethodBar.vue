<template>
    <div>
        <li>{{methodName}}</li>
    </div>
</template>

<script>
    export default {
        name: "MethodBar",
        props : [
            'methodName','apiData'
        ]
    }
</script>

<style scoped>

</style>