<template>
  <i 
    class="icon" 
    :class="type" 
    :style="{'font-size': size + 'px', 'color': color}">
    <template v-if="multiple">
      <span class="path1"></span><span class="path2"></span><span class="path3"></span>
    </template>
  </i>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VIcon',
    props: {
      type: {
        type: [Array, String, Object]
      },
      size: {
        type: [String, Number]
      },
      color: {
        type: String
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .icon
    display inline-block
    &.loading
      animation spin 1s linear infinite
      @keyframes spin 
        from 
          transform rotate(0deg)
        to 
          transform rotate(360deg)
</style>

