/** 
 * @Desc: 班级管理页面
 */
<template>
  <div class="class-manage">
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'ClassManage'
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .class-manage
    height 100%
    background url(../../image/top-bg1.png) no-repeat 0 top, url(../../image/bottom-bg2.png) no-repeat 0 bottom
    
  @media screen and (max-width: 1600px)
    .class-manage
      background url(../../image/bottom-grassland.png) no-repeat 0 bottom, url(../../image/top-bg2.png) no-repeat 0 top 
</style>