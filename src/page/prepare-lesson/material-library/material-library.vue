/** 
 * @Desc: 素材库子页面
 */
<template>
  <content-box>
    <!-- S 素材库页面 -->
    <div class="material-library">
      <!-- loading -->
      <v-loading v-show="loadingVisible"></v-loading>

      <!-- S 头部 -->
      <lesson-header>
        <searchbar 
          @search="_search" 
          placeholder="请输入搜索关键字" 
          ref="searchbar">
        </searchbar>
        <div 
          class="reset-btn clickable hover-light" 
          v-if="isSearch" 
          @click="_backFilterPage">
          <v-icon 
            class="reset-icon" 
            type="icon-reset" 
            size="16">
          </v-icon>
        </div>
      </lesson-header>
      <!-- E 头部 -->

      <!-- S 页面内容区 -->
      <div class="content-wrapper">
        <!-- S 筛选器 -->
        <v-filter 
          v-if="!isSearch && filterList.length"
          :filterList="filterList"
          :activeDomainId.sync="filter.activeDomainId"
          :activeThemeId.sync="filter.activeThemeId">
        </v-filter>
        <!-- E 筛选器 -->

        <!-- S 视频列表 -->
        <ul class="video-list clear-float">
          <video-item 
            v-for="(item, index) in materialList" 
            :key="index"
            :cover="item.path + item.coverUrl"
            :title="item.resourceTitle"
            :resourceUrl="item.path + item.resourceFileUrl"
            @showVideo="_showVideo(item)">
            <v-icon 
              class="hover-light"
              slot="icon" 
              size="15"
              :type="item.hasCollected ? 'icon-collection-active' : 'icon-collection-inactive'"
              @click.native="_collectClick(item)">
            </v-icon>
          </video-item> 
        </ul>
        <!-- E 视频列表 -->
      </div>
      <!-- E 页面内容区 -->

      <!-- S 分页 -->
      <Page
        v-show="materialList.length"
        class="paging"
        size="small"
        :current="filter.filterPageIndex"
        :page-size="filter.filterPageSize"
        :total="materialTotal"
        @on-change="_filterPageChange">
      </Page>
      <!-- E 分页 -->
    </div>
    <!-- E 素材库页面 -->
        
    <!-- S 视频预览 -->
    <viewer-video 
      :visible.sync="viewerVideoVisible"
      :isMaterial="true"
      :videoObj="videoObj"
      :videoId ="resId"
      :videoCover="resCover"
      :videoUrl="videoResource">
    </viewer-video>
      <!-- :videoObj="" -->
    <!-- E 视频预览 -->
  </content-box>
</template>

<script type="text/ecmascript-6">
  import Searchbar from 'component/searchbar'
  import ContentBox from 'component/content-box'
  import LessonHeader from 'component/lesson-header'
  import VFilter from './component/filter'
  import VideoItem from 'component/video-item'
  import ViewerVideo from 'base/viewer-video'
  import { 
    requestGetMaterialFilter, 
    requestGetMaterials,
    requestCollectMaterial,
    requestCancelCollectMaterial
  } from 'api/material-library'
  export default {
    name: 'MaterialLibrary',
    components: {
      ContentBox,
      LessonHeader,
      VFilter,
      VideoItem,
      ViewerVideo,
      Searchbar
    },
    data: function() {
      return {
        // 当前页面
        isSearch: false,
        // 视频预览显示状态
        viewerVideoVisible: false,
        // 素材列表
        materialList: [],
        materialTotal: 0,
        // 过滤器列表
        filterList: [],
        // 筛选器条件
        filter: {
          type: 1,
          activeDomainId: '',
          activeThemeId: '',
          filterPageSize: 30,
          filterPageIndex: 1,
          searchPageSize: 30,
          searchPageIndex: 1,
          searchKeyword: '',
        },
        loadingVisible: false,
        // 视频播放
        videoResource: '',
        videoCover: '',
        videoObj: {},
        resId: '',
        resCover: ''
      }
    },
    computed: {
      activeThemeId: function() {
        return this.filter.activeThemeId
      }
    },
    watch: {
      activeThemeId: function() {
        this.filter.filterPageIndex = 1
        this._getMaterialList()
      },
      /** 
       * 监听弹窗是否显示，进行不同的数据操作
      */
      viewerVideoVisible: function(val) {
        if (!val) {
          this.resCover = ''
          this.videoResource = ''
        }
      }
    },
    methods: {
      /**
       * 收藏按钮点击
       */
      _collectClick(item) {
        if (item.hasCollected) {
          this._cancelCollectMaterial(item.resourceId)
        }
        else {
          this._collectMaterial(item.resourceId)
        }
      },

      /**
       * 收藏素材
       */
      _collectMaterial: function(materialId) {
        requestCollectMaterial(materialId)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestCollectMaterial SUCCESS', res)
              this.isSearch ? this._getMaterialList(this.filter.searchKeyword) : this._getMaterialList() 
            }
            else {
              // console.log('requestCollectMaterial FAIL', res)
            }
          })
          .catch(err => {
            // console.log('requestCollectMaterial FAIL', err)
          })
      },

      /**
       * 取消收藏素材
       */
      _cancelCollectMaterial: function(materialId) {
        requestCancelCollectMaterial(materialId)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestCollectMaterial SUCCESS', res)
              this.isSearch ? this._getMaterialList(this.filter.searchKeyword) : this._getMaterialList() 
            }
            else {
              // console.log('requestCollectMaterial FAIL', res)
            }
          })
          .catch(err => {
            // console.log('requestCollectMaterial FAIL', err)
          })
      },

      /**
       * 回到筛选器页面
       */
      _backFilterPage: function() {
        this.isSearch = false
        this.$refs.searchbar.keyword = ''
        this._getMaterialList()
      },

      /**
       * 筛选器页面页码改变
       * @param pageIndex(Number) 新页码
       */
      _filterPageChange: function(pageIndex) {
        this.filter.filterPageIndex = pageIndex
        this._getMaterialList()
      },

      /**
       * 搜索页面页码改变
       * @param pageIndex(Number) 新页码
       */
      _searchPageChange: function(pageIndex) {
        this.filter.searchPageIndex = pageIndex
        this._getMaterialList(this.filter.searchKeyword)
      },

      /**
       * 预览视频
       * @param resource(String) 视频url
       */
      _showVideo: function(item) {
        // console.log('item:', item)
        this.videoResource = ''
        this.videoObj = item
        this.videoResource = item.resourceFileUrl
        this.videoCover = item.coverUrl
        this.resId = item.resourceId
        this.resCover = '/' + item.coverUrl
        this.viewerVideoVisible = true
        // console.log('item.videoResource:', this.videoResource)
      },

      /**
       * 搜索素材
       * @param keyword(String) 关键字
       */
      _search: function(keyword) {
        this.isSearch = true
        this.filter.searchKeyword = keyword
        this._getMaterialList(keyword)
      },

      /**
       * 获取素材列表
       * @param keyword(String) 筛选页不传参数，搜索则传关键字
       */
      _getMaterialList: function(keyword) {
        this.loadingVisible = true
        this.materialList = []
        requestGetMaterials(this.filter, keyword) 
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)
            if (res.code === 200) {
              // console.log('requestGetMaterials SUCCESS', res)
              this.materialList = res.data.datas
              this.materialTotal = res.data.totalCount
            }
            else {
              // console.log('requestGetMaterials FAIL', res)
            }
          })
          .catch(err => {
            // console.log('requestGetMaterials FAIL', res)
          })
      },

      /**
       * 获取筛选器数据
       */
      _getMaterialFilter: function() {
        this.loadingVisible = true
        requestGetMaterialFilter(this.filter.type)
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)
            if (res.code === 200) {
              // console.log('requestGetMaterialFilter SUCCESS', res)
              this.filter.activeDomainId = res.data[0].chapterOneId
              this.filter.activeThemeId = res.data[0].chapterTwoList[0].chapterTwoId
              this.filterList = res.data
            }
            else {
              // console.log('requestGetMaterialFilter FAIL:', res)
            }
          })
          .catch(err => {
            // console.log('requestGetMaterialFilter FAIL:', err)
          })
      },
    },
    mounted: function() {
      this._getMaterialFilter()
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .material-library
    height 100%
    font-size 14px
    position relative
    .reset-btn
      display inline-block
      width 30px
      height 30px
      line-height 30px
      text-align center
      margin-left 5px
      vertical-align middle
      border-radius 50%
      background-color #966023
      .reset-icon
        line-height 30px
    .content-wrapper
      position absolute
      top 60px
      right 0
      bottom 48px
      left 0
      overflow-y auto
      .video-list
        top 130px
    .paging
      position absolute
      bottom 12px
      left 50%
      transform translateX(-50%)
</style>
