require(['config', 'util'], function(config, _util) {

  window.materialIframeVM = new Vue({
    el: '#app',
    data: {
      flags: {
        insertFlag: true,  // 插入按钮flag
        resetBtnFlag: false, // 重置按钮flag
        disabledBtnFlag: false,  // 插入按钮不可点击
        typeFlag: false,
        subjectFlag: false,
        collectFlag: false  //收藏的标识
      },
      // 当前点击的tab的下标
      activeIndex: 0,
      // 平台资源的数组
      materialList: [],
      // 收藏的数组
      collectionList: [],
      // 云盘数据
      cloudList: [],
      // 级联选择的文字
      selectValue: '请选择',
      // 类别数据 
      typeOptions: [],
      // 所需要的当前类别的主题数据
      subjectOptions: [],
      // 当前点击的对象
      itemInfo: {},
      // 用户获取数据的查询对象
      queryParam: {
        pageNum: 1,
        pageSize: 30,
        chapterOneId: '',
        chapterTwoId: '',
        search: ''
      },
      // 收藏的参数
      collectedParam: {
        pageNum: 1,
        pageSize: 30
      },
      hasDataFlag: false ,// 是否有查询的数据
      resourceUrl: '',
      hostUrl: document.location.origin,

      // h5数据
      enValue: '',
      zhValue: '',
      enAndzhValue: '',
      videoUrl: '',
      coverUrl: '',
      tValue: '',
      resourceId: '0',
      videoObj: {}
    },
    mounted: function () {
      this._insertBtnShow()
      this._getMaterialData(0)
    },
    methods: {
      /** 
       * 根据传来的参数showFlag的值来显示按钮，vue中添加，控件端使用true 
       */
      _insertBtnShow: function () {
        _util.getQueryString('host') &&( this.hostUrl = _util.getQueryString('host'))
        _util.getQueryString('showFlag') == null ? this.flags.insertFlag = true : this.flags.insertFlag = false

        // for本地测试，显示插入按钮
        // _util.getQueryString('showFlag') == null ? this.flags.insertFlag = false : this.flags.insertFlag = true
      },
  
      /** 
       * 还原默认的基础数据 
       */
      initData: function() {
        this.queryParam.chapterOneId = ''
        this.queryParam.chapterTwoId = ''
        this.queryParam.search = ''
        // 清空当前的信息对象
        this.itemInfo = {}
      },
  
      /** 
       * 切换到平台资源
       * @param {Number} i:当前下标
       */
      _getMaterialData: function (i) {
        this.activeIndex = i
        // 还原默认的数据
        this.initData()
        // 获得平台的数据
        this._getMaterialList(this.queryParam)
        // 获取下拉列表数据
        this._getTypeAndSubjectList()
      },
  
      /** 
       * 请求获取平台资源列表
       * @param {object} obj: 默认的参数 
       */
      _getMaterialList: function (obj) {
        const that = this
        const data = obj
        _util.request({
          url: config.baseURL + '/api/v2/material/1',
          token: _util.getQueryString('token'),
          data: data,
          success: function (response) {
            // 有结果数据
            if (response.datas.length > 0) {
              that.hasDataFlag = true
              // 加载视频数据
              that.materialList = response.datas

              // 确保第一个点击
              if(that.materialList.length>0) {
                that.$nextTick(() => {
                  // 设置第一个资源的图标点击
                  that._showDetail(that.materialList[0])
                })
              }
             
              // 设置分页的数据，同时初始化分页
              let totalData = response.totalCount
              let current = response.pageNum
              $(".platform-pagination").pagination({
                mode: 'fixed',
                isHide: true,
                current: current,
                count: 5,
                coping: false,
                totalData: totalData,
                showData: 30,
                callback: function(api) {
                  that.queryParam.pageNum = api.getCurrent()
                  // 重新获取数据
                  that._getMaterialList(that.queryParam)
                }
              })
            } else {
              that.hasDataFlag = false
              that.materialList = []
            }
          }
        })
      },
  
      /** 
       * 请求获取类别和主题下拉列表
       */
      _getTypeAndSubjectList: function () {
        const that = this
        _util.request({
          url: config.baseURL + '/api/v2/materialType/1',
          token: _util.getQueryString('token'),
          success: function (res) {
            that.typeOptions = res
          }
        })
      },
  
      /** 
       * 搜索图标点击 
       */
      _searchClick: function() {
        if (this.queryParam.search != '') {
          this._getMaterialList(this.queryParam)
          this.flags.resetBtnFlag = true
        }
      },
  
      /** 
       * 重置按钮点击 
       */
      _resetClick: function() {
        this.initData()
        this._getMaterialList(this.queryParam)
        this.flags.resetBtnFlag = false
      },

      /** 
       * 获得当前鼠标移入的类别数据
       * @param {Object} obj:当前项的item
       * @param {String} key:当前项的key值
      */
      _getTypeData: function(obj) {
        // 获取主题数据
        this.subjectOptions = obj.chapterTwoList
        // 显示当前的种类值
        this.selectValue = obj.chapterOneTitle
        // 设置chapterOneId
        this.queryParam.chapterOneId = obj.chapterOneId
        this.queryParam.pageNum = 1
        // 默认给主题Id赋予第一个内容的Id 
        this.queryParam.chapterTwoId =  this.subjectOptions[0].chapterTwoId
        this.flags.subjectFlag = true
      },

      /** 
       * 鼠标移出类别div，隐藏两个ul
       */
      _hidetSelectUl: function() {
        this.flags.typeFlag = this.flags.subjectFlag = false
      },
  
      /** 
       * 获得主题的数据
       * @param {Object} item: 当前点击的参数
       */
      _getSubjectData: function (item) {
        this.selectValue  += '\/' + item.chapterTwoTitle
        this.queryParam.chapterTwoId = item.chapterTwoId
        this.queryParam.pageNum = 1
        this.flags.typeFlag = this.flags.subjectFlag = false
        this._getMaterialList(this.queryParam)
      },
  

      /** 
       * 添加收藏 
       */
      _postMaterial: function(materialId){
        const that = this
        _util.request({
          method: 'post',
          url: config.baseURL + `/api/v2/material/${materialId}/collected`,
          token: _util.getQueryString('token'),
          success: function (res) {
            // that._getMaterialList(that.queryParam)
          }
        })
      },

      /** 
       * 取消收藏 
       */
      _deleteMaterial: function(materialId){
        const that = this
        _util.request({
          method: 'delete',
          url: config.baseURL + `/api/v2/material/${materialId}/collected`,
          token: _util.getQueryString('token'),
          success: function (response) {
          }
        })
      },

      /** 
       * 平台资源的收藏状态切换
       * @param {object} item: 当前的资源对象
       */
      _changeCollectedStatus: function (item) {
        this.flags.collectFlag = item.hasCollected
        this.flags.collectFlag ? this._deleteMaterial(item.resourceId) : this._postMaterial(item.resourceId)
        item.hasCollected = !item.hasCollected
        item.hasCollected == true ? (this.collectText = '已收藏') : (this.collectText = '收藏')
      },

      /** 
       * 收藏模块的取消收藏 
       */
      _removeCollectedStatus: function(item) {
        const that = this
        _util.request({
          method: 'delete',
          url: config.baseURL + `/api/v2/material/${item.resourceId}/collected`,
          token: _util.getQueryString('token'),
          success: function (response) {
            that._getCollctionList(that.collectedParam)
          }
        })
      },

      /** 
       * 清空默认的大视频
      */
     _removeInitVideo: function() {
      this.videoObj.stop && this.videoObj.stop()
      document.getElementById("VideoBox").innerHTML = '' 
    },
  
      /** 
       * 点击资源图片，右侧显示具体内容
       * @param {object} item: 当前的资源对象
       */
      _showDetail: function (item) {
        // console.log('item:', item)
        this.itemInfo = {}
        this.itemInfo = item
        // 如果是视频资源，就先清空embed,在重新添加embed
        if (item.coverUrl && item.resourceFileUrl) {
          // 清空视频播放的方法
          this._removeInitVideo()
          document.getElementById('VideoBox').innerHTML= '<video id="videoEle" style="width: 100%;height: 100%"></video>'

          // 这里有视频来源类型的判断和区分操作(type字段)
          if (Number(item.type) === 2) {
            let fileUrl = encodeURI(item.resourceFileUrl)
            this.videoUrl = `/material/resourceAuthentication/${item.resourceId}/${fileUrl}`
          }
          if (Number(item.type) === 3){
            let fileUrl = encodeURI(item.resourceFileUrl)
            this.videoUrl = `/resourceAuthentication/${fileUrl}`
          }
          this.coverUrl = `/${item.coverUrl}`
          this.tValue = _util.getQueryString('token')

          // DOM更新
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
              temp.videouri = this.videoUrl
              temp.videoposter = this.coverUrl
              temp.t = 'bearer ' + this.tValue
              // console.log('H5temp:', temp)
              // 给视频对象进行配置
              let ss = window.Module.createViewBoxPlayer(temp)
              ss.play()   
              this.videoObj = ss 
            } 
          })
        }
      },
      
      /** 
       * 切换到我的收藏
       */
      _getCollectionData: function (i) {
        this.activeIndex = i
        this._getCollctionList(this.collectedParam)
      },

      /** 
       * 请求获得收藏的数据 
       */
      _getCollctionList: function(obj) {
        const data = obj
        const that = this
        _util.request({
          url: config.baseURL + `/api/v2/material/collected`,
          data: data,
          token: _util.getQueryString('token'),
          success: function (response) {
            // 有结果数据
            if (response.datas.length > 0) {
              that.hasDataFlag = true
              // 加载视频数据
              that.collectionList = response.datas

              // 确保第一个点击
              if(that.collectionList.length>0) {
                that.$nextTick(() => {
                  // 设置第一个资源的图标点击
                  that._showDetail(that.collectionList[0])
                })
              }
             
              // 设置分页的数据，同时初始化分页
              let totalData = response.totalCount
              let current = response.pageNum
              $(".collection-pagination").pagination({
                mode: 'fixed',
                isHide: true,
                count: 5,
                current: current,
                coping: false,
                totalData: totalData,
                showData: 30,
                callback: function(api) {
                  that.collectedParam.pageNum = api.getCurrent()
                  // 重新获取数据
                  that._getCollctionList(that.collectedParam)
                }
              })
            } else {
              that.hasDataFlag = false
              that.collectionList = []
            }
          }
        })
      },
     
      /** 
       * 送资源的信息给控件端
       * @param {Object} item: 当前数据对象
       */
      _sendResourceInfo: function (item) {
        // console.log('send:', item)
        let origin = item.path
        let msg, videoFile
        if (this.itemInfo.resourceFileUrl && this.itemInfo.coverUrl) {
          // 去掉.vs4后缀
          videoFile = this.itemInfo.resourceFileUrl.substring(0, this.itemInfo.resourceFileUrl.indexOf('.vs4'))
          // console.log('videoFile:', videoFile)
          msg = 'EDD8A741-E48B-42A4-8773-1CCA60AAD5AA' + origin + this.itemInfo.resourceFileUrl 
            + '\`' + origin + this.itemInfo.coverUrl 
            + '\`' + videoFile

          // 以后可能会用到的视频展示页面
          // + this.hostUrl +'/static/material-library/video.html?video=true&coverUrl=' + this.itemInfo.coverUrl + '&resourceUrl=' + this.itemInfo.resourceFileUrl   
        }
        if (this.itemInfo.fileUrl) {
          msg = 'EDD8A741-E48B-42A4-8773-1CCA60AAD5AA' + this.itemInfo.fileUrl 
           + '\`' + this.hostUrl + '/static/res/img/video.png'
           + '\`' + this.itemInfo.fileUrl 
          
          // 以后可能会用到的视频展示页面
          //  + this.hostUrl +'/static/material-library/video.html?video=false&coverUrl='+this.itemInfo.fileUrl 
        }
        // 控制台输出信息，方便控件端接收
        console.error(msg)
      },
  
      /** 
       * 获得备课云盘的数据
       */
      _getCloudDiskData: function(i) {
        this.activeIndex = i
        // 关键点，解决this的指向问题
        const that = this
        _util.request({
          url: config.baseURL + '/api/v2/storage',
          token: _util.getQueryString('token'),
          success: function (response) {
            if (response.fileList.length == 0 && response.folderList.length == 0) {
              that.hasDataFlag = false
            } else {
              that.hasDataFlag = true
              that.cloudList= [].concat(response.folderList, response.fileList)
              if(that.cloudList.length) {
                // 点击第一个文件
                that._fileItemClick(that.cloudList[0])
                // 如果不是空文件夹
                if (that.cloudList[0].folderData && that.cloudList[0].folderData[0]){
                  that.getItemInfo(that.cloudList[0].folderData[0])
                  $($('.file-item')[0]).find('.icon-arrow').toggleClass('icon-arrow-transform')
                  $($('.file-item')[0]).find('.child-ul').slideDown()
                }
              }
            }
          }
        })
      },
  
      /** 
       * 点击第一层文件
       * @param {object} item: 当前点击的文件信息
       */
      _fileItemClick: function(item) {
        this.itemInfo = {}
        this.itemInfo = item
        
        // 如果点击的是文件夹,同时文件夹下面有其他的文件
        if(item.isFolder && item.folderData && item.folderData.length>0) {
          // 文件夹打开
          $(event.currentTarget).find('.icon-arrow').toggleClass('icon-arrow-transform')
          $(event.currentTarget).siblings('.child-ul').slideToggle()
          $(event.currentTarget.parentNode).siblings().find('.icon-arrow').addClass('icon-arrow-transform')
          $(event.currentTarget.parentNode).siblings().find('.child-ul').slideUp()
          this.$nextTick( () => {
            // 点击当前的第一个子文件
            this.getItemInfo(item.folderData[0])
          })
        }

        // 如果点击的是单个文件
        if(!item.isFolder && item.fileMime) {
          if(item.fileMime === 'mp4' || item.fileMime === 'ogg' || item.fileMime === 'webm') {
            // let poster = document.location.origin + '/show/1/cw/6FA2BC9BD508D30A246C391DF75881F5.jpg'

            // MP4的预加载图属性设置
            let poster = ''
            // 设置poster属性的值，来设置对应视频的图片
            setTimeout( () => {
              this.$refs.videoElement.setAttribute('poster', poster)
            }, 50)
          }
        }

        // 根据item的类型显示插入按钮
        if (item.fileMime === 'mp4' || item.fileMime === 'ogg' || item.fileMime === 'webm' || item.fileMime === 'jpg' || item.fileMime === 'png')
          this.flags.disabledBtnFlag = true
        else this.flags.disabledBtnFlag = false
      },
  
      /** 
       * 点击文件夹的文件
       * @param {object} item: 当前点击的文件信息
       */
      getItemInfo: function(item) {
        this.itemInfo = {}
        this.itemInfo = item
        if(item.fileMime === 'mp4' || item.fileMime === 'ogg' || item.fileMime === 'webm') {
          let poster = document.location.origin + '/show/1/cw/6FA2BC9BD508D30A246C391DF75881F5.jpg'
          // 设置poster属性的值，来设置对应视频的图片
          setTimeout( () => {
            this.$refs.videoElement.setAttribute('poster', poster)
          }, 50)
        }
         // 根据item的类型显示插入按钮
        if (item.fileMime === 'mp4' || item.fileMime === 'ogg' || item.fileMime === 'webm' || item.fileMime === 'jpg' || item.fileMime === 'png')
          this.flags.disabledBtnFlag = true
        else this.flags.disabledBtnFlag = false
      }
    }
  })
})
