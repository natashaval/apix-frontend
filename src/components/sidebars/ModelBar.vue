<template>
    <div>
        <li @click="definitionClick" @mouseover="hover = true" @mouseleave="hover = false"
            :class="{'bg-secondary': hover, 'font-weight-bolder': hover}">
            {{definitionApi}}</li>
    </div>
</template>

<script>
    export default {
        name: "ModelBar",
        props: ['apiData','definitionApi'],
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
.hover {
    color: green;
}
</style>