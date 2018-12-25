/*
 * @Desc: pdf全屏预览组件
 */
<template>
  <div class="viewer-pdf" ref="viewerPdf" v-show="visible">
    <!-- S pdf预览 -->
    <pdf 
      :src="pdfUrl" 
      :page="pageIndex + 1" 
      @num-pages="pageCount = $event"
      @loaded="_pdfLoaded"
      @error="_error">
    </pdf>
    <!-- E pdf预览 -->
    
    <!-- S 视频点击区域 -->
    <video-click-area
      :width="screenWidth"
      :videoInfo="videoInfo"
      @click.native="_areaButtonClick">
    </video-click-area>
    <!-- E 视频点击区域 -->

    <!-- S 弹窗视频 -->
    <viewer-video 
      ref="viewerVideo" 
      :visible.sync="videoVisible"
      :videoObj="videoInfo"
      :videoId ="this.id"
      :videoCover="this.cover"
      :nofullscreenFlag="true"
      :belongAttend="true" 
      :videoUrl="videoResource">
    </viewer-video>
    <!-- E 弹窗视频 -->

    <!-- 控制按钮区域 -->
    <page-switch
      v-show="pageCount"
      :disabledPrev="disabledPrev"
      :disabledNext="disabledNext"
      :exitVisible="true"
      :rightValue="40"
      :bottomValue ="24"
      @goPrev="_goPrev"
      @goNext="_goNext"
      @goExit="_goExit"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import Pdf from 'vue-pdf'
  import ViewerVideo from 'base/viewer-video'
  import VideoClickArea from 'base/video-click-area'
  import PageSwitch from 'component/page-switch'
  import { enterFullScreen, exitFullScreen, isFullscreen } from 'lib/util'

  export default {
    name: 'ViewerPdf',
    components: {
      Pdf,
      ViewerVideo,
      VideoClickArea,
      PageSwitch
    },
    props: {
      // pdf链接
      pdfUrl: {
        type: String,
        required: true
      },
      // 页面视频
      videos: {
        type: Object
      },
      id: {
        type: [String, Number]
      },
      cover: {
        type: String
      }
    },
    data: function() {
      return {
        // 控制组件显示状态
        visible: false,
        // 控制视频显示状态
        videoVisible: false,
        // 总页数
        pageCount: 0,
        // 当前页面索引
        pageIndex: 0,
        // 当前播放视频url
        videoInfo: {},
        videoResource: '',
        // 屏幕宽度
        screenWidth: document.body.clientWidth,

        // 退出按钮的点击标识
        clickFlag: false
      }
    },
    watch: {
      /**
       * 监视页面索引，获取视频信息
       */
      pageIndex: function(newValue) {
        if (this.videos && this.videos[`page${this.pageIndex + 1}`].length) {
          this.videoInfo = this.videos[`page${this.pageIndex + 1}`][0]
        }
        else {
          this.videoInfo = {}
        }
      },

      videoVisible: function(val) {
        if (!val) {
          this.videoResource = ''
        }
      },

      /** 
       * 监听是否显示，解决esc按键的BUG
      */
      visible: function(oldValue, newValue) {
        if (oldValue === false && newValue === true && !this.clickFlag) {
          location.reload()
        }
      }
    },
    computed: {
      // 禁用上一页
      disabledPrev: function() {
        return this.pageIndex > 0 ? false : true
      },
      // 禁用下一页
      disabledNext: function() {
        return this.pageIndex < this.pageCount - 1 ? false : true
      }
    },
    methods: {
      /** 
       * 初始化点击状态
      */
      _initFlag: function() {
        this.clickFlag = false
      },

      /**
       * 显示组件
       */
      _show: function() {
        console.error('enterfullscreen')
        // 当前不是全屏才通过requestFullScreen开启全屏
        !isFullscreen() && enterFullScreen(this.$refs.viewerPdf)
        // 绑定事件 
        this._bindEvent()
        this._initFlag()
        // 避免空白页面，切换到另一个页面再切回去
        this.pageIndex = 1
        setTimeout(() => {
          this.visible = true
          this.pageIndex = 0
        }, 400)
      },

      /**
       * 隐藏组件
       */
      _hide: function() {
        // 退出全屏、解绑事件
        exitFullScreen()
        this._removeEvent()
        this.visible = false
        this.videoVisible = this.videoVisible && false
      },

      /** 
       * 可点击区域的点击事件
      */
      _areaButtonClick: function() {
        if(this.videoInfo.i) {
          this.videoVisible = true
          this.videoResource = this.videoInfo.i
        }
      },

      /**
       * pdf加载成功
       */
      _pdfLoaded: function() {
        console.log('pdf loading SUCCESS')
      },
      
      /**
       * pdf加载出错
       * @param  {string} err: 错误信息
       */
      _error: function(err) {
        console.log('pdf loading FAIL')
      },

      /**
       * 绑定keydown、resize事件
       */
      _bindEvent: function() {
        window.addEventListener('keydown', this._keydownEvent)
        window.addEventListener('resize', this._resizeEvent)
      },

      /**
       * 解绑keydown、resize事件
       */
      _removeEvent: function() {
        window.removeEventListener('keydown', this._keydownEvent)
        window.removeEventListener('resize', this._resizeEvent)
      },

      /**
       * resize事件（通过requestFullScreen开启的全屏，按esc默认退出全屏，会触发resize事件）
       */
      _resizeEvent: function() {
        // 当前不是全屏，才隐藏组件
        // this._hide()
        if (!isFullscreen()) {
          this._hide()
        } 
      },

      /**
       * 键盘事件
       */
      _keydownEvent: function(ev) {
        this.videoVisible = this.videoVisible && false
        ev = ev || event
        // 上一张
        if (ev.keyCode === 37) {
          this.pageIndex > 0 && this.pageIndex--
        }
        // 下一张
        if (ev.keyCode == 39) {
          this.pageIndex < this.pageCount - 1 && this.pageIndex++
        }
        // 退出全屏，隐藏组件（f11开启的全屏能检测到esc键）
        if (ev.keyCode === 27) {
          this._goExit()
        }
      },

      /** 
       * 上一页
      */
      _goPrev: function() {
        this.pageIndex > 0 && this.pageIndex--
      },

      /** 
       * 下一页
      */
      _goNext: function() {
        this.pageIndex < this.pageCount - 1 && this.pageIndex++
      },

      /** 
       * 退出
      */
      _goExit: function() {
        // 当前不是全屏，才隐藏组件
        console.error('exitfullscreen')
        this.clickFlag = true
        this._hide()
        this.$emit('exitfullEvent', true)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .viewer-pdf
    position absolute
    top 0 
    right 0
    bottom 0
    left 0
    z-index 9999
</style>
