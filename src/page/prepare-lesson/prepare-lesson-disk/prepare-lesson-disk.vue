/** 
 * @Desc: 备课云盘子页面
 */
<template>
  <content-box>
    <div class="prepare-lesson-disk">
      <v-loading v-show="loadingVisible"></v-loading>
      <!-- S 头部按钮 -->
      <div class="buttons">
        <Button 
          v-show="createBtnVisible"
          style="margin-right:8px;"
          @click.native="createFolderDialogVisible = true">
          <v-icon size="14" type="icon-create-folder" style="margin-right:6px;"/>新建
        </Button>
        <Button 
          @click.native="$refs.uploadFileInput.click()"
          style="margin-right:8px;">
          <v-icon size="14" type="icon-upload" style="margin-right:6px;"/>上传
          <input 
            ref="uploadFileInput" 
            type="file" 
            multiple="multiple" 
            @change="_handleUploadFile" 
            hidden />
        </Button>
        
        <Button 
          type="ghost"
          v-show="buttonVisible.download"
          @click="_handleLoadFile"
          style="margin-right:8px;">
          <v-icon size="14" type="icon-download" style="margin-right:6px;"/>下载
        </Button> 
       
        <Button 
          type="ghost"
          v-show="buttonVisible.delete"
          style="margin-right:8px;"
          @click.native="deleteFileDialogVisible = true">
          <v-icon size="14" type="icon-remove" style="margin-right:6px;"/>删除
        </Button>
        <Button 
          type="ghost"
          v-show="buttonVisible.copy"
          style="margin-right:8px;"
          @click.native="_moveOrCopyFileClick(false)">
          <v-icon size="14" type="icon-copy" style="margin-right:6px;"/>复制到
        </Button>
        <Button 
          type="ghost"
          v-show="buttonVisible.move"
          style="margin-right:8px;"
          @click.native="_moveOrCopyFileClick(true)">
          <v-icon size="14" type="icon-move" style="margin-right:6px;"/>移动到
        </Button>
        <Button 
          type="ghost"
          v-show="buttonVisible.rename"
          style="margin-right:8px;"
          @click.native="_renameFileClick">
          <v-icon size="14" type="icon-rename" style="margin-right:6px;"/>重命名
        </Button>
      </div>
      <!-- E 头部按钮 -->

      <!-- 面包屑 -->
      <v-crumb
        :folderName="curAccessFolderName"
        @accessRoot="_accessRoot">
      </v-crumb>
  
      <!-- S 文件列表 -->
      <file-list 
        :fileList="fileList"
        :checkAll.sync="checkAll"
        :sortType="sortType"
        @fileSort="_fileSort"
        @accessFile="_accessFile"
        @checkAllChange="_checkAllChange"
        @fileSelectChange="_fileSelectChange"
        @singleFileSelectchange="_singleFileSelectChange">
      </file-list>
      <!-- E 文件列表 -->

      <!-- S 新建文件夹对话框 -->
      <Modal
        title="新建文件夹"
        v-model="createFolderDialogVisible"
        @on-ok="_handleCreateFolder"
        @on-cancel="$refs['createFolderForm'].resetFields()">
        <Form 
          :model="createFolderForm"
          :rules="createFolderFormRule"
          :labelWidth="110"
          ref="createFolderForm"
          style="padding:0 30px;">
          <FormItem
            label="文件夹名称"
            prop="folderName">
            <Input 
              size="large"
              v-model="createFolderForm.folderName" 
              placeholder="请输入文件夹名称"/>
          </FormItem>
        </Form>
      </Modal>
      <!-- E 新建文件夹对话框 -->

      <!-- S 删除文件对话框 -->
      <Modal
        title="删除文件"
        v-model="deleteFileDialogVisible"
        :confirm="true"
        @on-ok="_handleDeleteFile">
        <v-icon 
          type="icon-prompt-error" 
          size="36" 
          color="#FC0000" 
          class="float-left" 
          style="margin-right:10px;">
        </v-icon>
        所选文件将被永久删除，可能导致已插入到课件中的文件失效，确定删除吗？
      </Modal>
      <!-- E 删除文件对话框 -->

      <!-- S 删除文件对话框 -->
      <Modal
        title="重命名文件"
        v-model="renameFileDialogVisible"
        @on-ok="_handleRenameFile"
        @on-cancel="$refs['renameFileForm'].resetFields()">
        <Form 
          :model="renameFileForm"
          :rules="renameFileFormRule"
          :labelWidth="75"
          ref="renameFileForm"
          style="padding:0 55px;">
          <FormItem
            label="文件名"
            prop="fileName">
            <Input  
              size="large"
              v-model="renameFileForm.fileName" 
              placeholder="请输入文件名称"/>
          </FormItem>
        </Form>
      </Modal>
      <!-- E 删除文件对话框 -->

      <!-- S 移动或复制到对话框 -->
      <Modal
        :title="isMove ? '移动到' : '复制到'" 
        v-model="moveOrCopyDialogVisible"
        @on-ok="_handleMoveOrCopyFile">
        <div class="move-file-content">
          <ul class="folder-list" v-if="folderList.length">
            <li class="folder-item no-wrap">
              <span 
                class="folder-name vertical-center" 
                :class="{active: moveOrCopySelectFolder === 0}"
                @click="moveOrCopySelectFolder = 0">
                <v-icon  
                  type="icon-file-folder" 
                  :size="20"
                  style="margin-right:4px;">
                </v-icon>
                全部文件
              </span>
            </li>
            <li 
              class="folder-item no-wrap" 
              v-for="folder in folderList" 
              :key="folder.id">
              <span 
                class="folder-name vertical-center"
                :class="{active: moveOrCopySelectFolder === folder.id}"
                @click="moveOrCopySelectFolder = folder.id">
                <v-icon  
                  type="icon-file-folder" 
                  :size="20"
                  style="margin-right:4px;">
                </v-icon>
                <span>{{ folder.fileName }}</span>
              </span>
            </li>
          </ul>
        </div>
      </Modal>
      <!-- E 移动或复制到对话框 -->

      <!-- S 文件上传进度对话框 -->
      <Modal
        title="上传进度"
        v-model="uploadTaskDialogVisible"
        :width="700"
        @on-cancel="_closeUploadTaskDialog">
        <div class="upload">
          <div class="upload-header file-item  clear-float">
            <Col span="10">文件名</Col>
            <Col span="4">大小</Col>
            <Col span="7">进度</Col>
            <Col span="3">状态</Col>
          </div>
          <ul class="upload-list" v-if="uploadList.length">
            <li class="file-item clear-float" v-for="(file, index) in uploadList" :key="index">
              <Col span="10" class="no-wrap" style="padding-right:20px;">{{ file.name }}</Col>
              <Col span="4" style="color:#999;">{{ file.size | fileSize }}</Col>
              <Col span="7">
                <v-progress :width="76" :percent="file.progress"></v-progress>
              </Col>
              <Col span="3">
                <span v-if="file.progress === 100 && !uploadSuccess" style="color:#f33f3f;">上传失败</span>
                <span v-else-if="file.progress === 100 && uploadSuccess" style="color:#775a23;">上传完成</span>
                <span v-else style="color:#775a23;">上传中</span>
              </Col>
            </li>
          </ul>
        </div>
        <div slot="footer" style="height:0;"></div>
      </Modal>
      <!-- E 文件上传进度对话框 -->
    </div>
  </content-box>
</template>

<script type="text/ecmascript-6">
  import VProgress from 'component/progress'
  import FileList from './component/file-list'
  import VCrumb from './component/crumb'
  import ContentBox from 'component/content-box'
  import {
    requestGetFileList,
    requestCreateFolder,
    requestUploadFile,
    requestDeleteFile,
    requestRenameFile,
    requestCopyFile,
    requestMoveFile,
    requestDownLoadFile
  } from 'api/prepare-lesson-disk'
  export default {
    name: 'PrepareLessonDisk',
    components: {
      VProgress,
      VCrumb,
      ContentBox,
      FileList
    },
    data: function() {
      return {
        // 文件列表
        fileList: [],
        // 文件夹列表
        folderList: [],
        // 选中文件列表
        selectFileList: [],
        // 当前访问文件夹
        curAccessFolderId: '',
        curAccessFolderName: '',
        // 按钮显示状态
        createBtnVisible: true,
        buttonVisible: {
          download: false,
          delete: false,
          copy: false,
          move: false,
          rename: false
        },
        // 移动到选中的文件夹id
        moveOrCopySelectFolder: 0,
        // 是否是移动到
        isMove: true,
        // 全选
        checkAll: false,
        // 新建文件夹对话框
        createFolderDialogVisible: false,
        createFolderForm: {
          folderName: ""
        },
        createFolderFormRule: {
          folderName: [
            {
              required: true,
              message: '文件夹名称不能为空',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 50,
              message: '2 至 50 个字符之间',
              trigger: 'blur'
            }
          ]
        },
        // 删除文件对话框
        deleteFileDialogVisible: false,
        // 重命名文件对话框
        renameFileDialogVisible: false,
        renameFileForm: {
          fileName: ''
        },
        renameFileFormRule: {
          fileName: [
            {
              required: true,
              message: '文件夹名称不能为空',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 50,
              message: '2 至 50 个字符之间',
              trigger: 'blur'
            }
          ]
        },
        // 移动或复制对话框
        moveOrCopyDialogVisible: false,
        // 上传进度对话框
        uploadList: [],
        uploadTaskDialogVisible: false,
        uploading: false,
        uploadSuccess: true,
        // 文件排序类型
        sortType: 1,
        // loading状态
        loadingVisible: false,
      }
    },
    watch: {
      /**
       * 监视选中文件列表数据
       * @param  {array} newValue：新值
       */
      selectFileList: function(newValue) {
        // 全选和非全选
        if (this.fileList.length !== 0) {
          this.checkAll = newValue.length === this.fileList.length ? true : false
        }
        
        // 未选中文件
        if (newValue.length === 0) {
          // 所有文件未选中
          this.buttonVisible = {
            download: false,
            delete: false,
            copy: false,
            move: false,
            rename: false
          }
        }

        // 选中单个文件
        else if (newValue.length === 1) {
          // 文件夹
          if (newValue[0].isFolder) {
            this.buttonVisible = {
              download: true,
              delete: true,
              copy: false,
              move: false,
              rename: true
            } 
          } 
          // 文件
          else {
            this.buttonVisible = {
              download: true,
              delete: true,
              copy: true,
              move: true,
              rename: true
            } 
          }
        } 

        // 选中多个文件
        else  {
          // 选中文件夹个数
          const folderList = newValue.filter(file => {
            return file.isFolder
          })
          // 都是文件
          if (folderList.length === 0) {
            this.buttonVisible = {
              download: true,
              delete: true,
              copy: true,
              move: true,
              rename: false
            } 
          }
          // 都是文件夹
          else if (folderList.length === newValue.length) {
            this.buttonVisible = {
              download: true,
              delete: true,
              copy: false,
              move: false,
              rename: false
            } 
          }
          // 文件和文件夹混合
          else {
            this.buttonVisible = {
              download: true,
              delete: true,
              copy: false,
              move: false,
              rename: false
            } 
          }
        }
      },
    },
    methods: {
      /**
       * 文件排序
       */
      _fileSort: function(type) {
        if (type === 'name') {
          this.sortType = this.sortType === 1 ? 2 : 1
        }
        if (type === 'size') {
          this.sortType = this.sortType === 3 ? 4 : 3
        }
        if (type === 'time') {
          this.sortType = this.sortType === 5 ? 6 : 5
        }
        this._getFileList()
      },

      /**
       * 全选状态改变
       */
      _checkAllChange: function(newValue) {
        // 改变文件选中状态
        for (let file of this.fileList) {
          if (file.checked !== newValue) {
            file.checked = newValue
          }
        }

        // 改变selectFileList数据
        if (newValue) {
          // 勿将fileList赋给selectFileList，会建立引用
          this.selectFileList = [].concat(this.fileList)
        } 
        else {
          this.selectFileList = []
        }
      },

      /**
       * 访问根
       */
      _accessRoot: function() {
        this.curAccessFolderId = ''
        this.curAccessFolderName = ''
        // 默认以name排序
        this.sortType = 1
        this._getFileList()
      },

      /**
       * 访问某个文件
       * @param  {object} file：当前访问的文件
       */
      _accessFile: function(file) {
        // 访问文件夹
        if (file.isFolder) {
          this.curAccessFolderId = file.id
          this.curAccessFolderName = file.fileName
          this.sortType = 1
          this._getFileList()
        }
      },

      /**
       * 关闭上传任务对话框
       */
      _closeUploadTaskDialog: function() {
        if (this.uploading) {
          this.$VMessage('info', '正在上传文件，可能会导致文件上传失败')
        }
        else {
          this.uploadList = []
        }
        this.uploadTaskDialogVisible = false
      },

      /**
       * 移动到或者复制到被点击
       * @param  {array} isMove：是否是移动
       */
      _moveOrCopyFileClick: function(isMove) {
        this.isMove = isMove
        this.moveOrCopyDialogVisible = true
        this.moveOrCopySelectFolder = 0
      },

      /**
       * 移动或删除文件
       * @param  {array} isMove：是否是移动
       */
      _handleMoveOrCopyFile: function() {
        // 请求移动文件
        if (this.isMove) {
          this._moveFile(this.moveOrCopySelectFolder, this._getSplitString())
        } 
        // 请求复制文件
        else {
          this._copyFile(this.moveOrCopySelectFolder, this._getSplitString())
        }
      },

      /**
       * 重命名按钮点击
       */
      _renameFileClick: function() {
        this.renameFileDialogVisible = true
        // 设置文件名（文件要去除后缀）
        const renameFile = this.selectFileList[0]
        let fileName = renameFile.fileName
        if (!renameFile.isFolder) {
          const mimeLength = renameFile.fileMime.length + 1
          fileName = fileName.slice(0, -mimeLength)
        }
        this.renameFileForm.fileName = fileName
      },

      /**
       * 确定重命名文件
       */
      _handleRenameFile: function() {
        // 请求文件重命名
        let fileName = this.renameFileForm.fileName
        if (!this.selectFileList[0].isFolder) {
          fileName = `${fileName}.${this.selectFileList[0].fileMime}`
        }
        // 表单校验
        this.$refs['renameFileForm'].validate((valid) => {
          if (valid) {
            // 请求文件重命名
            this._renameFile(fileName, this.selectFileList[0].id)
          } 
        })
      },

      /**
       * 删除文件
       */
      _handleDeleteFile: function() {
        // 请求删除文件
        this._deleteFile(this._getSplitString())
      },

      /**
       * 新建文件夹
       */
      _handleCreateFolder: function() {
        // 表单校验
        this.$refs['createFolderForm'].validate((valid) => {
          if (valid) {
            // 请求新建文件夹
            this._createFolder(this.createFolderForm.folderName)
          } 
        })
      },

      /**
       * 请求移动文件
       * @param  {number} folderId：目标文件夹id，根目录传0
       * @param  {string} fileIds：文件id，可多个，逗号分隔
       */
      _moveFile: function(folderId, fileIds) {
        requestMoveFile(folderId, fileIds)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestMoveFile SUCCESS', res)
              this.$VMessage('success', '文件移动成功')
              this.moveOrCopyDialogVisible = false
              this._getFileList()
            } 
            else {
              // console.log('requestMoveFile FAIL', res)
              this.$VMessage('error', '文件移动失败')
            }
          })
          .catch(err => {
            // console.log('requestMoveFile FAIL', err)
          })
      },

      /**
       * 请求复制文件
       * @param  {number} folderId：目标文件夹id，根目录传0
       * @param  {string} fileIds：文件id，可多个，逗号分隔
       */
      _copyFile: function(folderId, fileIds) {
        requestCopyFile(folderId, fileIds)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestCopyFile SUCCESS', res)
              this.$VMessage('success', '文件复制成功')
              this.moveOrCopyDialogVisible = false
              this._getFileList()
            } 
            else {
              // console.log('requestCopyFile FAIL', res)
              this.$VMessage('error', '文件复制失败')
            }
          })
      },

      /**,
       * 请求重命名文件
       * @param  {string} fileName：文件新名字
       * @param  {number} fileId：文件id
       */
      _renameFile: function(fileName, fileId) {
        requestRenameFile(fileName, fileId)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestRenameFile SUCCESS', res)
              this.$VMessage('success', '文件重命名成功')
              this.renameFileDialogVisible = false
              this._getFileList()
            } 
            else {
              // console.log('requestRenameFile FAIL', res)
              this.$VMessage('error', '文件重命名失败')
            }
          })
      },

      /**
       * 请求删除文件
       * @param  {string} fileIds：转为字符串的数组，数组中包含多个文件id
       */
      _deleteFile: function(fileIds) {
        requestDeleteFile(fileIds)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestDeleteFile SUCCESS', res)
              this.$VMessage('success', '文件删除成功')
              this.deleteFileDialogVisible = false
              this._getFileList()
            } else {
              // console.log('requestDeleteFile FAIL', res)
              this.$VMessage('error', '文件删除失败')
            }
          })
      },

      /**
       * input中的文件被选中，上传文件
       * @param  {object} ev：事件对象
       */
      _handleUploadFile: function(ev) {
        const mb = 1024 * 1024
        // 携带的文件
        const files = ev.target.files
        if (!files.length) {
          return
        }
        const uploadId =  this.uploadList.length + 1
        // formData数据
        let fileData = new FormData()
        for (let file of files) {
          // 单文件不能大于100MB
          if (file.size > 100 * mb) {
            this.$VMessage('error', '单文件不能大于100MB')
            return 
          }
          // 上传列表数据封装
          let fileObj = {
            uploadId: uploadId,
            name: file.name,
            size: file.size,
            progress: 0
          }
          this.uploadList.push(fileObj)
          fileData.append('files', file)
        }
        // 上传文件
        this.uploading = true
        const folderId = this.curAccessFolderId ? this.curAccessFolderId : 0
        this._uploadFile(folderId, fileData, uploadId)
        // 设input值为空，避免再次选中同一个文件无法触发change事件
        this.$refs.uploadFileInput.value = ''
      },

      /**
       * 上传进度回调函数
       * @param  {object} progressEvent：上传进度事件对象
       */
      _progressCb: function(progressEvent) {
        for (let file of this.uploadList) {
          if (file.uploadId === progressEvent.uploadId) {
            file.progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) 
          }
        }
      },

      /**
       * 请求上传文件
       * @param  {string} folderName：文件夹名称
       * @param  {formData} file：文件夹名称
       * @param  {function} progressCb：进度回调函数
       */
      _uploadFile: function(folderId, fileData, uploadId) {
        // console.log(this.uploadList)
        this.uploadTaskDialogVisible = true
        requestUploadFile(folderId, fileData, uploadId, this._progressCb)
          .then(res => {
            this.uploading = false
            switch (res.code) {
              // 成功
              case 200:
                // console.log('requestUploadFile SUCCESS', res)
                if (this.uploadTaskDialogVisible) {
                  this.$VMessage('success', '文件上传成功，3秒后自动关闭')
                  this.uploadSuccess = true
                  setTimeout(() => {
                    this._closeUploadTaskDialog()
                  }, 3000)
                }
                else {
                  this.$VMessage('success', '文件上传成功')
                }
                this._getFileList()
                break

              // 空间不足
              case 206:
                // console.log('requestUploadFile FAIL', res)
                this.$VMessage('error', '上传失败，云盘空间不足')
                this.uploadSuccess = false
                break

              default:
                // console.log('requestUploadFile FAIL', res)
                this.$VMessage('error', '上传失败，服务器内部错误')
                this.uploadSuccess = false
            }
          })
          .catch(err => {
            // console.log('requestUploadFile FAIL', err)
            this.uploading = false
          })
      },

      /**
       * 请求新建文件夹
       * @param  {string} folderName：文件夹名称
       */
      _createFolder: function(folderName) {
        requestCreateFolder(folderName)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestCreateFolder SUCCESS', res)
              this.$VMessage('success', '文件夹新建成功')
              this.createFolderDialogVisible = false
              this.createFolderForm.folderName = ''
              // 刷新文件列表
              this._getFileList()
            } else {
              // console.log('requestCreateFolder FAIL', res)
              this.$VMessage('error', '文件夹新建失败')
            }
          })
      },

      /** 
       * 下载文件
      */
      _handleLoadFile: function() {
        requestDownLoadFile(this._getSplitString())
      },

      /**
       * 将id组成的数组，用逗号分隔成字符串
       */
      _getSplitString: function() {
        const fileIds = this.selectFileList.map(file => {
          return file.id
        })
        return fileIds.join(',')
      },

      /**
       * 请求获取文件列表
       */
      _getFileList: function() {
        this.loadingVisible = true
        this.selectFileList = []
        this.checkAll = false
        const folderId = this.curAccessFolderId ? this.curAccessFolderId : 0
        this.createBtnVisible = folderId === 0 ? true : false
        requestGetFileList(folderId, this.sortType)
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)
            if (res.code === 200) {
              // console.log('requestGetFileList SUCCESS', res)
              // 清空文件夹列表
              if (folderId === 0) {
                this.folderList = []
              }
              this.checkAll = false
              this.fileList = res.data.map(item => {
                // 封装文件夹列表
                if (item.isFolder) {
                  this.folderList.push(item)
                }
                // 给文件添加个属性
                item.checked = false
                return item
              })
            } else {
              // console.log('requestGetFileList FAIL', res)
              this.$VMessage('error', '服务器内部错误')
            }
          })
      },

      /**
       * 文件选中状态改变
       * @param  {object} file：当前选中文件
       */
      _fileSelectChange: function(file) {
        file.checked ? this._addElement(this.selectFileList, file) : this._removeEleById(this.selectFileList, file.id)
      },

      /** 
       * 单个文件的li行点击
       * @param  {object} file：当前选中文件
      */
      _singleFileSelectChange: function(file) {
        if (file.checked) {
          this._addElement(this.selectFileList, file)
        } 
        else {
          this._removeEleById(this.selectFileList, file.id)
        }
      },

      /**
       * 添加一个元素到selectFileList
       * @param  {array} arr：目标数组
       * @param  {object} file：要添加的元素
       */
      _addElement: function(arr, file) {
        const isContain = this._contain(arr, file.id)
        if (!isContain) {
          arr.push(file)
        }
      },

      /**
       * 根据id删除数组中的一个元素
       * @param  {array} arr：目标数组
       * @param  {number} id：要删除元素的id属性
       */
      _removeEleById: function(arr, id) {
        arr.forEach(item => {
          if(item.id === id) {
            arr.splice(arr.indexOf(item), 1)
          }
        })
      },

      /**
       * 判断数组中是否有某个元素
       * @param  {array} arr：要判断的数组
       * @param  {number} id：元素的id
       */
      _contain: function(arr, id) {
        let flag = false
        arr.forEach(item => {
          if (item.id === id) {
            flag = true
          }
        })
        return flag
      },
    },
    created: function() {
      // 获取文件列表
      this._getFileList()
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  .prepare-lesson-disk 
    font-size 14px
    padding-top 20px
    .buttons
      height 40px
      padding-left 20px
  /* 移动到对话框 */
  .move-file-content
    height 220px
    overflow-y auto
    font-size 14px    
    .folder-list  
      .folder-item
        padding 3px 0
        cursor pointer
        &:not(:first-child)
          padding-left 20px
        .folder-name
          &:hover
            color #088844
          &.active
            color #088844
  /* 上传列表 */
  .upload
    font-size 14px
    color #333
    .file-item
      height 40px
      line-height 40px
    .upload-list
      border-top 1px solid #e8e7e7
      height 240px
      overflow-y auto
</style>