/*
 * @Desc: 页面上下翻页组件
 */
<template>
  <div class="page-switch" :style="{right: rightValue + 'px', bottom: bottomValue + 'px'}">
    <Button 
      size="small"
      :disabled="disabledPrev"
      @click.native="$emit('goPrev')">上一页
    </Button>
    &nbsp;
    <Button 
      size="small"
      :disabled="disabledNext"
      @click.native="$emit('goNext')">下一页
    </Button>
    &nbsp;
    <Button
      v-if="exitVisible" 
      size="small"
      @click.native="$emit('goExit')">退出
    </Button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'PageSwitch',
    props: {
      // 禁止上一页
      disabledPrev: {
        type: Boolean,
        default: false
      },
      // 禁止下一页
      disabledNext: {
        type: Boolean,
        default: false
      },
      // 退出按钮是否出现的标识
      exitVisible: {
        type: Boolean,
        default: false
      },
      rightValue: {
        type: Number,
        default: 20
      },
      bottomValue: {
        type: Number,
        default: 12
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .page-switch
    position absolute
    z-index 99
</style>

