<template>
  <div class="v-progress">
    <div class="v-progress-wrapper">
      <div class="v-progress-outer" :style="{'width': width + 'px'}">
        <div class="v-progress-inner" :style="{'width': width * (percent / 100) + 'px'}"></div>
      </div>
    </div>
    <span class="v-progress-percent">{{ percent }}%</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VProgress',
    props: {
       width: {
         type: [String, Number],
         default: 100
       },
       percent: {
         type: Number,
         default: 0
       }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .v-progress
    display inline-block
    .v-progress-wrapper
      display inline-block
      margin-right 8px
      .v-progress-outer
        height 7px
        padding 1px
        border-radius 3px
        background-color rgb(237, 229, 197)
        box-shadow 0px 1px 1px 0px rgba(255, 255, 255, 0.64),inset 0px 1px 1px 0px rgba(155, 151, 122, 0.5)
        .v-progress-inner
          border-radius 2px
          height 5px
          background #00b466
</style>

