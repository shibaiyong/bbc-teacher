/** 
 * @Desc: 首页页面
 */
<template>
  <div class="home">
    <v-header></v-header>
    <div class="content-box clear-float">
      <div class="home-section float-left">
        <div class="section-name">今日课程</div>
        <home-item 
          :courseObj="courseData.todayData.length > 0 ? courseData.todayData[0] : {}" 
          :type="'today'">
        </home-item> 
        <home-item 
          :courseObj="courseData.todayData.length > 1 ? courseData.todayData[1] : {}" 
          :type="'today'" 
          class="item-margin">
        </home-item> 
      </div>

      <div class="home-section float-right">
        <div class="section-name">近期课程</div>
        <home-item 
          :courseObj="courseData.futureData.length > 0 ? courseData.futureData[0] : {}" 
          :type="'next'">
        </home-item> 
        <home-item 
          :courseObj="courseData.futureData.length > 1 ? courseData.futureData[1] : {}" 
          :type="'next'" 
          class="item-margin">
        </home-item>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import HomeItem from './component/home-item'
  import { requestGetIndexData } from 'api/home'
  export default {
    name: 'Home',
    components: {
      HomeItem
    },
    data: function() {
      return {
       courseData: {
         todayData: [],
         futureData: []
       }
      }
    },
    created: function() {
      this._getIndexData()
    },
    methods: {
     /**
      * 获得首页数据
      */ 
      _getIndexData: function() {
        requestGetIndexData()
          .then( res => {
            if (res.code == 200) {
              this.courseData.todayData = res.data.todayData
              this.courseData.futureData = res.data.futureData
            }
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  .home
    height 100%
    background url(../../image/bottom-bg1.png) no-repeat 0 bottom, url(../../image/top-bg3.png) no-repeat 0 top 
    .content-box
      width 1105px
      height 640px
      margin 20px auto 0
      .home-section
        position relative
        width 504px
        height 639px
        background-image url(./img/item-bg.png)
        background-size 100%
        background-repeat no-repeat
        .section-name
          width 205px
          height 54px
          line-height 54px
          text-align center
          margin 10px auto 0
          font-size 33.25px
          color #69381c
          font-family 'happy zcool'
        .item-margin
          margin-top 95px  

  @media screen and (max-width: 1600px)
    .home
      background url(../../image/bottom-grassland.png) no-repeat 0 bottom, url(../../image/top-bg2.png) no-repeat 0 top 
      .content-box
        width 800px
        height 475px
        margin 0 350px auto
        .home-section
          position relative
          width 380px
          height 475px
          background-image url(./img/item-bg.png)
          background-repeat no-repeat
          .section-name
            margin 0 auto
            font-size 25px
          .item-margin
            margin-top 65px  
</style>

