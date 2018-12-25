/** 
 * @Desc: 右侧菜单组件
 */
<template>
  <div class="menu-item clickable">
    <slot/>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VMenuItem'
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .menu-item
    padding 10px 0
    text-align center
    color #fff
    &:hover
      opacity .7

  @media screen and (max-height 780px) 
    .menu-item
      padding 8px 0
      i 
        font-size 32px!important
</style>

