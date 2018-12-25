/** 
 * @Desc: 首页item
 */
<template>
  <div class="home-item">
    <!-- today -->
    <img v-if="type == 'today' && !courseObj.cover" src="./img/today.png">
    <img v-if="type == 'today' && courseObj.cover" :src="courseObj.cover">
    <!-- next -->
    <img v-if="type == 'next' && !courseObj.cover" src="./img/next.png">
    <img v-if="type == 'next' && courseObj.cover" :src="courseObj.cover">

    <div class="title-name" v-if="courseObj.courseName" v-text="courseObj.courseName ? courseObj.courseName : '' "></div>
    <div class="title-btn" v-if="courseObj.courseName" @mouseenter.stop="iconVisible = true" @mouseleave.stop="iconVisible = false">
      <div class="title-shadow-bg" v-if="iconVisible"></div>
      <!-- @mouseenter="iconVisible = true" @mouseleave="iconVisible = false" -->
      <!-- 上课 -->
      <!-- :to="{path: '/attend-class', query: {courseId: courseObj.courseId}}" -->
      <div v-if="iconVisible" class="btn-left btn-btns" @click.stop="_goAttendClick(courseObj.courseId)">
        <v-icon class="icon" type="icon-attend-class" size="40" color="#ffffff"/>
        <span class="icon-text">开始上课</span>
      </div>

      <!-- 备课 -->
       <!-- v-if="iconVisible" -->
       <!-- :to="{path: '/prepare-lesson', query: {courseId: courseObj.courseId}}" -->
      <div v-if="iconVisible" class="btn-right btn-btns" @click.stop="_goPrepareClick(courseObj.courseId)">
        <v-icon class="icon" type="icon-go-prepare-lesson" size="40" color="#ffffff"/>
        <span class="icon-text">前去备课</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { sessionStorageUtil } from 'lib/util'

  export default {
    name: 'home-item',
    props: {
      courseObj:{
        type: Object
      },
      type: {
        type: String
      }
    },
    data: function() {
      return {
        iconVisible: false
      }
    },
    methods: {
      /** 
       * 跳转到上课页点击
      */
      _goAttendClick: function(id) {
        sessionStorageUtil.set("courseId", id)
        this.$router.push('/attend-class')
      },

      /** 
       * 跳转到上课页点击
      */
      _goPrepareClick: function(id) {
        sessionStorageUtil.set("courseId", id)
        this.$router.push('/prepare-lesson')
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  @import '~style/mixin'

  .home-item
    position relative
    width 360px
    height 203px
    margin 20px auto
    border-radius 10px
    box-shadow 0 -2px 1px #c28450 , 0 2px 1px #d8916f
    // &:hover
    //   .title-btn
    //     height 100%
    //     display block  
    img
      width 100%
      height 100%
      border-radius 10px

    /* 课程名称 */
    .title-name
      position absolute
      left 0
      right 0
      bottom 0
      display block
      height 40px
      line-height 40px
      padding-left 23px
      font-size 18px
      color white
      background-color rgba(40,46,20,.7)
      border 1px solid rgba(40,46,20,0.7)
      border-radius 0 0 10px 10px

    /* 按钮区域 */  
    // .title-btn
    //    &:hover
    //     .btn-btns
    //       display inline-block
          // height 95px

    .title-btn
      // display none
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index 9
      text-align center
      border 1px solid rgba(40,46,20,0.7)
      border-radius 10px
      .title-shadow-bg
        position absolute
        width 100%
        height 100%
        background-color rgba(40,46,20,.7)
      .btn-left
        background-color #ff8477
      .btn-right
        background-color #ffb15e
      .btn-left, .btn-right
        display inline-block
        position relative
        width 95px
        height 95px
        border-radius 50%
        margin 50px 10px 0
        z-index 99
        cursor pointer
        .icon-text
          display block
          height 25px
          line-height 25px
          font-size 11px
          color white 
        .icon
          margin 15px auto 0

  @media screen and (max-width: 1600px)      
    .home-item
      width 280px
      height 158px
      margin 10px auto
      .title-btn
        .btn-left, .btn-right
          width 80px
          height 80px
          margin 30px 10px 0
          .icon
            font-size 23px !important
          .icon-text
            height 20px
            line-height 20px  

</style>
