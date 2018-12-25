/** 
 * @Desc: 轻松备课页面
 */
<template>
  <div class="prepare-lesson">
    <v-header></v-header>
    <v-navbar :navList="navList"></v-navbar>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import VNavbar from 'component/navbar'
  export default {
    name: 'PrepareLesson',
    components:{
      VNavbar
    },
    data: function() {
      return {
        // nav
        navList: [
          {
            title: '在线备课',
            icon: 'icon-prepare-lesson-online',
            to: '/prepare-lesson/prepare-lesson-online'
          },
          {
            title: '备课云盘',
            icon: 'icon-prepare-lesson-disk',
            to: '/prepare-lesson/prepare-lesson-disk'
          },
          {
            title: '素材库',
            icon: 'icon-material-library',
            to: '/prepare-lesson/material-library'
          }
        ],
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .prepare-lesson
    height 100%
    background url(../../image/navbar-bg1.png) no-repeat 0 top, url(../../image/bottom-bg2.png) no-repeat 0 bottom

  @media screen and (max-width: 1600px)
    .prepare-lesson
      background url(../../image/navbar-bg2.png) no-repeat 0 top, url(../../image/bottom-grassland.png) no-repeat 0 bottom
</style>

