/** 
 * @Desc: 头部组件
 */
<template>
  <div class="header">
    <!-- S 版本信息 -->
    <div v-if="showFlag" class="float-left header-verion">
      <p>前端版本信息：{{versionMsg}}</p>
      <p>后端版本信息：{{reVersion}}</p> 
    </div>
    <!-- E 版本信息 -->

    <!-- S 用户 -->
    <div class="user">
      <!-- 机构下拉列表 -->
      <div class="ivu-select ivu-select-single header-select clickable" :class="{'box-clicked': visibleFlag}" @click.stop="_selectedBoxClick">
        <!-- icon -->
        <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow change-icon" style="z-index: 999"></i>
        <!-- 文字显示 -->
        <div class="ivu-select-selection header-select-text">{{activeClassModel}}</div>
        <!-- 机构列表数据 -->
        <ul class="header-select-ul ivu-select-dropdown" v-show="visibleFlag">
          <li 
            class="header-select-li" 
            :class="{'active-select': activeClassModel === (item.gradeName + ' ' + item.className)}"
            v-for="(item, index) in classesList" 
            :key="index"
            @click.stop="_selectOrgList(item)">{{item.gradeName + ' ' + item.className}}</li>
        </ul>
      </div>
      <!-- 教师名字 -->
      <span class="emp-name">{{ userName }}</span>
      <Dropdown>
        <v-avatar 
          class="clickable"
          size="50"
          src="/static/res/img/user-avatar.png"/>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="_editUserClick">修改个人信息</DropdownItem>
          <DropdownItem @click.native="$router.push('/login')">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <!-- E 幼儿园名称 -->

    <!-- S 导航区 -->
    <div class="nav">
      <ul class="nav-list">
        <router-link 
          class="nav-item clickable" 
          tag="li" 
          :to="navItem.to"  
          v-for="(navItem, index) in navList" 
          :key="index" >
          {{ navItem.title }}
        </router-link>
      </ul>
    </div>
    <!-- E 导航区 -->

    <!-- S 修改用户信息对话框 -->
    <Modal 
      title="修改个人信息"
      v-model="editUserDialogVisible"
      @on-ok="_handleEditUser"
      @on-cancel="$refs['editUserForm'].resetFields()">
      <Form 
        :model="editUserForm"
        :rules="editUserFormRule"
        :labelWidth="60"
        ref="editUserForm"
        style="padding:0 80px;">
        <FormItem label="姓名" prop="name">
          <Input size="large" v-model="editUserForm.name" placeholder="请输入姓名"/>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input size="large" :disabled="true" v-model="editUserForm.phone"/>
        </FormItem>
      </Form>
    </Modal>
    <!-- E 修改用户信息对话框 -->
  </div>
</template>

<script type="text/ecmascript-6">
  // 工具
  import { sessionStorageUtil } from  'lib/util'
  import { FeVersion, versionMessage } from 'config/config'
  // 组件
  import VAvatar from 'base/avatar'
  // 接口
  import { requestPatchUserInfo, requestSwitchClasses, requestGetAllClassesData, requestGetUserInfo } from 'api/user'
  import { requestGetVersionData } from 'api/version'

  export default {
    name: 'VHeader',
    components: {
      VAvatar,
    },
    data: function() {
      return {
        // 数据
        userName: '',
        userPhone: '',

        // 导航
        navList: [
          {
            to: '/home',
            title: '首页'
          },
          {
            to: '/attend-class',
            title: '开心上课'
          },
          {
            to: '/prepare-lesson',
            title: '轻松备课'
          },
          {
            to: '/class-manage',
            title: '班级管理'
          },
          {
            to: '/my-collection',
            title: '我的收藏'
          }
        ],
        // 修改用户对话框
        editUserDialogVisible: false,
        editUserForm: {
          phone: '',
          name: ''
        },
        editUserFormRule: {
          name: [
            {
              required: true,
              message: '请输入姓名'
            },
            {
              min: 2,
              max: 10,
              message: '长度在 2 至 10 个字之间'
            }
          ]
        },

        // 园所的所有下拉数据
        visibleFlag: false,
        activeClassModel: '',
        classesList: [],

        // 版本相关
        showFlag: false,
        versionMsg: versionMessage,
        reVersion: ''
      }
    },
    mounted: function() {
      this._getHeaderInfo()
      this.getDetailData()
      this._checkHost()
      document.addEventListener('click', this._bodyClick)
    },
    methods: {
      /** 
       * 判断版本信息的显示网址
      */
      _checkHost: function () {
        this.showFlag = location.host.indexOf('net') !== -1 
        if (this.showFlag) {
          this._getRevisionData()
        }  
      },

      /** 
       * 获取后端版本信息
      */
      _getRevisionData: function() {
        requestGetVersionData().then( response => {
          this.reVersion = response.version
        })
      },

      /** 
       * 文档对象绑定点击事件,点击关闭下拉菜单
      */
      _bodyClick: function() {
        this.visibleFlag = false
      },

      /** 
       * 获取下拉列表的默认显示数据
      */
      getDetailData: function() {
        requestGetAllClassesData().then( res => {
          if (res.code === 200) {
            // console.log('requestGetAllClassesData SUCCESS', res.data)
            sessionStorageUtil.set('activeClassId', res.data.defaultId)
            this.classesList = res.data.classes
            this.classesList.map(item => {
              if (Number(item.classId) === Number(sessionStorageUtil.get('activeClassId'))) {
                this.activeClassModel = item.gradeName + ' ' + item.className
              }
            })
          }
        })
      },

      /** 
       * 获取头部信息
      */
      _getHeaderInfo: function() {
        requestGetUserInfo().then(res => {
          if (res.code === 200) {
            // console.log('jieguo:', res.data)
            this.userName = res.data.emp.name
            this.userPhone = res.data.emp.phone
          }
        })
      },

      /** 
       * 下拉菜单点击
      */
      _selectedBoxClick: function() {
        this.visibleFlag = !this.visibleFlag
      },

      /** 
       * 下拉菜单项点击
      */
      _selectOrgList: function(item) {
        // 显示值
        this.activeClassModel = item.gradeName + ' ' + item.className
        // 调用切换的ID
        requestSwitchClasses(Number(item.classId)).then( res => {
          if (res.code === 200) {
            // 存储值
            sessionStorageUtil.set('activeClassName', item.className)
            sessionStorageUtil.set('activeClassId', item.classId)
            // 清除存储的当前课程数据
            sessionStorageUtil.remove('courseId')
            this.visibleFlag = false
            // 刷新
            location.reload()
          }
        })
      },

      /**
       * 修改用户信息点击
       */
      _editUserClick: function() {
        this.editUserForm.name = this.userName
        this.editUserForm.phone = this.userPhone
        this.editUserDialogVisible = true
      },

      /**
       * 请求修改用户信息
       */
      _handleEditUser: function() {
        // 表单校验
        this.$refs['editUserForm'].validate((valid) => {
          if (valid) {
            // 提交修改
            requestPatchUserInfo(this.editUserForm)
              .then(res => {
                if (res.code === 200) {
                  // console.log('requestPatchUserInfo SUCCESS', res)
                  this.$VMessage('success', '个人信息修改成功')
                  this.editUserDialogVisible = false
                  this.$store.dispatch('getUserInfo')
                }
                else {
                  // console.log('requestPatchUserInfo FAIL', res)
                  this.$VMessage('error', '个人信息修改失败')
                }
              })
            } 
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  @import '~style/mixin'

  /* 路由激活、悬停样式 */
  .router-active, .nav-list .nav-item:hover
    background-color $color-text-sub
    color $color-text
    background-image linear-gradient( -90deg, #D29D5F, 1%, rgb(169,104,29) 100%)
    opacity .8

  /* 头部组件样式 */
  .header
    height 46px
    line-height 46px
    padding 25px 0 30px
    box-sizing content-box
    font-size $font-size-large
    font-weight bold
    color $color-text-sub
    /* 名称和头像 */
    .user
      float right
      margin-right 50px
      .box-clicked
        .change-icon
          transform rotate(180deg)
      .header-select
        position relative
        width 180px
        height 34px 
        line-height 34px
        margin-right 5px
        .header-select-placeholder
          position absolute
          width 180px
        .header-select-text
          padding 0 34px 0 20px
          line-height 34px
          border 1px solid #ffa744
          box-shadow 0 1px 3px 0 rgba(148,140,98,.72), inset 0 2px 2px 0 rgba(0,0,0,.25), inset 0 -2px 0 0 rgba(255,255,255,.28)
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        .header-select-ul
          position absolute
          top 34px
          left 0
          width 100%
          .header-select-li
            line-height 30px
            height 30px
            text-align center
            &:hover
              color #99601c
          .active-select
            color #99601c     
      .emp-name
        display inline-block
        margin 0 10px

    /* 版本信息 */    
    .header-verion
      position fixed
      bottom 10px
      left 10px
      margin-left 20px
      p
        float left
        margin-right 30px
        height 30px
        line-height 30px
        font-size 14px
        color black
    /* 导航区 */
    .nav
      width 58%
      margin 0 auto
      .nav-list 
        clear-float()
        .nav-item
          float left
          width 120px
          margin-left 10px
          text-align center
          border-radius 50px
          transition .3s

  @media screen and (max-width 1600px) 
    .header
      height 40px
      line-height 40px
      font-size 16px
      padding 15px 0 20px
      .nav
        .nav-list
          .nav-item
            width 100px
</style>
