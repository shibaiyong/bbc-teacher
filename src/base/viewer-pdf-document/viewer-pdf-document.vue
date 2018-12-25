/*
 * @Desc: pdf全屏预览组件
 */
<template>
  <div 
    class="viewer-pdf-document" 
    ref="viewerPdfDocument" 
    v-show="visible">
    <!-- S 文档 -->
    <embed 
      type="application/pdf" 
      width="100%" 
      height="100%" 
      :src="pdfUrl">
    </embed> 
    <!-- E 文档 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { enterFullScreen, exitFullScreen, isFullscreen } from 'lib/util'
  export default {
    name: 'ViewerPdfDocument',
    props: {
      // pdf链接
      pdfUrl: {
        type: String,
        required: true
      },
    },
    data: function() {
      return {
        // 控制组件显示状态
        visible: false
      }
    },
    methods: {
      /**
       * 显示组件
       */
      _show: function() {
        // 当前不是全屏才通过requestFullScreen开启全屏
        !isFullscreen() && enterFullScreen(this.$refs.viewerPdfDocument)
        
        // 绑定事件 
        this._bindEvent()
        this.visible = true
      },

      /**
       * 隐藏组件
       */
      _hide: function() {
        // 退出全屏、解绑事件
        exitFullScreen()
        this._removeEvent()
        this.visible = false
      },

      /**
       * 绑定keydown、resize事件
       */
      _bindEvent: function() {
        window.addEventListener('resize', this._resizeEvent)
      },

      /**
       * 解绑keydown、resize事件
       */
      _removeEvent: function() {
        window.removeEventListener('resize', this._resizeEvent)
      },

      /**
       * resize事件（通过requestFullScreen开启的全屏，按esc默认退出全屏，会触发resize事件）
       */
      _resizeEvent: function() {
        // 当前不是全屏，才隐藏组件
        if (!isFullscreen()) {
          this._hide()
        } 
      },
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .viewer-pdf-document
    position fixed
    top 0 
    right 0
    bottom 0
    left 0
    z-index 999
</style>