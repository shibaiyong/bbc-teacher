/** 
 * @Desc: 忘记密码身份验证
 */
<template>
  <div class="identity">
    <!-- 文字提示 -->
    <div class="text-item error-item">
      <v-icon type="icon-login-error" :size="14" v-if="errorFlag"></v-icon>
      {{identityText}}
    </div>
    <!-- 手机号 -->
    <div class="form-item">
      <input 
        type="text" 
        ref="phone" 
        class="input-item" 
        placeholder="手机号码" 
        v-model.trim="identityForm.phone" 
        maxlength="11">
    </div>
    <!-- code -->
    <div class="form-item clear-float">
      <input 
        type="text" 
        ref="code" 
        style="width:150px;float:left" 
        class="input-item" 
        placeholder="验证码" 
        v-model.trim="identityForm.code" 
        maxlength="6">
      <button 
        class="float-right code-button" 
        :class="{'disabledClass': codeVisible}" 
        :disabled="codeVisible" 
        @click="_getCode" 
        v-text="codeButtonText">
      </button>
    </div>
    <!-- button -->
    <button class="button-item" @click="_checkClick">下一步</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import { requestGetCode, requestCheckCode } from 'api/forget-password'
  import { validataPhone, validateCodeLength, sessionStorageUtil} from 'lib/util'

  export default {
    name: 'IdentityCheck',
    data: function() {
      return {
        identityForm: {
          phone: '',
          code: ''
        },
        identityText: '',
        errorFlag: false,
        codeButtonText: '获取验证码',
        codeVisible: false, 
        timeOut: null,
        textTimeOut: null //提示文字的定时器
      }
    },
    // 当前路由离开的时候要清除定时器
    beforeRouteLeave: function(to, from, next) {
      clearInterval(this.timeOut)
      clearTimeout(this.textTimeOut)
      next()
    },
    methods: {
      /** 
       * 5秒后自动清除登录的提示文字  
       */
      _clearText: function() {
        this.textTimeOut =setTimeout( ()=> {
          this.errorFlag = false
          this.identityText = ''
        }, 5000)
      },

      /** 
       * 获得验证码点击
      */
      _getCode: function() {
        // 清除文字信息的定时器
        clearTimeout(this.textTimeOut)
        // 校验手机号
        if (validataPhone(this.identityForm.phone)) {
          this.codeVisible = true
          this.codeVisible && (this.codeButtonText = '60s后重新获取')
          this.timeOut = setTimeout( () => {
            this.codeVisible = false
            this.codeButtonText = '重新获取验证码'
          }, 60000)
          // 获得验证码
          this._handleGetCode(this.identityForm.phone)
        } else {
          this.identityText = '请输入手机号码'
          this.errorFlag = true
          this.$refs.phone.focus()
          this._clearText()
        }
      },

      /** 
       * 请求获得验证码 
       * @param {String} phone: 手机号
       */
      _handleGetCode(phone) {
        requestGetCode(phone).then( response =>{
          switch (response.code) {
            case 200:
              this.identityText = response.msg
              this.errorFlag = true
              this.$refs.code.focus()
              break
            case 202:
              this.identityText = response.msg
              this.errorFlag = true
              this.$refs.phone.focus()
              break
            default:
              this.identityText = '短信发送出问题，请稍后在发送'
              this.errorFlag = true
              this.$refs.phone.focus()
              break
          }
          this._clearText()
        })
      },

      /**
       * 下一步点击
       */
      _checkClick: function() {
        // 设置校验变量
        let phoneValidate = validataPhone(this.identityForm.phone)
        let codeValidate = validateCodeLength(this.identityForm.code)

        // 清除定时器
        clearTimeout(this.textTimeOut)

        // 手机格式校验
        if(phoneValidate) {
          this.identityText = ''
          this.errorFlag = false
          this.$refs.code.focus()
        } else {
          this.identityText = '请输入手机号码'
          this.errorFlag = true
          this._clearText()
          this.$refs.phone.focus()
        }

        // 手机校验通过，验证码校验不通过
        if(phoneValidate && !codeValidate) {
          this.identityText = '请填写6位验证码'
          this.errorFlag =true
          this._clearText()
          this.$refs.code.focus()
        }

        // 格式校验成功
        if (phoneValidate && codeValidate) {
          this._checkCode(this.identityForm)
        }
      },

      /** 
       * 验证码校验请求 
       */
      _checkCode: function(param) {
        return requestCheckCode(param).then( response => {
          let code = response.code
          switch (code) {
            case 200:
              sessionStorageUtil.set('temp-forget-phone', this.identityForm.phone)
              sessionStorageUtil.set('temp-forget-code', this.identityForm.code)
              this.identityText = ''
              this.errorFlag = false
              this.$router.replace({name: 'reset-password'})
              break
            case 204:
              this.identityText = '验证码已过期，请重新获取'
              this.errorFlag = true
              this._clearText()
              break
            default:
              this.identityText = '手机号或者验证码有误'
              this.errorFlag = true
              this._clearText()
              break
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .identity
    padding-top 20px
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
      .code-button
        width 140px
        height 50px
        line-height 50px
        padding 0 10px
        border-radius 30px
        color #188c4a
        border 1px solid #188c4a
      .disabledClass
        cursor not-allowed
        background-color #333
        border-color #333
        color white 
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
      margin-top 30px
      line-height 50px
      border-radius 30px
      font-size 24px
      background-image linear-gradient(to bottom, #55c888, #088844) 
      color white
</style>