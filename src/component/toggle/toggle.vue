/** 
 * @Desc: 教案和课件切换（默认、自定义）组件
 */
<template>
  <div class="clickable toggle" :class="flag === 'CUSTOM' ? 'on' : 'off'"></div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VToggle',
    props: {
      flag: {
        type: String,
        default: 'DEFAULT'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .toggle
    width 63px
    height 30px
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    margin auto
    z-index 9
    &.on
      background url(./img/toggle_on.png) no-repeat
    &.off
      background url(./img/toggle_off.png) no-repeat
</style>

