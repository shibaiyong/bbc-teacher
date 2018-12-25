/** 
 * @Desc: 收藏列表
 */
<template>
  <div class="content-box center">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'LoginContentBox'
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .content-box
    top 45%
    width 540px
    height 450px
    padding 20px
    background-color #fffceb
    border-radius 10px
    box-shadow 0 0 15px 1px rgba(161, 152, 124, .5)  
    text-align center
    color #333
  @media screen and (max-width: 1600px)
    .content-box
      top 40%

</style>
