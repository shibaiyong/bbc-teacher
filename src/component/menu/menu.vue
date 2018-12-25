/** 
 * @Desc: 右侧菜单组件
 */
<template>
  <div class="right-menu">
    <div class="menu-list">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VMenu',
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  .right-menu
    position absolute
    top 0
    right -130px
    width 80px
    box-sizing content-box
    padding 10px 0
    border-radius 10px
    box-shadow 0px 0px 10px 0px rgba(0, 0, 0, 0.3), inset 0px 0px 5px 0px rgba(0, 0, 0, 0.15)
    background linear-gradient(to bottom, $color-theme-sub, $color-theme) 

  @media screen and (max-width 1500px) 
    .right-menu
      right -100px
      width 66px
      padding 3px 0
</style>

