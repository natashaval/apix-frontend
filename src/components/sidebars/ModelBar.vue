<template>
    <div>
<!--        <li @click="definitionClick" @mouseover="hover = true" @mouseleave="hover = false"-->
<!--            :class="{'bg-secondary': hover, 'font-weight-bolder': hover}"-->
<!--            class="px-3"-->
<!--        >-->
<!--            {{definitionApi}}</li>-->
        <router-link :to="{name: 'definition-editor', params: {definitionApi: this.definitionApi} }" tag="li"
                     class="text-white font-weight-light px-3"
        >
            {{definitionApi}}</router-link>

<!--        <b-list-group>-->
<!--            <b-list-group-item @click="definitionClick"></b-list-group-item>-->
<!--        </b-list-group>-->
    </div>
</template>

<script>
    export default {
        name: "ModelBar",
        props: ['apiData','definitionApi', 'definitions'],
        data: function(){
          return {
              hover: false,
              // isClick: false
          }
        },
        methods: {
            definitionClick: function(){
                // this.isClick = !this.isClick
                // this.hover = true
                this.$router.push({
                    name: 'definition-editor',
                    params: {definitionApi: this.definitionApi }
                })
            },

            hoverClick: function(){
                if(this.isClick) this.hover = true
                else this.hover = false
            }
        }
    }
</script>

<style scoped>
li {
    list-style-type: none;
}

/*https://stackoverflow.com/questions/46083220/how-to-vuejs-router-link-active-style*/

li.router-link-exact-active {
    background-color: #17a2b8;
}

li:hover {
    background-color: #17a2b8;
    opacity: 1;
    color: white;
    cursor: pointer;
}
</style>
