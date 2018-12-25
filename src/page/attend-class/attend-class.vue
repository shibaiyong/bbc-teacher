/** 
 * @Desc: 开心上课页面
 */
<template>
  <div class="attend-class">
    <v-header></v-header>
    <content-box>
      <!-- <v-loading v-show="loadingVisible"></v-loading> -->
      <!-- S 头部 -->
      <lesson-header>
        <span v-if="curCourse.courseId">
          {{ curCourse.courseDate | dateZh }} 
          第{{ curCourse.courseOrder }}节 
          <span style="margin-left:8px;">{{ curCourse.courseName }}</span>
        </span>
        <span v-else>当前没有课程</span>
      </lesson-header>
      <!-- E 头部 -->

      <!-- S 右侧菜单 -->
      <v-menu>
        <v-menu-item @click.native="courseTable.courseTableVisible = true">
          <v-icon type="icon-course-table" size="40"/>
          <p class="menu-item-title">课程表</p>
        </v-menu-item>
        <v-menu-item @click.native="_manualClick" v-if="courseResource.manual.length">
          <v-icon type="icon-manual" size="40"/>
          <p class="menu-item-title">手册</p>
        </v-menu-item>
        <v-menu-item @click.native="_materialPackageClick" v-if="courseResource.materialPackage.length">
          <v-icon type="icon-material-package" size="40"/>
          <p class="menu-item-title">材料包</p>
        </v-menu-item>
        <v-menu-item @click.native="_showCourseware" v-if="courseResource.courseware">
          <v-icon type="icon-attend-class" size="40"/>
          <p class="menu-item-title">上课啦</p>
        </v-menu-item>
      </v-menu>
      <!-- E 右侧菜单 -->

      <!-- S 播放器 -->
      <div class="player-wrapper" v-show="defaultVideo === ''">
        <img v-show="defaultVideo === ''" :src="cover" class="fill">
      </div>
      <!-- H5 -->
      <div id="videoDivBox" class="player-wrapper" v-show="defaultVideo != ''"></div>
      <!-- E 播放器 -->

      <!-- S 课程表 -->
      <full-calendar 
        :visible.sync="courseTable.courseTableVisible" 
        :year="courseTable.year"
        :month="courseTable.month"
        @prevMonth="_prevMonth"
        @nextMonth="_nextMonth"
        @courseClick="_calendarCourseClick"/>
      </full-calendar>
      <!-- E 课程表 -->

      <!-- S 手册 -->
      <viewer-image ref="manual" :imgList="courseResource.manual" @exitfullEvent="_setInitVideo"></viewer-image>
      <!-- E 手册 -->

      <!-- S 材料包 -->
      <viewer-image ref="materialPackage" :imgList="courseResource.materialPackage" @exitfullEvent="_setInitVideo"></viewer-image>
      <!-- E 材料包 -->

      <!-- S 课件 -->
      <viewer-pdf 
        ref="courseware" 
        :pdfUrl="courseResource.courseware"
        :id="resId"
        :cover="resCover"
        :videos="courseResource.coursewareVideos"
        @exitfullEvent="_setInitVideo">
      </viewer-pdf>
      <!-- E 课件 -->
    </content-box>
  </div>
</template>

<script type="text/ecmascript-6">
  import VMenu from 'component/menu'
  import VMenuItem from 'component/menu-item'
  import ContentBox from 'component/content-box'
  import ViewerPdf from 'base/viewer-pdf'
  import ViewerImage from 'base/viewer-image'
  import FullCalendar from 'component/full-calendar'
  import LessonHeader from 'component/lesson-header'
  import { playerFileName } from 'config/config'
  import { requestGetDefaultCourse, requestGetCourseResource } from 'api/attend-class'
  import { sessionStorageUtil } from 'lib/util'
  import cookie from 'js-cookie'
  import moment from 'moment'

  export default {
    name: 'AttendClass',
    components: {
      VMenu,
      VMenuItem,
      ContentBox,
      ViewerPdf,
      ViewerImage,
      FullCalendar,
      LessonHeader
    },
    data: function() {
      return {
        // 课程表
        courseTable: {
          courseTableVisible: false,
          year: '',
          month: '',
        },
        // 当前选中课程
        curCourse: {
          courseId: '',
          courseName: '',
          courseOrder: '',
          courseDate: '',
        },
        // 课程资源
        defaultVideo: '',
        cover: '',
        videoCover: '',
        courseResource: {
          courseware: '',
          coursewareVideos: {},
          manual: [],
          materialPackage: []
        },
        // 播放器实例
        viewBox: {},
        // loading状态
        loadingVisible: false,

        // H5视频数据
        videoUrl: '',
        coverUrl: '',
        tValue: '',
        // 字幕对象
        enValue: '',
        zhValue: '',
        enAndzhValue: '',
        // 当前资源的Id
        resourceId: '0',
        loading: true,

        // 传递给pdf的数据
        resId: '',
        resCover: '',
        videoObj: {}
      }
    },
    methods: {
      /** 
       * 生成默认的视频展示
      */
      _setInitVideo: function() {
        if (this.defaultVideo != '') {
          document.getElementById('videoDivBox').innerHTML= '<video id="videoEle" class="fill"></video>'
          // 清空video元素
          this.$nextTick( () => {
            if (window.Module.isSupportViewBoxPlayer()) {
              var subtitleObj = {
                "en": this.enValue,
                "zh": this.zhValue,
                "en&zh-cn": this.enAndzhValue
              }
              var temp = {}
              temp.subtitle = subtitleObj
              temp.wrap = document.getElementById("videoEle")
              temp.videouri = this.videoUrl
              temp.videoposter = this.coverUrl
              temp.t = 'bearer ' + this.tValue
              temp.nofullscreen = false
              // 给视频对象进行配置
              let ss = window.Module.createViewBoxPlayer(temp)
              ss.play()   
              this.videoObj = ss 
            } 
          })
        }
      },

      /** 
       * 清空默认的大视频
      */
      _removeInitVideo: function() {
        this.videoObj.stop && this.videoObj.stop()
        document.getElementById('videoDivBox').innerHTML= ''   
      },

      /**
       * 实时获取token
       */
      _getToken: function() {
        let token = cookie.get('ttoken') ? cookie.get('ttoken') : '' 
        if (token) {
          return token
        }
      },

      /**
       * 材料包点击
       */
      _materialPackageClick: function() {
        if (!this.courseResource.materialPackage.length) {
          this.$VMessage('info', '当前课程没有材料包')
          return 
        }
        // 如果有默认的视频就调用视频的关闭方法
        if (this.defaultVideo != ''){
          // 清空
          this._removeInitVideo()
        }
        this.$refs.materialPackage._show()
      },

      /**
       * 手册按钮点击
       */
      _manualClick: function() {
        if (!this.courseResource.manual.length) {
          this.$VMessage('info', '当前课程没有手册')
          return 
        }
        // 如果有默认的视频就调用视频的关闭方法
        if (this.defaultVideo != ''){
          // 清空
          this._removeInitVideo()
        }
        this.$refs.manual._show()
      },

      /**
       * 显示课件
       */
      _showCourseware: function() {
        if (this.defaultVideo != ''){
          // 清空
          this._removeInitVideo()
        }
        this.$refs.courseware._show()
      },

      /**
       * 课程表上个月
       */
      _prevMonth: function() {
        if (this.courseTable.month === 1) {
          this.courseTable.year--
          this.courseTable.month = 12
        }
        else {
          this.courseTable.month--
        }
      },

      /**
       * 课程表下个月
       */
      _nextMonth: function() {
        if (this.courseTable.month === 12) {
          this.courseTable.year++
          this.courseTable.month = 1
        }
        else {
          this.courseTable.month++
        }
      },
      
      /**
       * 全日历课程点击事件
       * @param (Object)course：当前点击课程
       * @param (Number)corder：第几节
       */
      _calendarCourseClick: function(course, order) {
        this.courseTable.courseTableVisible = false
        // 设置选中课程id
        this.curCourse.courseId = course.courseId
        this._getCourseResource()
      },

      /**
       * 设置课程表年月
       */
      _setCourseTableDate: function() {
        const courseTimeArray = this.curCourse.courseDate.split('-')
        this.courseTable.year = courseTimeArray[0]
        this.courseTable.month = parseInt(courseTimeArray[1])
      },
      
      /**
       * 获取默认课程
       */
      _getDefaultCourse: function() {
        this.loadingVisible = true
        requestGetDefaultCourse()
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)
            if (res.code === 200) {
              // console.log('requestGetDefaultCourse SUCCESS', res)
              if (!res.data.courseId) {
                this.curCourse.courseId = ''
                this.curCourse.courseDate = moment().format('YYYY-MM-DD')
                // 设置课程表年月
                this._setCourseTableDate()
                return
              }
              this.curCourse.courseId = res.data.courseId
              this.curCourse.courseDate = res.data.courseTime
              // 设置课程表年月
              this._setCourseTableDate()
              // 获取课程资源
              this._getCourseResource()
            }
          })
      },

      /**
       * 请求课程资源,在此处获取H5相关的数据
       */
      _getCourseResource: function() {
        this.loadingVisible = true
        sessionStorageUtil.set('courseId', this.curCourse.courseId)
        requestGetCourseResource(this.curCourse.courseId)
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)
            if (res.code === 200) {
              // console.log('requestGetCourseResource SUCCESS', res)
              // 设置课程信息
              this.curCourse.courseId = res.data.course.courseId
              this.curCourse.courseName = res.data.course.courseName
              this.curCourse.courseOrder = res.data.course.courseOrder
              this.curCourse.courseDate = res.data.course.courseTime
              // 设置课程表年月
              this._setCourseTableDate()
              // 清空数据
              this.cover = ''
              this.videoCover = ''
              this.defaultVideo = ''
              this.courseResource = {
                courseware: '',
                coursewareVideos: {},
                manual: [],
                materialPackage: []
              }

              // 清空视频
              this._removeInitVideo() 
              // 设置H5数据
              this._setVideoData(res.data)


              // 设置课程资源
              this.cover = res.data.cover
              this.videoCover = res.data.defaultVideoCover
              this.defaultVideo = res.data.defaultVideo
              this.courseResource.manual = res.data.manual ? res.data.manual : []
              this.courseResource.materialPackage = res.data.materialPackage ? res.data.materialPackage : []
              this.courseResource.coursewareVideos = res.data.courseware.videos
              this.courseResource.courseware = 
                res.data.coursePrepareCoursewareType === 'DEFAULT' 
                ? res.data.courseware.defaultUrl 
                : res.data.courseware.customUrl

              // 获取默认视频
              this._setInitVideo() 
            }
          })
      },

      /** 
       * 设置默认视频数据的方法
       * @param {Object} obj:api请求的数据
      */
      _setVideoData: function(obj) {
        let videoPath = obj.defaultVideo.slice(obj.defaultVideo.lastIndexOf('/')) + '.vs4'
        let fileUrl = encodeURI(videoPath)
        this.videoUrl = `/resourceAuthentication/${obj.resId}${fileUrl}`
        this.coverUrl = `/${obj.defaultVideoCover}`
        this.tValue = this._getToken()
        this.resourceId = ''
        this.enValue = ''
        this.zhValue = ''
        this.enAndzhValue = ''

        // 设置传递给PDF控件的公共资源数据
        this.resId = obj.resId
        this.resCover = obj.defaultVideoCover
      },
    },
    beforeRouteLeave: function(to, from, next) {
      this.videoObj.stop && this.videoObj.stop()
      this.videoObj = {}
      next()
    },
    mounted: function() {
      // 缓存课程id
      const cacheCourseId = sessionStorageUtil.get("courseId")
      if (cacheCourseId) {
        this.curCourse.courseId = cacheCourseId
        this._getCourseResource()
      }
      else {
        // 获取默认课程
        this._getDefaultCourse()
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  .attend-class
    position relative
    height 100%
    background url(../../image/bottom-bg1.png) no-repeat 0 bottom, url(../../image/top-bg3.png) no-repeat 0 top 
    /* 菜单标题 */
    .menu-item-title
      line-height 1.2
      font-size $font-size-small
    /* 播放器包裹 */
    .player-wrapper
      position absolute
      top 60px
      right 0
      bottom 0
      left 0
      background black

  @media screen and (max-width: 1600px)
    .attend-class
      background url(../../image/bottom-grassland.png) no-repeat 0 bottom, url(../../image/top-bg2.png) no-repeat 0 top 
</style>

