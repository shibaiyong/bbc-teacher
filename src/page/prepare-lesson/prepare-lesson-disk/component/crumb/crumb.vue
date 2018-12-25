/*
 * @Desc: 面包屑
 */
<template>
  <div class="crumb">
    <button 
      :style="{'pointer-events': folderName ? 'all' : 'none'}"
      :class="{'all-active': folderName}"
      @click="$emit('accessRoot')">
      全部文件
    </button>
    <span v-show="folderName" class="folder-name">
      <v-icon 
        type="icon-forward"
        size="12"
        style="margin:0 8px;"/>
      {{ folderName }}
    </span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'Crumb',
    props: {
      // 当前访问文件夹名称
      folderName: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .crumb
    height 44px
    line-height 44px
    font-size 12px
    padding 0 26px
    .all-active
      color #269856
    .folder-name
      color #999
</style>

