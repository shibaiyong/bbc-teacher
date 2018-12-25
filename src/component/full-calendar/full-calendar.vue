/*
 * @Desc: 全日历组件
 */
<template>
  <div class="mask" v-show="visible">
    <div class="full-calendar center">
      <!-- S 日历头部 -->
      <div class="full-calenda-header">
        <!-- S 关闭 -->
        <close-button 
          :size="30"
          class="full-calendar-close" 
          @click.native="$emit('update:visible', false)">
        </close-button>
        <!-- E 关闭 -->

        <!-- S 月份 -->
        <div class="month">
          <v-icon 
            class="month-btn" 
            type="icon-arrow-left" 
            size="14"
            @click.native="$emit('prevMonth')">
          </v-icon>
          <span style="padding:0 8px;">{{ year }}年{{ month }}月</span>
          <v-icon 
            class="month-btn" 
            type="icon-arrow-right" 
            size="14"
            @click.native="$emit('nextMonth')">
          </v-icon>
        </div>
        <!-- E 月份 -->
 
      </div>
      <!-- E 日历头部 -->

      <!-- S 日历体 -->
      <div class="full-calenda-body">
        <!-- S 星期 -->
        <ul class="week-no">
          <li>星期日</li>
          <li>星期一</li>
          <li>星期二</li>
          <li>星期三</li>
          <li>星期四</li>
          <li>星期五</li>
          <li>星期六</li>
        </ul>
        <!-- E 星期 -->

        <!-- S 内容 -->
        <ul class="week" v-for="(week, index) in courseTable.weeks" :key="index">
          <li class="day" v-for="(day, index) in week" :key="index">
            <div class="course-wrapper">
              <p class="date">{{ day.date }}</p>
              <!-- S 上午课程 -->
              <div 
                class="course-item" 
                v-if="day.morningCourse" 
                @click="$emit('courseClick', day.morningCourse, 1)">
                <div 
                  class="course-name-wrapper"
                  :class="{
                  'theme-healthy': day.morningCourse.courseType === '健康',
                  'theme-language': day.morningCourse.courseType === '语言',
                  'theme-sociology': day.morningCourse.courseType === '社会',
                  'theme-art': day.morningCourse.courseType === '艺术',
                  'theme-science': day.morningCourse.courseType === '科学',
                  }">
                  <p class="course-name no-wrap">
                    {{ day.morningCourse.courseName }}
                  </p> 
                </div>
              </div>
              <div class="course-item" v-else>
                <div class="course-name-wrapper">
                  <p class="course-name no-wrap"></p>
                </div>
              </div>
              <!-- E 上午课程 -->

              <!-- S 下午课程 -->
              <div 
                class="course-item" 
                v-if="day.afternoonCourse" 
                @click="$emit('courseClick', day.afternoonCourse, 2)">
                <div 
                  class="course-name-wrapper"
                  :class="{
                    'theme-healthy': day.afternoonCourse.courseType === '健康',
                    'theme-language': day.afternoonCourse.courseType === '语言',
                    'theme-sociology': day.afternoonCourse.courseType === '社会',
                    'theme-art': day.afternoonCourse.courseType === '艺术',
                    'theme-science': day.afternoonCourse.courseType === '科学',
                  }">
                  <p class="course-name no-wrap">
                    {{ day.afternoonCourse.courseName }}
                  </p> 
                </div>
              </div>
              <div class="course-item" v-else>
                <div class="course-name-wrapper">
                  <p class="course-name no-wrap"></p>
                </div>
              </div>
              <!-- E 下午课程 -->
            </div>
          </li>
        </ul>
        <!-- E 内容 -->
      </div>
      <!-- E 日历体 -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CloseButton from 'base/close-button'
  import { requestGetCourseTable } from 'api/attend-class'
  export default {
    name: 'FullCalendar',
    components: {
      CloseButton,
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
      year: {
        type: [String, Number],
        required: true
      },
      month: {
        type: [String, Number],
        required: true
      }
    },
    data: function() {
      return {
        courseTable: {}
      }
    },
    watch: {
      /**
       * 监视月份
       */
      month: function() {
        this._getCourseTable()
      },
    },
    methods: {
      /**
       * 请求当月课程
       */
      _getCourseTable: function() {
        requestGetCourseTable(this.year, this.month).then(res => {
          if (res.code === 200) {
            // console.log('requestGetCourseTable SUCCESS', res)
            this.courseTable = res.data
          }
        })
      },
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .full-calendar
    position absolute
    width 1130px
    height 700px
    border-radius 10px
    background-color rgb(255, 252, 235)
    box-shadow 0px 0px 15px 0px rgba(0, 0, 0, 0.2),inset 0px 0px 5px 0px rgba(0, 0, 0, 0.15)
    color #57311b
    /* 头部 */
    .full-calenda-header
      height 60px
      padding-top 18px
      .full-calendar-close
        position absolute
        top 15px
        right 30px
      .month    
        text-align center
        height 24px
        line-height 24px
        text-align center
        font-size 24px
        user-select none
        .month-btn
          width 24px
          height 24px
          line-height 24px
          cursor pointer
          background-color rgb(245, 233, 207)
          box-shadow 0px 0px 2px 0px rgba(208, 196, 171, 0.004),inset 0px 1px 1px 0px rgba(0, 0, 0, 0.26)
          border-radius 50%
          vertical-align top
          &:hover
            opacity .7
    /* 主体 */
    .full-calenda-body
      display flex
      flex-direction column
      width 1070px
      height 612px
      margin 0 auto
      padding 16px 34px 18px
      font-size 12px
      background-color rgb(255, 255, 255)
      border-radius 5px
      box-shadow 0px 0px 3px 0px rgba(0, 0, 0, 0.2),inset 0px 2px 0.7px 0.3px rgba(0, 0, 0, 0.2)
      .week-no
        display flex
        justify-content space-around
        height 28px
      .week
        flex 1
        display flex
        .day
          flex 1
          text-align center
          .course-wrapper
            height 82px
            background url(./img/day-bg.png) no-repeat center
            .date
              height 18px
              line-height 22px
              color #907843
            .course-item
              cursor pointer
              &:hover
                opacity .8
              .course-name-wrapper
                width 92px
                height 30px
                margin 1px auto 0
                padding 1px
                border-radius 5px
                box-shadow 0px 1px 2px 0px rgba(144, 135, 115, 0.69)
                .course-name   
                  width 90px
                  height 28px
                  line-height 28px
                  border-radius 5px
                  box-shadow inset 0px -1px 2px 0px rgba(0, 0, 0, 0.18),inset 0px 1px 2px 0px rgba(255, 255, 255, 0.41)

  .theme-healthy
    background-image linear-gradient( -90deg, rgb(125,219,164) 1%, rgb(85,153,103) 100%)
    .course-name
      color rgb(90, 178, 112)
      text-shadow 0px 1px 0px rgba(198, 245, 210, 0.7)
      background-color rgb(161, 220, 176)
  .theme-language
    background-image linear-gradient( -90deg, rgb(225,135,144) 1%, rgb(171,42,62) 100%)
    .course-name
      color rgb(195, 83, 86)
      text-shadow 0px 1px 0px rgba(255, 188, 189, 0.7)
      background-color rgb(235, 146, 147)
  .theme-sociology    
    background-image linear-gradient( -90deg, rgb(99,187,184) 1%, rgb(76,120,146) 100%)
    .course-name
      color rgb(92, 160, 184)
      text-shadow 0px 1px 0px rgba(222, 246, 254, 0.7)
      background-color rgb(157, 210, 225)
  .theme-art    
    background-image linear-gradient( -90deg, rgb(238,199,151) 1%, rgb(200,150,90) 100%)
    .course-name
      color rgb(196, 164, 91)
      text-shadow 0px 1px 0px rgba(255, 244, 220, 0.69)
      background-color rgb(248, 225, 174)
  .theme-science    
    background-image linear-gradient( -90deg, rgb(175,175,255) 1%, rgb(127,127,218) 100%)
    .course-name
      color rgb(128, 128, 219)
      text-shadow 0px 1px 0px rgba(208, 208, 255, 0.69)
      background-color rgb(190, 190, 250)

  @media screen and (max-height 780px) 
    .full-calendar
      position absolute
      width 1000px
      height 620px
      .full-calenda-header
        height 50px
        padding-top 13px
        .full-calendar-close
          position absolute
          top 10px
          right 20px
        .month    
          font-size 22px
      .full-calenda-body
        width 960px
        height 560px
        padding 10px 
</style>
