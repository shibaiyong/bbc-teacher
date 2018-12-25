/** 
 * @Desc: 我的收藏页面 
 */
<template>
  <div class="my-collection">
    <v-header></v-header>
    <content-box>
      <v-loading v-show="loadingVisible"></v-loading>
      <!-- S 视频列表 -->
      <div class="video-list-wrapper">
        <ul class="video-list">
          <video-item 
            v-for="item in materialList" 
            :key="item.resourceId"
            :cover="item.path + item.coverUrl"
            :title="item.resourceTitle"
            :resourceUrl="item.path + item.resourceFileUrl"
            @showVideo="_showVideo(item)">
            <v-icon 
              class="hover-light"
              slot="icon" 
              type="icon-remove"
              size="15"
              @click.native="_cancelCollect(item.resourceId)">
            </v-icon>
          </video-item>
        </ul>
      </div>
      <!-- E 视频列表 -->

      <!-- S 视频预览 -->
      <viewer-video 
        :visible.sync="viewerVideoVisible"
        :isMaterial="true"
        :videoId ="resId"
        :videoCover="resCover"
        :videoObj="videoInfo"
        :videoUrl="videoResource">
      </viewer-video>
      <!-- E 视频预览 -->

      <!-- S 分页 -->
      <Page
        v-show="materialList.length"
        class="paging"
        size="small"
        :current="paging.pageIndex"
        :page-size="paging.pageSize"
        :total="materialTotal"
        @on-change="_pageChange">
      </Page>
      <!-- E 分页 -->
    </content-box>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentBox from 'component/content-box'
  import VideoItem from 'component/video-item'
  import ViewerVideo from 'base/viewer-video'
  import { requestGetCollectMaterials, requestCancelCollectMaterial } from 'api/material-library'
  export default {
    name: 'MyCollection',
    components: {
      ContentBox,
      VideoItem,
      ViewerVideo
    },
    data: function() {
      return {
        viewerVideoVisible: false,
        videoResource: '',
        videoCover: '',
        videoInfo: {},
        materialTotal: 0,
        materialList: [],
        // 分页
        paging: {
          pageIndex: 1,
          pageSize: 30,
        },
        // loading状态
        loadingVisible: false,

        // 视频资源ID
        resId: '',
        resCover: ''
      }
    },
    watch: {
      viewerVideoVisible: function(val) {
        if (!val) {
          this.resCover = ''
          this.videoResource = ''
        }
      }
    },
    methods: {
      /**
       * 分页页码改变
       */
      _pageChange: function(pageIndex) {
        this.paging.pageIndex = pageIndex
        this._getCollectionMaterials()
      },

      /**
       * 预览视频
       */
      _showVideo: function(item) {
        // 清空数据
        // console.log('item:', item)
        this.videoInfo = item
        this.resId = item.resourceId
        this.resCover = '/' + item.coverUrl
        this.videoResource = item.resourceFileUrl
        this.videoCover = item.coverUrl
        this.viewerVideoVisible = true
      },

      /**
       * 取消收藏
       */
      _cancelCollect: function(materialId) {
        requestCancelCollectMaterial(materialId).then(res => {
          if (res.code === 200) {
            // console.log('requestCancelCollectMaterial FAIL', res)
            this._getCollectionMaterials()
          }
        })
      },

      /**
       * 请求收藏素材
       */
      _getCollectionMaterials: function() {
        this.loadingVisible = true
        requestGetCollectMaterials(this.paging).then(res => {
          setTimeout(() => this.loadingVisible = false, 200)
          if (res.code === 200) {
            // console.log('requestGetCollectMaterials SUCCESS', res)
            this.materialTotal = res.data.totalCount
            this.materialList = res.data.datas
          }
        })
      },
    },
    mounted: function() {
      this._getCollectionMaterials()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/mixin'
  .my-collection
    height 100%
    background url(../../image/top-bg1.png) no-repeat 0 top, url(../../image/bottom-bg2.png) no-repeat 0 bottom
    .video-list-wrapper
      position absolute
      top 0
      right 0
      bottom 50px
      left 0
      overflow-y auto
      .video-list
        margin-left -3px
        clear-float()
    .paging
      position absolute
      bottom 12px
      left 50%
      transform translateX(-50%)

  @media screen and (max-width: 1600px)
    .my-collection
      background url(../../image/bottom-grassland.png) no-repeat 0 bottom, url(../../image/top-bg2.png) no-repeat 0 top 
</style>

