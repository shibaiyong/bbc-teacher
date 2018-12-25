/** 
 * @Desc: 收藏列表
 */
<template>
  <div class="steps">
    <!-- 图标 -->
    <div class="steps-icon clear-float">
      <div class="step-item">
        <div class="step-circle circle-one" :class="{'circle-current': current >= 0}">1</div>
        <div class="step-line line-one" :class="{'line-current': current >= 1}"></div>
      </div>
      <div class="step-item" >
        <div class="step-circle circle-two" :class="{'circle-current': current >= 1}">2</div>
        <div class="step-line line-two-left" :class="{'line-current': current >= 1}"></div>
        <div class="step-line line-two-right" :class="{'line-current': current >= 2}"></div>
      </div>
      <div class="step-item">
        <div class="step-circle circle-three" :class="{'circle-current': current >= 2}">3</div>
        <div class="step-line line-three" :class="{'line-current': current >= 2}"></div>
      </div>
    </div>
    <!-- 提示文字 -->
    <div class="steps-icon clear-float" style="margin-top: 10px">
      <div class="step-item text-item text-one" :class="{'text-current': current >= 0}">
        {{textArr[0]}}
      </div>
      <div class="step-item text-item text-two" :class="{'text-current': current >= 1}">
        {{textArr[1]}}
      </div>
      <div class="step-item text-item text-three" :class="{'text-current': current >= 2}">
        {{textArr[2]}}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'steps',
  props: {
    current: {
      type: Number,
      required: true
    },
    textArr: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .steps
    padding 0 10px
    .steps-icon
      .step-item
        position relative
        float left
        width 33%
        .step-circle
          position relative
          z-index 9
          display inline-block
          width 40px
          height 40px
          line-height 40px
          border-radius 50%
          border 1px solid #d3c8b0
          background-color #f5e9cf
          color #be9d70
        .circle-one
          left -40px
        .circle-three
          left 40px
        .circle-current
          transition all .5s
          background-image linear-gradient(to bottom, #55c888, #088844)
          border-color #2cab63 
          color #ffffff    

        /* 线条 */    
        .step-line
          position absolute
          top 18px
          left 0
          width 100%
          height 3px
          background-color #d3c8b0
        .line-one
          left 5px
        .line-three
          width 95%
        .line-two-left
          width 50%
          left 0
        .line-two-right
          width 50%
          left 50% 
        .line-current
          transition all .5s
          background-color #2ba961 

      /* 文字 */
      .text-item
        font-size 14px
        color #c3a87e
      .text-one
        text-align left
        text-indent -2px
      .text-three
        text-align right
        padding-right 10px
      .text-current
        color #2cab63  
</style>
