/*
 * @Desc: 视频全屏预览组件
 */
<template>
  <div class="viewer-video mask" v-show="visible">
    <div class="viewer-video-wrapper center" id="wrapper">
      <close-button 
        size="36"
        class="viewer-video-close"
        :isAttend="belongAttend" 
        @click.native="_closeVideo">
      </close-button>
      
      <!-- 视频的容器 -->
      <div ref="playerWrapper" style="position:relative;width:100%;height:100%;"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CloseButton from 'base/close-button'
  import cookie from 'js-cookie'

  export default {
    name: 'ViewerVideo',
    components: {
      CloseButton
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
      videoUrl: {
        type: String,
        required: true
      },
      videoObj: {
        type: Object
      },
      videoId: {
        type: [String, Number]
      },
      videoCover: {
        type: String
      },
      isMaterial: {
        type: Boolean,
        default: false
      },
      nofullscreenFlag: {
        type: Boolean,
        default: false
      },
      belongAttend: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        videoFullscreen: false,
        //H5数据
        tValue: '',
        // 字幕对象
        enValue: '',
        zhValue: '',
        enAndzhValue: '',
        // 当前资源的Id
        resourceId: '0',
        H5Obj: {}
      }
    },
    watch: {
      videoUrl: function(oldValue, newValue) {
        if (newValue !== 'undefined' || oldValue !== 'undefined') {
          // 将视频区分格式进行操作(mp4和vs4分开)
          if( newValue.indexOf('http') === 0 ) {
            let videoEle = '<video src="' + this.videoUrl + '" width="100%" height="100%" controls="controls"/>'
            this.$refs.playerWrapper.innerHTML = videoEle
          } else {
            this.$refs.playerWrapper.innerHTML = '<video id="videoEle" class="fill"></video>'
            // DOM改变
            this.$nextTick( () => {
              if (window.Module.isSupportViewBoxPlayer()) {
                var subtitleObj = {
                  "en": this.enValue,
                  "zh": this.zhValue,
                  "en&zh-cn": this.enAndzhValue
                }
                var temp = {}
                temp.subtitle = subtitleObj
                temp.wrap = document.getElementById("videoEle")
                // 是否显示全屏的按钮
                temp.nofullscreen = this.nofullscreenFlag
                // 没有vs4
                if ( this.videoUrl.indexOf('.vs4') === -1 ) {
                  let videoPath = this.videoUrl.slice(this.videoUrl.lastIndexOf('/')) + '.vs4'
                  let fileUrl = encodeURI(videoPath)
                  // 判断数据的来源，true的状态是素材库的
                  if (this.isMaterial) {
                    // console.log('没有vs.4素材库')
                    temp.videouri = `/material/resourceAuthentication/${this.videoId}${fileUrl}`
                  } else {
                    // console.log('没有vs.4不是素材库')
                    temp.videouri = `/resourceAuthentication/${this.videoId}${fileUrl}`
                  }
                }
                // 有vs4 
                else {
                  let fileUrl = encodeURI(this.videoUrl)
                  if (this.isMaterial) {
                    // 判断类型
                    if(this.videoObj.type === 2) {
                      // console.log('有vs.4素材库的素材库')
                      temp.videouri = `/material/resourceAuthentication/${this.videoId}/${fileUrl}`
                    }
                    // 素材库中的课程
                    if(this.videoObj.type === 3) {
                      // console.log('有vs.4素材库课程')
                      temp.videouri = `/resourceAuthentication/${fileUrl}`
                    }
                  } else {
                    // console.log('有vs.4课程')
                    temp.videouri = `/resourceAuthentication/${this.videoId}${fileUrl}`
                  }
                }
                temp.videoposter = `${this.videoCover}`
                temp.t = 'bearer ' +  this._getToken()
                // console.log('H5视频播放对象temp:', temp)

                if (temp.videoposter != "" && temp.videouri != "") {
                  // 给视频对象进行配置
                  let ss = window.Module.createViewBoxPlayer(temp) 
                  this.H5Obj = ss 
                }
              } 
            })
          }
        }
      },
      // 监听弹窗是否显示，显示的时候才开始调用play方法
      visible: function(newValue) {
        if (newValue) {
          let that = this
          that.$nextTick( () => {
            that._setDomStyle()
            // 设置一个定时，保证在视频数据加载之后在调用play方法（确保教师端我的收藏和素材库视频显示）
            setTimeout(() => {
              that.H5Obj.play && that.H5Obj.play()
            }, 500)
          })
        }
      }
    },
    beforeDestroy: function() {
      this.H5Obj = {}
      this.$refs.playerWrapper.innerHTML = ""
    },
    methods: {
      /** 
       * 设置DOM
      */
      _setDomStyle: function() {
        if (this.belongAttend) {
          let ele = document.querySelector('#wrapper')
          let closeEle = document.querySelector('.viewer-video-close')
          let voiceBtn = document.querySelector('#viewshareplayervolume')
          let fullBtn = document.querySelector('#viewshareplayerflsn')
          ele.style.width = screen.width + 'px'
          ele.style.height = screen.height + 'px'
          closeEle.style.top = '25px'
          closeEle.style.right = '0'
          closeEle.style.zIndex = 9
          fullBtn.style.display = 'none'
          voiceBtn.style.right = '20px'
          voiceBtn.addEventListener('click', this._setVoiceBarCSS)
        }
      },

      /** 
       * 设置音量的样式
      */
      _setVoiceBarCSS: function() {
        this.$nextTick(() => {
          let voiceBar = document.querySelector('#viewshareplayervolumebar')
          voiceBar.style.right = '20px'
        })
      },

      /**
       * 实时获取token
       */
      _getToken: function() {
        let token = cookie.get('ttoken') ? cookie.get('ttoken') : '' 
        if (token) {
          return token
        }
      },

      /**
       * 隐藏播放器
       */
      _closeVideo: function() {
        this.$emit('update:visible', false)
        // 停止视频(必须使用)
        this.H5Obj.stop && this.H5Obj.stop()
        this.H5Obj = {}
        this.videoFullscreen = false
        this.$refs.wrapper.style.width = '1067px'
        this.$refs.wrapper.style.height = '600px'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .viewer-video
    .viewer-video-wrapper
      width 1067px
      height 600px
      background-color black
      .viewer-video-close
        position absolute
        top -40px
        right -50px

  @media screen and (max-width 1600px) 
    .viewer-video
      .viewer-video-wrapper
        .viewer-video-close
          top -10px
          right -60px
</style>

