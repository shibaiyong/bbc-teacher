/** 
 * @Desc: tab组件 教案内容
 */
<template>
  <div class="courseware" ref="courseware">
    <!-- S 课件预览 -->
    <pdf 
      :src="coursewareUrl" 
      :page="+pageIndex +1" 
      @loaded="_pdfLoaded"
      @num-pages="pageCount = $event">
    </pdf>
    <!-- E 课件预览 -->

    <!-- S 翻页 -->
    <page-switch
      v-show="pageCount"
      :disabledPrev="disabledPrev"
      :disabledNext="disabledNext"
      @goPrev="_goPrev"
      @goNext="_goNext"/>
    <!-- E 翻页 -->

    <!-- S 视频点击区域 -->
    <video-click-area
      v-if="this.videoInfo.i"
      :videoInfo="videoInfo"
      :width="coursewareWidth"
      @click.native="_areaButtonClick">
    </video-click-area>
    <!-- E 视频点击区域 -->

    <!-- S 弹窗视频 -->
    <viewer-video 
      :visible.sync="videoVisible"
      :videoObj="videoInfo"
      :videoId ="resId"
      :videoCover="resCover"
      :videoUrl="videoResource">
    </viewer-video>
    <!-- E 弹窗视频 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import Pdf from 'vue-pdf'
  import VideoClickArea from 'base/video-click-area'
  import PageSwitch from 'component/page-switch'
  import ViewerVideo from 'base/viewer-video'
  export default {
    name: 'Courseware',
    components: {
      Pdf,
      VideoClickArea,
      PageSwitch,
      ViewerVideo
    },
    props: {
      coursewareUrl: {
        type: String,
        required: true
      },
      videos: {
        type: Object,
        required: true
      },
      resId: {
        type: [String, Number]
      },
      resCover: {
        type: String
      }
    },
    data: function() {
      return {
        // 页面索引
        pageIndex: null,
        // 页面数量
        pageCount: 0,
        // 翻页器显示 
        pageSwitchVisible: false,
        // 视频显示
        videoVisible: false,
        // 视频信息
        videoInfo: {},
        // 课件宽度
        coursewareWidth: '',
        videoResource: '',
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
       * 监视页面索引，获取视频信息
       */
      pageIndex: function(newValue) {
        if (this.videos[`page${this.pageIndex + 1}`].length) {
          this.videoInfo = {}
          this.videoInfo = this.videos[`page${this.pageIndex + 1}`][0]
        } else {
          this.videoInfo = {}
          this.videoResource = ''
        }
      },

      videoVisible: function(val) {
        if (!val) {
          this.videoResource = ''
        }
      }
    },
    methods: {
      /**
       * pdf加载成功
       */
      _pdfLoaded: function() {
        // console.log('pdf loading SUCCESS:')
      },

      /** 
       * 避免空白页面，由于初始时候加载第二页，所以此时加载第一页来避免空白
      */
      _show: function() {
        this.pageIndex = 1
        setTimeout(() => {
          this.pageIndex = 0
        }, 500)
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
       * 设置视频点击区域 width属性
       */
      _setCoursewareWidth: function() {
        if (this.$refs.courseware) {
          this.coursewareWidth = this.$refs.courseware.clientWidth
        }
      },

      /** 
       * 可点击区域的点击事件
      */
      _areaButtonClick: function() {
        if(this.videoInfo.i) {
          this.videoVisible = true
          this.videoResource = this.videoInfo.i
        }
      }
    },
    mounted: function() {
      this._setCoursewareWidth()
      window.addEventListener('resize', this._setCoursewareWidth)
    },
    activated: function() {
      this._show()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .courseware
    height 100%
    overflow hidden
    position relative
</style>