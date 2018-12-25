/*
 * @Desc: 图片全屏预览组件（考虑到后期添加控制按钮、扩展，没有和viewer合并）
 */
<template>
  <div class="viewer-image" ref="viewerImage" v-show="visible">
    <img class="img" :src="imgList[pageIndex]" alt="">

    <!-- 控制按钮区域 -->
    <page-switch
      v-show="imgList.length"
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
  import { enterFullScreen, exitFullScreen, isFullscreen } from 'lib/util'
  import PageSwitch from 'component/page-switch'

  export default {
    name: 'ViewerImage',
    components: {
      PageSwitch
    },
    props: {
      // 图片集
      imgList: {
        type: Array,
        required: true
      }
    },
    data: function() {
      return {
        // 控制组件显示状态
        visible: false,
        // 当前页面索引
        pageIndex: 0,
        clickFlag: false
        
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
    watch: {
      /** 
       * 监听是否显示，解决esc按键的BUG
      */
      visible: function(oldValue, newValue) {
        if (oldValue === false && newValue === true && !this.clickFlag) {
          location.reload()
        }
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
        // 进入全屏、绑定事件 
        if (!isFullscreen()) {
          // 当前不是全屏才通过requestFullScreen开启全屏
          enterFullScreen(this.$refs.viewerImage)
        }
        this._bindEvent()
        this._initFlag()
        setTimeout(() => {
          this.visible = true
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
        if (!isFullscreen()) {
          this._hide()
        }
      },

      /**
       * 键盘事件
       */
      _keydownEvent: function(ev) {
        ev = ev || event
        // 上一张
        if (ev.keyCode === 37) {
          this.pageIndex > 0 && this.pageIndex--
        }
        // 下一张
        if (ev.keyCode == 39) {
          this.pageIndex < this.imgList.length - 1 && this.pageIndex++
        }
        // 退出全屏，隐藏组件（f11开启的全屏能检测到esc键）
        if (ev.keyCode == 27) {
          this._hide()
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
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .viewer-image
    position fixed
    top 0 
    right 0
    bottom 0
    left 0
    z-index 999
    .img 
      width 100%
      height 100%
</style>