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
        name: "DefaultLayout",
        components: {MenuBar},
    }
</script>

<style scoped>
    .all-layout {
        width: 95%;
        margin: auto;
    }

</style>