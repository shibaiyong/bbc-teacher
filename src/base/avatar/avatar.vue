<template>
  <img 
    :src="src" 
    class="v-avatar"
    alt="头像"
    :style="{'width': size + 'px', 'height': size + 'px'}">
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VAvatar',
    props: {
      src: {
        type: String
      },
      size: {
        type: String,
        default: '20'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .v-avatar
    vertical-align top
    border-radius 50%
</style>

