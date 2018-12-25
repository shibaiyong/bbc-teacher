  /** 
 * @Desc: 视频项组件
 */
<template>
  <li class="video-item" :style="style">
    <!-- S 封面 -->
    <div 
      class="video-cover-wrapper" 
      @mouseover="playMaskVisible = true"
      @mouseout="playMaskVisible = false">
      <img class="video-cover" :src="cover" :alt="title">
      <span class="video-duration" v-show="!playMaskVisible"></span>
      <div 
        class="video-play-mask clickable" 
        v-show="playMaskVisible" 
        @click="$emit('showVideo')">
        <v-icon 
          type="icon-player" 
          color="#ffffff"
          :size="40"
          class="icon-player">
        </v-icon>
      </div>
    </div>
    <!-- E 封面 -->

    <!-- S 标题 -->
    <div class="video-title-wrapper">
      <i class="clickable video-icon">
        <slot name="icon"></slot>
      </i>
      <p class="video-title">
        <span class="clickable content" @click="$emit('showVideo')">
          {{ title }}
        </span>
      </p>
    </div>
    <!-- E 标题 -->
  </li>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VideoItem',
    props: {
      width: {
        type: Number,
        default: 188
      },
      height: {
        type: Number,
        default: 140
      },
      cover: {
        type: String
      },
      title: {
        type: String
      },
      resourceUrl: {
        type: String
      }
    },
    computed: {
      style: function() {
        let style = {}
        style.width = `${this.width}px`
        style.height = `${this.height}px`
        return style
      }
    },
    data: function() {
      return {
        playMaskVisible: false
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/mixin'
  .video-item
    position relative
    float left
    margin 22px 0 0 26px
    font-size 12px
    border-radius 5px
    background-color rgb(255, 249, 221)
    box-shadow 0px 1px 3px 0px rgba(0, 0, 0, 0.15), inset 0px 0px 3px 0px rgba(0, 0, 0, 0.4)
    .video-cover-wrapper
      position absolute
      top 0
      right 0
      bottom 34px
      left 0
      .video-cover
        width 100%
        height 100%
        border-top-left-radius 5px
        border-top-right-radius 5px
      .video-duration
        position absolute
        right 8px
        bottom 5px
        color #ffffff
      .video-play-mask
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        border-top-left-radius 5px
        border-top-right-radius 5px
        background-color rgba(0, 0, 0, .6)
        .icon-player
          position relative
          margin-top 40px
          margin-left 70px
          // top 50%
          // left 50%
          // transform translate(-50%, -50%)
        .icon-download
          position absolute
          right 12px
          bottom 10px
    .video-title-wrapper
      position absolute
      right 0
      bottom 0
      left 0
      height 34px
      line-height 34px
      padding 0 5px 0 10px
      color #a9a281
      .video-icon
        float right 
        padding 0 6px
      .video-title
        font-weight bold
        no-wrap()
        .content:hover
          color #817C67
</style>

