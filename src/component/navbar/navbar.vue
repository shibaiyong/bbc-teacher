/** 
 * @Desc: 左侧导航组件
 */
<template>
  <div class="navbar">
    <ul class="nav-list">
      <router-link 
        tag="li" 
        class="nav-item clickable" 
        :to="navItem.to" 
        v-for="(navItem, index) in navList" 
        :key="index">
        <v-icon :type="navItem.icon"/>
        <span class="title">{{ navItem.title }}</span>
      </router-link>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VNavbar',
    props: {
      navList: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  .navbar
    position absolute
    top 250px
    left 68px
    font-family $font-happy-zcool
    font-size $font-size-large-x
    color $color-text-g
    .nav-list
      .nav-item
        width 220px
        height 60px
        line-height 60px
        text-align center
        margin-bottom 22px
        &:hover
          opacity .7
        .icon
          font-size 40px
          position relative
          top 8px
        .title
          margin-left -8px
          letter-spacing -1px

  @media screen and (max-width: 1600px)
    .navbar
      top 180px
      left 50px
      font-size 22px
      .nav-list
        .nav-item
          width 160px
          height 46px
          line-height 46px
          text-align center
          margin-bottom 12px
          i  
            font-size 30px!important
            vertical-align top
</style>

