/** 
 * @Desc: tab组件 材料包内容
 */
<template>
  <div class="material-package">
    <img class="img" :src="materialPackageList[pageIndex]" alt="">
    <page-switch
      v-show="materialPackageList.length"
      :disabledPrev="disabledPrev"
      :disabledNext="disabledNext"
      @goPrev="_goPrev"
      @goNext="_goNext"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import PageSwitch from 'component/page-switch'
  export default {
    name: 'MaterialPackage',
    components: {
      PageSwitch
    },
    props: {
      // 材料包图片集合
      materialPackageList: {
        type: Array,
        required: true
      }
    },
    data: function() {
      return {
        // 页面索引
        pageIndex: 0
      }
    },
    computed: {
      // 禁用上一页
      disabledPrev: function() {
        return this.pageIndex > 0 ? false : true
      },
      // 禁用下一页
      disabledNext: function() {
        return this.pageIndex < this.materialPackageList.length - 1 ? false : true
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
        this.pageIndex < this.materialPackageList.length - 1 && this.pageIndex++
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .material-package
    height 100%
    .img
      width 100%
      height 100%
      border-bottom-left-radius 10px
      border-bottom-right-radius 10px
</style>
