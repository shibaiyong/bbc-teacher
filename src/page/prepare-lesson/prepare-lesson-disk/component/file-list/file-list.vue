/*
 * @Desc: 备课云盘文件列表
 */
<template>
  <div class="files">
    <!-- S 文件头 -->
    <div class="file-header">
      <Col span="1" class="vertical-center">
        <Checkbox 
          v-model="currentCheckAll" 
          @on-change="$emit('checkAllChange', currentCheckAll)">
        </Checkbox>
      </Col>
      <Col span="14" class="vertical-center">
        <span class="clickable vertical-center" @click="$emit('fileSort', 'name')">
          <span style="margin-right:5px;">文件名</span> 
          <v-icon v-if="sortType === 1" :multiple="true" type="icon-sort-up"/>
          <v-icon v-else-if="sortType === 2" :multiple="true" type="icon-sort-down"/>
          <v-icon v-else type="icon-sort-default"/>
        </span>
      </Col>
      <Col span="4">
        <span class="clickable vertical-center" @click="$emit('fileSort', 'size')">
          <span style="margin-right:5px;">大小</span> 
          <v-icon v-if="sortType === 3" :multiple="true" type="icon-sort-up"/>
          <v-icon v-else-if="sortType === 4" :multiple="true" type="icon-sort-down"/>
          <v-icon v-else type="icon-sort-default"/>
        </span>
      </Col>
      <Col span="5">
        <span class="clickable vertical-center" @click="$emit('fileSort', 'time')">
          <span style="margin-right:5px;">修改时间</span> 
          <v-icon v-if="sortType === 5" :multiple="true" type="icon-sort-up"/>
          <v-icon v-else-if="sortType === 6" :multiple="true" type="icon-sort-down"/>
          <v-icon v-else type="icon-sort-default"/>
        </span>
      </Col>
    </div>
    <!-- E 文件头 -->

    <!-- S 文件列表 -->
    <div class="file-list">
      <ul>
        <li 
          class="file-item clickable" 
          v-for="file in fileList"
          :key="file.id">
          <Col span="1" class="vertical-center">
            <Checkbox 
              v-model="file.checked"
              @on-change="$emit('fileSelectChange', file)">
            </Checkbox>
          </Col>
          <Col span="14" class="vertical-center file-name" @click.native="_fileLiClick(file)">
            <v-icon 
              v-if="file.isFolder"
              type="icon-file-folder"
              size="22"
              :multiple="true"
              style="margin-right:7px;"/>
            <v-icon 
              v-else
              :type="{ 
                'icon-file-txt': regular.txt.test(file.fileMime),
                'icon-file-png': regular.png.test(file.fileMime),
                'icon-file-video': regular.video.test(file.fileMime),
                'icon-file-music': regular.music.test(file.fileMime),
                'icon-file-doc': regular.doc.test(file.fileMime),
                'icon-file-ppt': regular.ppt.test(file.fileMime),
                'icon-file-xls': regular.xls.test(file.fileMime),
                'icon-file-pdf': regular.pdf.test(file.fileMime),
                'icon-file-zip': regular.zip.test(file.fileMime),
                'icon-file-unknow': !regular.unknow.test(file.fileMime)
              }" 
              size="22"
              :multiple="true"
              style="margin-right:7px;"/>
            <span 
              class="name" 
              @click="$emit('accessFile', file)">
              {{ file.fileName }}
            </span>
          </Col>
          <Col span="4">
            <span v-if="file.isFolder"> - </span>
            <span v-else>{{ file.fileSize | fileSize }}</span>
          </Col>
          <Col span="5">
            {{ file.createdTime | date }}
          </Col>
        </li>
      </ul>
    </div>
    <!-- E 文件列表 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { regular } from 'config/constant'
  export default {
    name: 'FileList',
    props: {
      // 文件列表
      fileList: {
        type: Array,
        required: true
      },
      // loading显示状态
      loadingVisible: {
        type: Boolean,
        default: true
      },
      // 全选
      checkAll: {
        type: Boolean,
        default: false,
        required: true,
      },
      // 排序类型
      sortType: {
        type: Number,
        required: true
      }
    },
    data: function() {
      return {
        currentCheckAll: this.checkAll
      }
    },  
    watch: {
      checkAll: function(newValue) {
        this.currentCheckAll = newValue
      }
    },
    created: function() {
      // dom渲染前，拿到 regular
      this.regular = regular
    },
    methods: {
      _fileLiClick: function(file) {
        // 清空之前的所有被选文件项
        this.$emit('checkAllChange', false)
        // 只设置当前的文件项
        file.checked = !file.checked
        this.$emit('accessFile', file)
        this.$emit('singleFileSelectchange', file)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/mixin'
  .files
    /* 头部 */
    .file-header
      height 30px
      line-height 30px
      margin 0 26px
      border-bottom 1px solid #ddd
    /* 列表 */
    .file-list
      position absolute
      top 134px
      right 0
      bottom 0
      left 0
      overflow-y auto
      padding-bottom 20px
      .file-item
        height 40px
        line-height 40px
        padding 0 26px
        &:hover
          background-color #DDF7E2
        &:active
          background-color #A5ECC1
        .file-name .name 
          cursor pointer
          padding-right 20px
          &:hover
            color #850
</style>

