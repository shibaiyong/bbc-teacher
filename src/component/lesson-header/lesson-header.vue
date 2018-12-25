/*
 * @Desc: 课程头部组件
 */
<template>
  <div class="lesson-header">
    <slot/>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'LessonHeader'
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  .lesson-header
    position relative
    height 60px
    line-height 60px           
    padding 0 30px 
    border-top-left-radius 10px
    border-top-right-radius 10px
    color $color-text
    background url(./img/bg.png) no-repeat 
    background-size 100% 100%
</style>

