/** 
 * @Desc: 课件视频点击区域
 */
<template>
  <div 
    v-if="videoInfo.i"
    class="video-click-area clickable" 
    :style="videoAreaStyle">
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VideoClickArea',
    props: {
      // 视频信息
      videoInfo: {
        type: Object,
        required: true
      },
      // 元素宽度
      width: {
        type: [String, Number]
      }
    },
    computed: {
      videoAreaStyle: function() {
        let style = {}
        const height = this.width / 16 * 9
        style.top = this.videoInfo.t / 540 * height + 'px'
        style.left = this.videoInfo.l / 960 * this.width + 'px'
        style.width = this.videoInfo.w / 960 * this.width + 'px'
        style.height = this.videoInfo.h / 540 * height + 'px'
        return style
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .video-click-area
    position absolute
</style>
