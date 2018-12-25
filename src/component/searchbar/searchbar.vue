/** 
 * @Desc: 搜索框
 */
<template>
  <div class="searchbar">
    <input 
      class="searchbar-input" 
      type="text"
      v-model.trim="keyword"
      :placeholder="placeholder"
      @keydown.enter="_searchClick"/> 
    <v-icon 
      class="searchbar-search-btn clickable" 
      type="icon-search" 
      size="16"
      @click.native="_searchClick"/>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'Searchbar',
    props: {
      placeholder: {
        type: String,
        default: ''
      }
    },
    data: function(){
      return {
        keyword: ''
      }
    },
    methods: {
      /**
       * 搜索点击
       */    
      _searchClick: function() {
        if (this.keyword) {
          this.$emit('search', this.keyword)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .searchbar
    position relative
    width 240px
    height 30px
    line-height 30px
    display inline-block
    vertical-align middle
    .searchbar-input
      width 100%
      height 30px
      line-height 30px
      vertical-align top
      font-size 14px
      border-radius 15px
      background-color #966023
      padding 0 40px 0 16px
      &:hover
        opacity .7
      &:focus
        opacity 1
    .searchbar-search-btn
      position absolute
      top 7px 
      right 15px
      &:hover
        opacity .7
</style>

