/** 
 * @Desc: 内容区包裹盒子组件
 */
<template>
  <div class="close-button clickable hover-light" :style="styles">
    <v-icon type="icon-close" size="14" color="#CB6A22"></v-icon>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'CloseButton',
    props: {
      size: {
        type: [String, Number],
        default: 40
      },
      isAttend: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      styles: function() {
        let styles = {}
        styles.width = styles.height = styles.lineHeight = this.size  + 'px'
        if (this.isAttend) {
          styles.background = 'white'
        }
        return styles
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .close-button
    position relative
    display inline-block
    text-align center
    border-radius 50%
    background-image linear-gradient( -90deg, rgb(255,205,133) 1%, rgb(255,162,94) 100%)
    box-shadow 0px 1px 3px 0px rgba(148, 140, 98, 0.72)
</style>
