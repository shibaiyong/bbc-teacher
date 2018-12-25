/** 
 * @Desc: 身份验证
 */
<template>
  <div class="authentication">
    <!-- 文本提示 -->
    <div class="text-item error-item">
      <v-icon type="icon-login-error" :size="14" v-if="errorFlag"></v-icon>
      {{identityText}}
    </div>
    <!-- 手机号码 -->
    <div class="form-item">
      <input 
        type="text" 
        ref="phone" 
        class="input-item" 
        placeholder="请输入手机号码" 
        v-model.trim="identityForm.tel" 
        maxlength="11">
    </div>
    <!-- 邀请码 -->
    <div class="form-item">
      <input 
        type="text" 
        ref="code" 
        class="input-item" 
        placeholder="请输入邀请码" 
        v-model.trim="identityForm.code" 
        maxlength="6">
    </div>
    <!-- dialog -->
    <div class="info-item clear-float">
      <a @click="instance('info')">如何获得邀请码?</a>
    </div>
    <!-- 下一步 -->
    <button class="button-item" @click="_checkClick">下一步</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import { requestCheckCode } from 'api/register'
  import { validataPhone, validateCodeLength, sessionStorageUtil} from 'lib/util'

  export default {
    name: 'Authentication',
    data: function() {
      return {
        identityForm: {
          tel: '',
          code: ''
        },
        identityText: '',
        errorFlag: false,
        dialogVisible: false,
        timeOut: null
      }
    },
    // 当前路由离开的时候要清除定时器
    beforeRouteLeave: function(to, from, next) {
      clearTimeout(this.timeOut)
      next()
    },
    methods: {
      /** 
       * 提示弹窗信息
       * @param {String} type: 类型
       */
      instance: function(type) {
        this.$Modal.info({
          render: (h) => {
            return h('div', {
              style: {
                fontSize: '18px',
                color: '#99601c',
                textIndent: '20px'
              },
              domProps: {
                innerHTML: '请联系管理员获取'
              }
            }) 
          }
        })
      },

      /** 
       * 5秒后自动清除登录的提示文字  
       */
      _clearText: function() {
        this.timeOut = setTimeout( ()=> {
          this.identityText = ''
          this.errorFlag = false
        }, 5000)
      },

      /**
       * 下一步点击
       */
      _checkClick: function() {
        // 校验变量
        let phoneValidate = validataPhone(this.identityForm.tel)
        let codeValidate = validateCodeLength(this.identityForm.code)

        // 先清空定时器
        clearTimeout(this.timeOut)

        // 手机格式校验
        if (phoneValidate) {
          this.identityText = ''
          this.errorFlag = false
          this.$refs.code.focus()
        } else {
          this.identityText = '请输入手机号码'
          this.errorFlag = true
          this.$refs.phone.focus()
          this._clearText()
        }

        // 手机格式校验通过，验证码校验不通过
        if (phoneValidate && !codeValidate) {
          this.identityText = '请输入6位验证码'
          this.errorFlag = true
          this.$refs.code.focus()
          this._clearText()
        }

        // 格式校验成功
        if (phoneValidate && codeValidate) {
          requestCheckCode(this.identityForm).then( response => {
            let code = response.code
            switch (code) {
              case 200:
                // 本地存储信息
                sessionStorageUtil.set('temp-register-phone', this.identityForm.tel)
                sessionStorageUtil.set('temp-register-code', this.identityForm.code)
                this.identityText = ''
                this.errorFlag = false
                this.$router.replace({name: 'set-password'})
                break
              case 204:
                this.identityText = response.msg
                this.errorFlag = true
                this._clearText()
                break
              default:
                this.identityText = '手机号或者验证码错误'
                this.errorFlag = true
                this._clearText()    
                break
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .authentication
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
    /* 弹窗按钮 */  
    .info-item
      height 14px
      line-height 14px
      margin-bottom 18px
      font-size 14px
      a
        color #99601c 
        float left
        margin-left 10px

    /* 按钮 */    
    .button-item
      width 260px
      height 50px
      line-height 50px
      border-radius 30px
      font-size 24px
      background-image linear-gradient(to bottom, #55c888, #088844)
      color white
</style>