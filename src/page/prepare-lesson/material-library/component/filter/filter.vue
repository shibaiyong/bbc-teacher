<template>
  <div class="material-library-filter">
    <div class="filter-item">
      <span class="filter-title">领域</span>
      <ul class="filter-list">
        <li 
          class="filter-list-item" 
          :class="{ 'active': domain.chapterOneId === activeDomainId }" 
          v-for="domain in filterList" 
          :key="domain.chapterOneId"
          @click="_domainClick(domain)">
          {{ domain.chapterOneTitle }}
        </li>
      </ul>
    </div>
    <div class="filter-item">
      <span class="filter-title">主题</span>
      <ul class="filter-list">
        <template 
          v-for="domain in filterList" 
          v-if="domain.chapterOneId === activeDomainId">
          <li 
            class="filter-list-item" 
            :class="{ 'active': theme.chapterTwoId === activeThemeId }" 
            v-for="theme in domain.chapterTwoList" 
            :key="theme.chapterTwoId"
            @click="$emit('update:activeThemeId', theme.chapterTwoId)">
            {{ theme.chapterTwoTitle }}
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'MaterialLibraryFilter',
    props: {
      filterList: {
        type: Array
      },
      activeDomainId: {
        type: Number
      },
      activeThemeId: {
        type: Number
      }
    },
    methods: {
      _domainClick: function(domain) {
        this.$emit('update:activeDomainId', domain.chapterOneId)
        this.$emit('update:activeThemeId', domain.chapterTwoList[0].chapterTwoId)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .material-library-filter
    margin 15px 30px 0
    padding-bottom 5px
    border-bottom 1px solid #eee
    .filter-item
      .filter-title
        float left
        line-height 30px
        width 6%
        vertical-align top
        color #269856
      .filter-list
        width 94%
        display inline-block
        .filter-list-item
          float left
          color #999999
          padding 4px 14px
          margin-bottom 5px
          height 100%
          margin-right 5px
          border-radius 15px
          text-align center
          cursor pointer
          &.active, &:hover
            background-color #36a16f
            color #fff
</style>


