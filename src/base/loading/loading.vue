<template>
  <div class="mask">
    <div class="loading">
      <i class="icon"></i>
      <p>Loading</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VLoading',
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .mask
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    z-index 99999
    border-radius 10px
    background-color rgb(0, 0, 0,.6)
    // background-color hsla(0,0%,100%,.8)
    .loading
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      color #088844
      text-align center
      .icon 
        display inline-block
        width 40px
        height 40px
        margin-bottom 3px
        background-image url(./img/loading.svg)
</style>