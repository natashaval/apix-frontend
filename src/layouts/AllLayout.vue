<template>
    <div class="all-layout">
        <h2>All Layout</h2>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "AllLayout",
    }
</script>

<style scoped>
    .all-layout {
        width: 80%;
        margin: auto;
        /*background-color: beige;*/
    }

</style>