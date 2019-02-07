<template>
  <div id="app">
    <SideBar :apiData="apiData"/>
  </div>
</template>

<script>

import SideBar from "./components/sidebar/SideBar";
import BootstrapVue from 'bootstrap-vue'
import Vue from 'vue'

Vue.use(BootstrapVue)
export default {
  name: 'app',
  components: {
    SideBar
  },
  computed : {
    apiData : function () {
      return this.$store.getters['project/get']
    }
  }
  ,created(){
    // id project di mongodb, akan dibikin dinamis nanti
    let id = '5c59712d73b2b75a2cc62ebb'
    this.$store.dispatch('project/fetchProjectData',id)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
