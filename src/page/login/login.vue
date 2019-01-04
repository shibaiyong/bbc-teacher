/** 
 * @Desc: 登陆页面
 */
<template>
  <div class="login">
    <login-content-box>
      <!-- 注册 -->
      <div class="register-item">
        <router-link to="/register" class="login-item">注册</router-link>
      </div>
      <!-- 其他文本内容 -->
      <div class="login-content">
        <!-- logo -->
        <div class="logo-item">
          <img src="../../image/login-logo.png" alt="">
          <!-- <img src="../../image/tgs-logo.png" alt=""> -->
        </div>
        <!-- 文字提示 -->
        <div class="text-item error-item">
          <v-icon type="icon-login-error" :size="14" v-if="errorFlag"></v-icon>
          {{loginText}}
        </div>
        <!-- 手机号 -->
        <div class="form-item">
          <input 
            class="form-input" 
            type="text" 
            ref="Phone" 
            placeholder="手机号" 
            maxlength="11"
            v-model="loginForm.userName">
        </div>
        <!-- 密码 -->
        <div class="form-item">
          <input type="password" style="display: none">
          <input 
            class="form-input" 
            type="password" 
            ref="Password" 
            placeholder="密码" 
            maxlength="32"
            v-model="loginForm.password">
        </div>
        <!-- 记住密码 -->
        <div class="check-item clear-float" style="padding: 0 10px">
          <Checkbox v-model="rememberValue" style="color: #946526">记住密码</Checkbox>
          <router-link to="/forget-password" class="forget-item float-right" >忘记密码</router-link>
        </div>
        <!-- 登录按钮 -->
        <button class="button-item" @click="_handleLogin">登录</button>
      </div>
    </login-content-box>


    <Selectt/>
    
  </div>
</template>

<script type="text/ecmascript-6">
  import LoginContentBox from 'component/login-content-box'
  import { requestGetToken, requestRefreshToken } from 'api/token'
  import { 
    sessionStorageUtil, 
    localStorageUtil,  
    validataPhone, 
    validatePassword 
    } from 'lib/util'
  import { Base64 } from 'js-base64'
  import cookie from 'js-cookie'
  import Selectt from 'component/select.vue'
  export default {
    name: 'Login',
    components: {
      LoginContentBox,
      Selectt
    },
    data: function() {
      return {
        loginForm: {
          userName: '',
          password: ''
        },
        loginText: '', //登录校验文字
        errorFlag: false,
        rememberValue: true,
        timeOut: null // 定时器
      }
    },
    // 当前路由离开的时候要清除定时器
    beforeRouteLeave: function(to, from, next) {
      clearTimeout(this.timeOut)
      next()
    },
    mounted: function() {
       this._getDataFromStorage()
    },
    methods: {
      /** 
       * 从存储中获取数据并且赋值 
       */
      _getDataFromStorage: function() {
        this.loginForm.userName = localStorageUtil.get('teacher-userName') ? localStorageUtil.get('teacher-userName') : this.loginForm.userName  
        this.loginForm.password = localStorageUtil.get('teacher-password') ? localStorageUtil.get('teacher-password') : this.loginForm.password  
      },

      /** 
       * 5秒后自动清除登录的提示文字  
       */
      _clearLoginText: function() {
        this.timeOut =setTimeout( ()=> {
          this.loginText = ''
          this.errorFlag = false
        }, 5000)
      },

      /** 
       * 记住密码 
       */
      _rememberUserInfo: function() {
        localStorageUtil.set('teacher-userName', this.loginForm.userName)
        localStorageUtil.set('teacher-password', this.loginForm.password)
      },

      /** 
       * 不记住密码,清除之前的数据 
       */
      _removeUserInfo: function() {
        localStorageUtil.remove('teacher-userName')
        localStorageUtil.remove('teacher-password')
      },
      
      /**
       * login
       */
      _handleLogin: function() {
        // 校验变量
        let validatePhoneValue = validataPhone(this.loginForm.userName)
        let validatePasswordValue = validatePassword(this.loginForm.password)

        // 先清除定时器
        clearInterval(this.timeOut)

        // 手机校验
        if (validatePhoneValue) {
          this.loginText = ''
          this.errorFlag = false
        } else {
          this.loginText = '请输入正确的手机号码'
          this.errorFlag = true
          this.$refs.Phone.focus()
          this._clearLoginText()
        }

        // 手机校验通过之后，密码格式校验错误
        if(validatePhoneValue && !validatePasswordValue) {
          this.loginText = '请输入6~32位密码'
          this.errorFlag = true
          this.$refs.Password.focus()
          this._clearLoginText()
        }

        // 前端格式校验通过
        if(validatePasswordValue && validatePhoneValue ) {
          const param = {
            username: this.loginForm.userName,
            password: Base64.encode(this.loginForm.password)
          }
          // 获取token
          this._getToken(param)
            .then(() => {
              // 是否记住密码
              this.rememberValue ? this._rememberUserInfo() : this._removeUserInfo()
              this.$router.push('/home')
            })
            .catch(err => {
              // console.log('登录失败', err.response.error_description)
            })
        }
      },

      /**
       * 获取token 
       */
      _getToken: function(param) {
        return requestGetToken(param)
          .then(res => {
            // 缓存token
            cookie.set('ttoken', res.access_token, { expires: res.expires_in - 60} )
            // // 设置登录信息
            this.$store.commit('login')
            return Promise.resolve(res.refresh_token)
          })
          .catch(err => {
            let status = err.response.status
            switch(status) {
              case 400:
                this.loginText = err.response.data.error_description
                this.errorFlag = true
                break
              case 401:
                this.loginText = '用户名或者密码错误'
                this.errorFlag = true 
                break
              default:
                 this.loginText = '用户名或者密码错误'
                 this.errorFlag = true
                 break 
            }
            this._clearLoginText()
            return Promise.reject(err)
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .login
    height 100%
    background url(../../image/bottom-bg3.png) no-repeat 0 bottom, url(../../image/top-bg3.png) no-repeat 0 top 
    /* 注册 */
    .register-item
      position relative
      height 16px
      line-height 16px
      .login-item
        position absolute
        right 0px
        top 0
        color #885511
        font-size 16px

    /* 其他文本 */    
    .login-content
      width 400px
      margin 0 auto
      /* logo */
      .logo-item
        height 140px
        line-height 140px
        text-align center
        margin-top -10px
        margin-bottom 7px

      /* 文字信息提示 */
      .text-item
        height 14px
        line-height 14px
        padding-left 10px
        margin-bottom 15px
        text-align left
        font-size 14px
      .error-item
        color red   

      /* 表单item */
      .form-item
        position relative
        height 50px
        margin-bottom 15px
        .form-input
          width 100%
          height 100%
          padding-left 30px
          color #99601c
          font-size 18px
          border-radius 30px
          background-color #ffffff
          box-shadow 0 2px 1px 0 rgba(255,255,255,.004), inset 0 2px 1px 0 rgba(79,72,42,.23), inset 0 0 2px 0 rgba(79,72,42,.23)
        .eye-item
          position absolute
          top 0
          right 5px
          cursor pointer
          margin 10px

      /* 记住密码 */      
      .check-item
        height 17px
        line-height 17px
        margin-bottom 15px
        text-align left  
        .forget-item
          font-size 14px
          margin-right 5px
          color #99601c

      /* 按钮 */    
      .button-item
        width 260px
        height 50px
        line-height 50px
        border-radius 30px
        font-size 24px
        background-image linear-gradient(to bottom, #55c888, #088844)  
        color white      

  @media screen and (max-width: 1600px)
    .login
      background url(../../image/bottom-grassland.png) no-repeat 0 bottom, url(../../image/top-bg2.png) no-repeat 0 top 
</style>