/*
 * @Desc: 素材库弹窗组件（通过iframe调用素材库页面）
 */
<template>
  <div class="material-library mask clickable" v-show="visible" @click="_maskClick">
    <div class="material-library-wrapper">
      <close-button class="material-library-close" @click.native="_closeButtonClick"></close-button>
      <iframe
        ref="MaterailLibrary"
        class="iframe-wrapper" 
        allowtransparency="yes" 
        scrolling="yes"
        frameborder="0" 
        :src="origin + '/static/material-library/index.html?token=' + token + '&userId=' + userId + '&showFlag=true'+'&host='+ origin">
      </iframe>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CloseButton from 'base/close-button'
  export default {
    name: 'MaterialLibrary',
    components: {
      CloseButton,
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
      token: {
        type: String,
        required: true
      },
      userId: {
        type: [String, Number],
        required: true
      }
    },
    data: function() {
      return {
        origin: document.location.origin
      }
    },
    methods: {
      _closeButtonClick: function() {
        // 关闭按钮点击后清空正在播放的视频文件,同时模拟点击第一个tab按钮
        this.$refs.MaterailLibrary.contentWindow.document.getElementById('VideoBox') && (this.$refs.MaterailLibrary.contentWindow.document.getElementById('VideoBox').innerHTML = "")
        this.$refs.MaterailLibrary.contentWindow.document.getElementsByClassName("tab-item")[0].click()

        // 隐藏iframe
        this.$emit('update:visible', false)
      },

      /** 
       * mask背景层点击
      */
      _maskClick: function() {
        // 隐藏iframe
        this.$emit('update:visible', false)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .material-library
    .material-library-wrapper
      width 1450px
      height 760px
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      @media screen and (max-width:1600px)
        width 1000px
        height 600px 
      .material-library-close
        position absolute
        top 20px
        right 30px
        @media screen and (max-width:1600px)
          top 10px
      .iframe-wrapper  
        width 1450px
        height 760px
        @media screen and (max-width:1600px)
          width 1000px
          height 600px 
</style>


