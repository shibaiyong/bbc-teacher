/** 
 * @Desc: 在线备课子页面
 */
<template>
  <content-box>
    <div class="prepare-lesson-online">
      <v-loading v-show="loadingVisible"></v-loading>
      <!-- S 头部 -->
      <lesson-header>
        <span v-if="curCourse.courseId">
          {{ curCourse.courseDate | dateZh }} 
          第{{ curCourse.courseOrder }}节
          <span style="margin-left:8px;">{{ curCourse.courseName }}</span>
        </span>
        <span v-else>当前没有课程</span>  
        <v-toggle 
          v-show="toggleVisible" 
          :flag="toggleFlag" 
          @click.native="_toggleSelectType"/>
        <ul class="tab-list" v-if="tabList.length">
          <li 
            class="tab-item clickable" 
            :class="{'active': tabItem.name === currentTabView}"
            v-for="(tabItem, index) in tabList" 
            :key="index"
            @click="_tabItemClick(tabItem)">
            {{ tabItem.title }}
          </li>
        </ul>
      </lesson-header>
      <!-- E 头部 -->

      <!-- S tab内容 -->
      <div class="course-resource" ref="courseResourceBox">
        <component
          ref="ChildComponent" 
          :is="currentTabView" 
          :preparePlanUrl="preparePlanUrl"
          :coursewareUrl="coursewareUrl"
          :videos="courseware.videos"
          :resId="resId"
          :resCover="resCover"
          :manualList="manual"
          :materialPackageList="materialPackage"/>
      </div>
      <!-- E tab内容 -->

      <!-- S 右侧菜单 -->
      <v-menu>
        <v-menu-item @click.native="courseTable.courseTableVisible = true">
          <v-icon type="icon-course-table" size="40"/>
          <p class="menu-item-title">课程表</p>
        </v-menu-item>
        <v-menu-item 
          @click.native="_editPreparePlan" 
          :style="{'pointer-events': editPreparePlanFlag ? 'none' : 'all'}">
          <v-icon type="icon-edit-lesson-plan" size="40"/>
          <p class="menu-item-title" v-text="editPreparePlanFlag ? '编辑中...' : '修改教案'"/>
        </v-menu-item>
        <v-menu-item 
          @click.native="_editCourseware"
          :style="{'pointer-events': editCoursewareFlag ? 'none' : 'all'}">
          <v-icon type="icon-edit-courseware" size="40"/>
          <p class="menu-item-title" v-text="editCoursewareFlag ? '编辑中...' : '修改课件'"/>
        </v-menu-item>
        <v-menu-item 
          @click.native="_openMaterialLibrary">
          <v-icon type="icon-material" size="40"/>
          <p class="menu-item-title">素材</p>
        </v-menu-item>
        <v-menu-item 
          @click.native="_finishPrepareCourseClick"
          :style="{'pointer-events': coursePrepareFlag ? 'none' : 'all'}">
          <v-icon :type="coursePrepareFlag ? 'icon-prepare-lesson-finish-yes' : 'icon-prepare-lesson-finish-no'" size="40"/>
          <p class="menu-item-title" v-text="coursePrepareFlag ? '已备课' : '完成备课'"/>
        </v-menu-item>
      </v-menu>
      <!-- E 右侧菜单 -->

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

      <!-- S 素材库 -->
      <material-library
        :visible.sync="materialLibraryVisible"
        :token="_getToken()"
        :userId="empId">
      </material-library>
      <!-- E 素材库 -->
    </div>

    <!-- S 提示用户没有安装或打开课件编辑器 -->
    <Modal
      title="提示"
      v-model="promptInstallEditor"
      :confirm="true"
      @on-ok="promptInstallEditor = false"
      ok-text="关闭">
      您没有打开或没有安装课件编辑器，如需下载课件编辑器，请点击
      <a 
        :href="downHref" 
        download="ViewShareBBC幼儿课堂.exe" 
        style="color:#4397ff;">
        这里
      </a>
    </Modal>
    <!-- E 提示用户没有安装或打开课件编辑器 -->
  </content-box>
</template>

<script type="text/ecmascript-6">
  import VToggle from 'component/toggle'
  import VMenu from 'component/menu'
  import VMenuItem from 'component/menu-item'
  import ContentBox from 'component/content-box'
  import LessonHeader from 'component/lesson-header'
  import FullCalendar from 'component/full-calendar'
  import PreparePlan from './component/prepare-plan'
  import Courseware from './component/courseware'
  import Manual from './component/manual'
  import MaterialPackage from './component/material-package'
  import MaterialLibrary from 'component/material-library'
  import { checkCustomProtocol } from "lib/checkCustomProtocol"
  import { get2NextWeekLastDay } from 'lib/util'
  import { baseURL } from 'config/config'
  import cookie from 'js-cookie'
  import moment from 'moment'
  import { requestGetDefaultCourse, requestGetCourseResource } from 'api/attend-class'
  import {
    requestFinishPrepareCourse,
    requestTogglePreparePlan,
    requestToggleCourseware
  } from 'api/prepare-lesson-online'
  import { sessionStorageUtil } from  'lib/util'
  export default {
    name: 'PrepareLessonOnline',
    components: {
      VMenu,
      VMenuItem,
      PreparePlan,
      ContentBox,
      Courseware,
      Manual,
      MaterialPackage,
      LessonHeader,
      VToggle,
      FullCalendar,
      MaterialLibrary
    },
    data: function() {
      return {
        // 下载路径
        downHref: '',

        // tab
        tabList: [],
        currentTabView: '',

        // 状态控制
        coursePrepareFlag: false,
        editPreparePlanFlag: false,
        editCoursewareFlag: false,
        toggleFlag: 'DEFAULT',
        materialLibraryVisible: false,
        promptInstallEditor: false,

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

        // 教案、课件、手册、材料包资源
        preparePlanUrl: '',
        coursewareUrl: '/static/res/cw.pdf',
        manual: [],
        materialPackage: [],
        preparePlan: {
          customFileUrl: '',
          customUrl: '',
          defaultFileUrl: '',
          defaultUrl: '',
          md5: ''
        },
        courseware: {
          customFileUrl: '',
          customUrl: '',
          defaultFileUrl: '',
          defaultUrl: '',
          md5: '',
          videos: {},
        },
        // 资源Id
        resId: '',
        // 公共的图片信息
        resCover: '',

        // 当前教案和课件选中类型 
        preparePlanSelectType: '',
        coursewareSelectType: '',

        // 自定义教案和课件
        hasCustomCoursePlan: false,
        hasCustomCourseware: false,
        
        // websocket
        socketData: {
          editCourseId: '',
          socket: '',
          editType: '',
          downUrl: '',
          originUrl: '',
          md5: '',
        },

        // loading状态
        loadingVisible: false,
      }
    },
    computed: {
      /**
       * 根据是否有自定义课件控制toggle显示隐藏
       */
      toggleVisible: function() {
        return (this.currentTabView === 'prepare-plan' && this.hasCustomCoursePlan) || 
          (this.currentTabView === 'courseware' && this.hasCustomCourseware) 
      },

      /**
       * empid
       */
      empId: function() {
        return this.$store.state.userInfo && this.$store.state.userInfo.emp.empId
      }
    },
    watch: {
      /**
       * 监视当前选中tab
       */
      currentTabView: function(newValue) {
        if (newValue === 'prepare-plan') {
          this.toggleFlag = this.preparePlanSelectType
        }
        if (newValue === 'courseware') {
          this.toggleFlag = this.coursewareSelectType
        }
      },

      /**
       * 监视教案选中类型 切换教案为默认、自定义
       */
      preparePlanSelectType: function(newValue) {
        this.preparePlanUrl = newValue === 'CUSTOM' ? this.preparePlan.customUrl : this.preparePlan.defaultUrl
        if (this.currentTabView === 'prepare-plan') {
          this.toggleFlag = this.preparePlanSelectType
        }
      },

      /**
       * 监视课件选中类型 切换课件为默认、自定义
       */
      coursewareSelectType: function(newValue) {
        this.coursewareUrl = newValue === 'CUSTOM' ? this.courseware.customUrl : this.courseware.defaultUrl
        if (this.currentTabView === 'courseware') {
          this.toggleFlag = this.coursewareSelectType
        }
      }
    },
    methods: {
      /** 
       * 获取下载路径
      */
      _getQueryPath: function() {
        return this.downHref = baseURL.substring(0, baseURL.lastIndexOf(':')) + '/download/ViewShareBBC幼儿课堂.exe' 
        // return this.downHref = baseURL.substring(0, baseURL.lastIndexOf(':')) + '/download/糖果树幼儿课堂.exe' 
      },

      /**
       * 实时获取token
       */
      _getToken: function() {
        let token = cookie.get('ttoken') ? cookie.get('ttoken') : '' 
        if (token) {
          return token
        }
        return confirm('操作提示：登陆过期，为您跳转到登陆页面？') ? this.$router.push('/login') : '' 
      },

      /**
       * 打开素材库页面
       */
      _openMaterialLibrary: function() {
        // token校验
        if (!this._getToken()) {
          return
        }
        this.materialLibraryVisible = true
      },

      /**
       * 设置当前教案和课件编辑状态
       * @param (boolean) value：状态
       */
      _setEditFlag: function(value) {
        if (this.socketData.editType === 'word') {
          this.editPreparePlanFlag = value
        } 
        else {
          this.editCoursewareFlag = value
        }
      },

      /**
       * 修改教案
       */
      _editPreparePlan: function() {
        if (!this.curCourse.courseId) {
          this.$VMessage('error', '当前没有课程')
          return 
        }
        this.socketData.editType = 'word'
        this.socketData.downUrl = this.preparePlan.customFileUrl ? this.preparePlan.customFileUrl : this.preparePlan.defaultFileUrl
        this.socketData.originUrl = this.preparePlan.defaultFileUrl
        this.socketData.md5 = this.preparePlan.md5
        this._socketConnect()
      },

      /**
       * 修改课件
       */
      _editCourseware: function() {
        if (!this.curCourse.courseId) {
          this.$VMessage('error', '当前没有课程')
          return 
        }
        this.socketData.editType = 'powerpoint'
        this.socketData.downUrl = this.courseware.customFileUrl ? this.courseware.customFileUrl : this.courseware.defaultFileUrl
        this.socketData.originUrl = this.courseware.defaultFileUrl
        this.socketData.md5 = this.courseware.md5
        this._socketConnect()
      },

      /**
       * 处理socket服务器响应op
       * @param (Object)receiveData：接收到的数据
       */
      _handleSocketOp: function(receiveData) {
        const op = receiveData.op ? receiveData.op : ''
        switch (op) {
          // op1响应 请求编辑课件
          case 101: {
            const paramStr = JSON.stringify({
              op: 2, 
              chatid: Math.round(Math.random() * 2147483647),
              type: this.socketData.editType, 
              courseid: this.curCourse.courseId, 
              name: this.curCourse.courseName,
              downurl: this.socketData.downUrl,
              originurl: this.socketData.originUrl,
              cmd5: this.socketData.md5,
              token: this._getToken()
            })
            this.socketData.editCourseId = this.curCourse.courseId
            this.socketData.socket.send(paramStr)
            break
          }

          // op2响应 请求编辑课程回应
          case 102: {
            const res = receiveData.res
            if (res === 0) {
              // console.log('server respond: request ok')
            }
            else if (res === 1) {
              // console.log('server respond: the other courseware is being edited')
              this.$VMessage('error', '课件正在编辑中')
            }
            else if (res === 2) {
              // console.log('server respond: not installed office')
              this.$VMessage('error', '您没有安装office')
            }
            else if (res === 3) {
              // console.log('server respond: param error')
              this.$VMessage('error', '系统出错，打开失败')
            }
            break
          }

          // op3响应 请求关闭编辑回应
          case 103: {
            this.$VMessage('info', '已终止课件编辑')
            this.socketData.socket.close()
            this._setEditFlag(false)
            const coursestate = receiveData.coursestate
            if (coursestate === 0) {
              // console.log('server respond: courseware not change')
            }
            else if (coursestate === 1) {
              // console.log('server respond: courseware has edit')
            }
            else if (coursestate === 2) {
              // console.log('server respond: current not edit courseware')
            }
            break
          }
        }
      },

      /**
       * 处理socket服务器响应notify
       * @param (Object)receiveData：接收到的数据
       */
      _handleSocketNotify: function(receiveData) {
        const notify = receiveData.notify ? receiveData.notify : ''
        switch (notify) {
          // 调用错误
          case 0: {
            // console.log('param error')
            break
          }

          // 打开office
          case 1: {
            const con = receiveData.con
            if (con === 0) {
              // console.log('courseware open: success')
              this.$VMessage('success', '课件编辑器打开成功')
              this._setEditFlag(true)
            }
            if (con === 1) {
              // console.log('courseware download: fail')
              this.$VMessage('error', '课件下载失败')
            }
            if (con === 2) {
              // console.log('courseware open: fail')
              this.$VMessage('error', '课件编辑器打开失败')
            }
            break
          }

          // 上传课件
          case 2: {
            const con = receiveData.con
            if (con === 0) {
              // console.log('courseware upload: success')
              this.$VMessage('success', '自定义课件上传成功')
              // 自定义课件提交成功 刷新课程资源
              // 确保当前的课程Id是编辑的课程Id,避免出现编辑中切换课程的情况发生
              if (this.curCourse.courseId === this.socketData.editCourseId) {
                //解决轻松备课中插入图片后后首次不能点击的情况
                this._getCourseResource(this.curCourse.courseId)
              } 
            }
            else if (con === 1) {
              // console.log('courseware upload: fail')
            }
            else if (con === 2) {
              // console.log('courseware upload: start')
            }
            else if (con === 3) {
              // console.log('courseware upload: progress', receiveData.progress)
            }
            break
          }

          // 用户主动关闭office
          case 3: {
            // console.log('user close the office')
            this.$VMessage('info', '已结束课件编辑')
            this._setEditFlag(false)
            this.socketData.socket.close()
            break
          }

          // 恢复默认
          case 4: {
            this._getCourseResource(this.socketData.editCourseId)
          }
        }    
      },

      /**
       * socket连接建立
       */
      _socketOpen: function() {
        // 设置socket的方法
        this.socketData.socket.onmessage = this._socketMessage
        this.socketData.socket.onerror = this._socketError
        this.socketData.socket.onclose = this._socketClose
        // 发送op1
        const token = this._getToken()
        const paramStr = JSON.stringify({
          op: 1,
          chatid: Math.round(Math.random() * 2147483647),
          url: `${document.location.origin}/static/material-library/index.html?token=${token}&userId=${this.empId}`
        })
        this.socketData.socket.send(paramStr)
      },

      /**
       * socket接收消息
       */
      _socketMessage: function(ev) {
        // console.log('socket receive message: ', ev.data)
        const receiveData = JSON.parse(ev.data)
        this._handleSocketOp(receiveData)
        this._handleSocketNotify(receiveData)
      },

      /**
       * socket通信发生错误
       */
      _socketError: function() {
        // console.log('socket connect: error')
        this._setEditFlag(false)
      },

      /**
       * socket连接关闭
       */
      _socketClose: function() {
        // console.log('socket connect: close')
        this._setEditFlag(false)
      },

      /**
       * 连接socket
       */
      _socketConnect: function() {
        // 判断socket支持
        if (!window.WebSocket) {
          // console.log('current browser no support websocket！')
          return 
        }

        // token校验
        if (!this._getToken()) {
          return
        }

        // 获取socket端口并连接
        this.$VMessage('info', '正在打开课件编辑器...')
        const portArray = [10987, 9876, 34561, 26783, 11768]
        let failCount = 0
        const promises = portArray.map(port => {
          var socket = new WebSocket("ws://localhost:" + port)
          socket.onopen = () => {
            // console.log('sockt connect success', port)
            this.socketData.socket = socket
            this._socketOpen()
          }
          socket.onerror = () => {
            failCount++
            if (failCount === 5) {
              // console.log('no available socket port')
              // 检测用户是否安装编辑器
              this._checkExe()
            }
            socket.close()
          }
          return socket
        })
        // 并行执行所有的异步websocket请求
        Promise.all(promises)
      },

      /**
       * 检测用户是否安装编辑器
       */
      _checkExe: function() {
        checkCustomProtocol( 
          () => {
            // console.log('no installed courseware editor')
            this.promptInstallEditor = true
          },
          () => {
            // console.log('installed courseware editor')
          }
        )
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
        // 设置默认跳转到教案组件中
        this.currentTabView = 'prepare-plan'
        this._getCourseResource(this.curCourse.courseId)
      },

      /**
       * 切换选中类型（教案、课件）
       */
      _toggleSelectType: function() {
        this.currentTabView === 'prepare-plan' ? this._togglePreparePlan() : this._toggleCourseware()
      },

      /**
       * 教案状态切换
       */
      _togglePreparePlan: function() {
        requestTogglePreparePlan(this.curCourse.courseId)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestToggleTeachingCase SUCCESS', res)
              this._getCourseResource(this.curCourse.courseId)
              this.$VMessage('success', '教案切换成功')
            }
            else {
              this.$VMessage('error', '教案切换失败')
            }
          })
      },

      /**
       * 课件状态切换
       */
      _toggleCourseware: function() {
        requestToggleCourseware(this.curCourse.courseId)
          .then(res => {
            if (res.code === 200) {
              console.log('requestToggleCourseware SUCCESS', res)
              this._getCourseResource(this.curCourse.courseId)
              this.$VMessage('success', '课件切换成功')
            }
            else {
              this.$VMessage('error', '课件切换失败')
            }
          })
          .catch(err => {
            // console.log('requestToggleCourseware FAIL', err)
          })
      },

      /**
       * tab项点击
       */
      _tabItemClick: function(tabItem) {
        this.loadingVisible = true
        this.currentTabView = tabItem.name
        // 当点击的是课件的时候，加载一个loading，同时加载show方法来避免出现空白页面和实现可点击区域
        setTimeout(() => this.loadingVisible = false, 1000)
      },

      /**
       * 完成备课按钮点击
       */
      _finishPrepareCourseClick: function() {
        // 课程时间戳 时分秒都为0
        let courseTimestamp = new Date(this.curCourse.courseDate).getTime()
        courseTimestamp = new Date(courseTimestamp)
        courseTimestamp.setHours(0,0,0,0)
        courseTimestamp = courseTimestamp.getTime()
        
        // 今天时间戳 时分秒都为0
        const todayTimestamp = new Date().setHours(0,0,0,0)
        const curHour = new Date().getHours()

        // 备课超时
        if (todayTimestamp > courseTimestamp) {
          this.$VMessage('info', '备课超时')
          return 
        }

        // 备的今天得课
        if (todayTimestamp === courseTimestamp) {
          if (this.curCourse.courseOrder === 1) {
            if (curHour > 8) {
              this.$VMessage('info', '备课超时')
              return 
            }
          }
          else {
            if (curHour > 14) {
              this.$VMessage('info', '备课超时')
              return
            }
          }
        }

        // 超出可备课时间范围
        if (courseTimestamp >= get2NextWeekLastDay()) {
          this.$VMessage('info', '对不起，只能备两周之内的课')
          return
        }

        // 请求完成备课
        this._finishPrepareCourse(this.curCourse.courseId)
      },

      /**
       * 完成备课
       * @param (number) courseId：课程id
       */
      _finishPrepareCourse: function(courseId) {
        requestFinishPrepareCourse(this.curCourse.courseId)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestFinishPrepareCourse SUCCESS', res)
              this.$VMessage('success', '备课成功')
              this.coursePrepareFlag = true
            }
            else {
              // console.log('requestFinishPrepareCourse FAIL', res)
              this.$VMessage('error', '备课失败，系统内部错误')
            }
          })
      },

      /**
       * 设置课程表年月文字
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
            setTimeout(() => this.loadingVisible = false, 1000)
            if (res.code === 200) {
              // console.log('requestGetDefaultCourse SUCCESS', res)
              if (!res.data.courseId) {
                // console.log('no default course')
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
              this._getCourseResource(this.curCourse.courseId)
            }
          })
          .catch(err => {
            // console.log('requestGetDefaultCourse FAIL', err)
          })
      },

      /**
       * 获取课程资源
       * @param (number) courseId：课程id
       */
      _getCourseResource: function(courseId) {
        this.loadingVisible = true
        // 在此处清空之前的数据
        this.preparePlanUrl = ''
        this.coursewareUrl = ''
        this.materialPackage = []
        this.manual = []
        sessionStorageUtil.set('courseId', courseId)
        requestGetCourseResource(courseId)
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 1000)
            if (res.code === 200) {
              // console.log('requestGetCourseResource SUCCESS', res)
              // 设置课程信息
              this.curCourse.courseId = res.data.course.courseId
              this.curCourse.courseName = res.data.course.courseName
              this.curCourse.courseOrder = res.data.course.courseOrder
              this.curCourse.courseDate = res.data.course.courseTime

              // 设置课程表年月
              this._setCourseTableDate()

              // 设置备课状态
              this.coursePrepareFlag = res.data.hasPrepare

              // 设置是否有自定义教案
              this.hasCustomCoursePlan = res.data.hasCustomPlan
              this.hasCustomCourseware = res.data.hasCustomCourseware

              // 设置选中教案和课件类型(默认还是自定义)
              this.preparePlanSelectType = res.data.coursePreparePlanType
              this.coursewareSelectType = res.data.coursePrepareCoursewareType

              // 设置资源
              this.preparePlan = res.data.teachingCase
              this.courseware = res.data.courseware
              this.manual = res.data.manual ? res.data.manual : []
              this.materialPackage = res.data.materialPackage ? res.data.materialPackage : []
              this.preparePlanUrl = res.data.coursePreparePlanType === 'DEFAULT' ? res.data.teachingCase.defaultUrl : res.data.teachingCase.customUrl
              this.coursewareUrl = res.data.coursePrepareCoursewareType === 'DEFAULT' ? res.data.courseware.defaultUrl : res.data.courseware.customUrl

              // 设置此处的resId和cover图片数据
              this.resId = res.data.resId ? res.data.resId : ''
              this.resCover = res.data.defaultVideoCover ? res.data.defaultVideoCover : ''
            

              // 控制手册材料包显示隐藏
              let tabList =  [
                {title: '教案', name: 'prepare-plan'},
                {title: '课件', name: 'courseware'}
              ]
              if (this.manual.length) {
                tabList.push({title: '手册', name: 'manual'})
              }
              if (this.materialPackage.length) {
                tabList.push({title: '材料包', name: 'material-package'})
              }
              this.tabList = tabList  
              // 动态组件，考虑到当前切换的课程资源没有手册和材料包以及之前切换的时候的那个动态组件，
              // tabList的整体数据是根据当前课程的资源数据来动态添加组件个数的，所以才有下面的考虑，就是为了默认显示教案的
              if (this.currentTabView === 'manual' || this.currentTabView === 'material-package' || !this.currentTabView) {
                this.currentTabView = 'prepare-plan'
              }

              //切换课程都要默认跳转到教案来解决VuePDF数据的缓存
              if(this.currentTabView === "courseware") {
                this.currentTabView = 'courseware'
                // setTimeout(() => this.currentTabView ='courseware', 600)
              }

              // 切换课程之后，为了在C++包装的谷歌容器使用，进行如下的切换操作
              // 先切换到课件，在切换到教案中
              // this._tabItemClick(this.tabList[1])
              // setTimeout( () => {
              //   this._tabItemClick(this.tabList[0])
              // }, 900)
            }
          })
      }
    },
    mounted: function() {
      this._getQueryPath()
      // 是否含有其他页面缓存的课程id
      const cacheCourseId = sessionStorageUtil.get("courseId")
      if (cacheCourseId) {
        this.curCourse.courseId = cacheCourseId
        this._getCourseResource(this.curCourse.courseId)
      } else {
        // 获取默认课程
        this._getDefaultCourse()
      }
    },
    beforeRouteLeave: function(to, from, next) {
      if (this.socketData.socket.readyState === 1) {
        if (confirm('正在编辑课件，确定要终止编辑吗？')) {
          // 停止编辑
          const paramStr = JSON.stringify({
            op: 3,
            chatid: Math.round(Math.random() * 2147483647),
            type: this.socketData.editType,
            courseid: this.socketData.editCourseId,
            downurl: this.socketData.downUrl
          })
          this.socketData.socket.send(paramStr)
          next()
        } 
      } 
      next()
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  .prepare-lesson-online
    position relative
    height 100%
    /* tabs */
    .tab-list
      float right 
      margin-top 15px
      .tab-item
        float left
        height 30px
        line-height 30px
        padding 0 15px
        text-align center
        margin-left 10px
        border-radius 30px
        transition .3s
        &.active, &:hover
          color $color-text-sub
          background-color #fff
          background-color rgb(255, 238, 221)
          opacity 0.8
          box-shadow inset 0px -1px 2px 0px rgba(0, 0, 0, 0.35),inset 0px 2px 1px 0px rgba(255, 253, 242, 0.004)
    /* 课件内容 */
    .course-resource
      position absolute
      top 60px
      right 0
      bottom 0
      left 0
      border-bottom-left-radius 10px
      border-bottom-right-radius 10px
      background-color $color-bg
    /* 菜单标题 */
    .menu-item-title
      line-height 1.2
      font-size $font-size-small
</style>

