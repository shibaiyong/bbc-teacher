/** 
 * @Desc: 内容区包裹盒子组件
 */
<template>
  <div class="content-box" ref="contentBox">
    <slot/>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'ContentBox',
    methods: {
      _resizeEvent: function() {
        const contentBoxEl = this.$refs.contentBox
        if (contentBoxEl) {
          const screenWidth = document.body.clientWidth 
          const contentBoxWidth = screenWidth * 0.58
          const contentBoxHeight = contentBoxWidth * 9 / 16 + 60
          contentBoxEl.style.width = contentBoxWidth + 'px'
          contentBoxEl.style.height = contentBoxHeight + 'px'
        }
      }
    },
    mounted: function() {
      this._resizeEvent()
      window.addEventListener('resize', this._resizeEvent)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  .content-box
    margin 0 auto
    position relative
    box-shadow 0px 0px 10px 0px rgba(0, 0, 0, 0.3), inset 0px 0px 5px 0px rgba(0, 0, 0, 0.15)
    border-radius 10px
    background-color $color-bg

  @media screen and (min-height 1000px) 
    .content-box
      margin-top 30px
</style>