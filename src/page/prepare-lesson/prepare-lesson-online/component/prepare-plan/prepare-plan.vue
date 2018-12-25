/** 
 * @Desc: tab组件 教案内容
 */
<template>
  <div class="prepare-plan" ref="preparePlan">
    <pdfshower
      :pdfurl="preparePlanUrl"
      :scale="scaleValue"
      @onErr="onErr">
    </pdfshower>
    <!-- <embed 
      type="application/pdf" 
      width="100%" 
      height="100%" 
      :src="preparePlanUrl">
    </embed> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import pdfshower from 'vue-pdf-shower'
  export default {
    name: 'PreparePlan',
    data: function() {
      return {
        scaleValue: 0
      }
    },
    components: {
      pdfshower
    },
    props: {
      preparePlanUrl: {
        type: String,
        required: true
      }
    },
    mounted: function() {
      window.addEventListener('resize', this._setPdfshow)
      this._setPdfshow()
    },
    methods: {
      /** 
       * pdferror
      */
      onErr(err) {
        console.log('错误信息:', err)
      },

      /** 
       * 设置PDF的样式
      */
      _setPdfshow: function() {
        let widthValue = this.$refs.preparePlan.clientWidth*1
        let heightValue = this.$refs.preparePlan.clientHeight*1
        let ele = document.getElementById('cvsWraper')
        ele.style.width = widthValue + 'px'
        ele.style.height = heightValue + 'px'

        // 设置缩放比例
        if (widthValue <= 773) {
          this.scaleValue = 0.85
        }
        if ( 773< widthValue <= 810 ) {
          this.scaleValue = 0.9
        }
        if ( 810< widthValue <= 900 ) {
          this.scaleValue = 1
        }
        if ( 900< widthValue <= 1140 ) {
          this.scaleValue = 1.2
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .prepare-plan
    height 100%
</style>
