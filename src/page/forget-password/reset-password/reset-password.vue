/** 
 * @Desc: 设置密码
 */
<template>
  <div class="resetPassword">
    <!-- 文字提示 -->
    <div class="text-item error-item">
      <v-icon type="icon-login-error" :size="14" v-if="errorFlag"></v-icon>
      {{passwordText}}
    </div>
    <!-- 密码 -->
    <div class="form-item">
      <input 
        type="password" 
        ref="pwd" 
        class="input-item" 
        placeholder="设置新密码"
        maxlength="32" 
        v-model.trim="passwordForm.password">
    </div>
    <!-- 重复密码 -->
    <div class="form-item">
      <input 
        type="password" 
        ref="confirmPwd" 
        class="input-item" 
        placeholder="确认密码" 
        maxlength="32"
        v-model.trim="passwordForm.confirmPassword">
    </div>
    <!-- 下一步按钮 -->
    <button class="button-item" @click="_nextClick">下一步</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import { validatePassword, confirmPassword, localStorageUtil, sessionStorageUtil} from 'lib/util'
  import { requestModifyPassword } from 'api/forget-password'
  import { Base64 } from 'js-base64'
  export default {
    name: 'ResetPassword',
    data: function() {
      return {
        passwordForm: {
          phone: '',
          code: '',
          password: '',
          confirmPassword: ''
        },
        passwordText: '',
        errorFlag: false,
        timeOut: null
      }
    },
    created: function() {
      this._getSessionInfo()
      this._setStepValue()
    },
    // 当前路由离开的时候要清除定时器
    beforeRouteLeave: function(to, from, next) {
      clearTimeout(this.timeOut)
      sessionStorageUtil.remove('temp-forget-phone')
      sessionStorageUtil.remove('temp-forget-code')
      next()
    },
    methods: {
      /** 
       * 5秒后自动清除登录的提示文字  
       */
      _clearText: function() {
        this.timeOut = setTimeout( ()=> {
          this.passwordText = ''
          this.errorFlag = false
        }, 5000)
      },

      /**
       * 从query获取手机号码等信息
       */
      _getSessionInfo: function() {
        this.passwordForm = {
          phone: sessionStorageUtil.get('temp-forget-phone'),
          code: sessionStorageUtil.get('temp-forget-code'),
          password: '',
          confirmPassword: ''
        }
      },

      /** 
       * 设置步骤条 
       */
      _setStepValue: function() {
        this.$parent.$parent.$data.currentIndex = 1
      },

      /** 
       * 下一步点击
       */
      _nextClick: function() {
        // 校验变量
        let pwdValidate = validatePassword(this.passwordForm.password)
        let confirmValidate = confirmPassword(this.passwordForm.password, this.passwordForm.confirmPassword)

        // 清空定时器
        clearTimeout(this.timeOut)

        // 密码格式校验
        if( pwdValidate ) {
          this.passwordText = ''
          this.errorFlag = false
          this.$refs.confirmPwd.focus()
        } else {
          this.passwordText = '请填写6~32位的密码'
          this.errorFlag = true
          this._clearText()
          this.$refs.pwd.focus()
        }

        // 密码格式校验通过之后确认密码不通过
        if ( pwdValidate && !confirmValidate) {
          this.passwordText = '两次密码输入不一致'
          this.errorFlag = true
          this._clearText()
        }

        // 密码和重复密码都校验通过
        if (pwdValidate && confirmValidate) {
          this.passwordText = ''
          this.errorFlag = false
          const param = {
            phone: this.passwordForm.phone,
            password: Base64.encode(this.passwordForm.password),
            code: this.passwordForm.code
          }
          // 调用修改密码的请求
          this._handleModifyPassword(param)
        }
      },

      /** 
       * 修改密码的请求
       * @param {object} param: 请求的参数 
       */
      _handleModifyPassword: function(param) {
        return requestModifyPassword(param).then( response => {
          if (response.code == 200) {
            this.passwordText = ''
            this.errorFlag = false
            localStorageUtil.set('teacher-userName', this.passwordForm.phone)
            localStorageUtil.set('teacher-password', this.passwordForm.password)
            this.$router.replace({name: 'reset-complete'})
          } else {
            this.passwordText = response.msg 
            this.errorFlag = true
            this._clearText()
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .resetPassword
    padding-top 18px
    /* 文字容器 */
    .text-item
      height 14px
      line-height 14px
      padding-left 10px
      margin-bottom 15px
      text-align left
      font-size 14px
    .error-item
      color red

    /* input容器 */
    .form-item
      height 50px
      margin-bottom 15px
      .input-item
        width 100%
        height 100%
        padding-left 30px
        color #99601c
        font-size 18px
        border-radius 30px
        background-color #ffffff
        box-shadow 0 2px 1px 0 rgba(255,255,255,.004), inset 0 2px 1px 0 rgba(79,72,42,.23), inset 0 0 2px 0 rgba(79,72,42,.23)
    /* 下一步按钮 */    
    .button-item
      width 260px
      height 50px
      margin-top 32px
      line-height 50px
      border-radius 30px
      font-size 24px
      background-image linear-gradient(to bottom, #55c888, #088844)  
      color white      
</style>