/** 
 * @Desc: tab组件 手册内容
 */
<template>
  <div class="manual" ref="manual">
    <img class="img" :src="manualList[pageIndex]" alt="">
    <page-switch
      :disabledPrev="disabledPrev"
      :disabledNext="disabledNext"
      v-show="manualList.length"
      @goPrev="_goPrev"
      @goNext="_goNext"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import PageSwitch from 'component/page-switch'
  export default {
    name: 'Manual',
    components: {
      PageSwitch
    },
    props: {
      // 手册图片集合
      manualList: {
        type: Array,
        required: true
      }
    },
    data: function() {
      return {
        // 页面索引
        pageIndex: 0,
      } 
    },
    computed: {
      // 禁用上一页
      disabledPrev: function() {
        return this.pageIndex > 0 ? false : true
      },
      // 禁用下一页
      disabledNext: function() {
        return this.pageIndex < this.manualList.length - 1 ? false : true
      }
    },
    methods: {
      /**
       * 上一页
       */
      _goPrev: function() {
        this.pageIndex > 0 && this.pageIndex--
      },

      /**
       * 下一页
       */
      _goNext: function() {
        this.pageIndex < this.manualList.length - 1 && this.pageIndex++
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .manual
    height 100%
    .img
      width 100%
      height 100%
      border-bottom-left-radius 10px
      border-bottom-right-radius 10px
</style>