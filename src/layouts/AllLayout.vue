<template>
    <div class="all-layout">
        <h2>All Layout</h2>
        <MenuBar class="m-4"></MenuBar>
        <router-view></router-view>
    </div>
</template>

<script>
    import MenuBar from "./MenuBar";
    export default {
        name: "AllLayout",
        components: {MenuBar},
    }
</script>

<style scoped>
    .all-layout {
        width: 95%;
        margin: auto;
        /*background-color: beige;*/
    }

</style>