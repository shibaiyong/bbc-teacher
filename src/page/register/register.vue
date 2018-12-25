/** 
 * @Desc: 注册
 */
<template>
  <div class="register">
    <login-content-box>
      <!-- 返回登录 -->
      <div class="register-item">
        <router-link v-if="currentIndex != 2" to="/login" class="login-item">返回登录</router-link>
      </div>
      <!-- 其他文本内容 -->
      <div class="register-content">
        <!-- 步骤条 -->
        <div>
          <v-steps :current="currentIndex" :textArr="textArr"></v-steps>
        </div>
        <!-- 路由 -->
        <transition>
          <router-view></router-view>
        </transition>
      </div>
    </login-content-box>
  </div>
</template>

<script type="text/ecmascript-6">
  import LoginContentBox from 'component/login-content-box'
  import VSteps from 'component/steps'
  export default {
    name: 'Register',
    components: {
      LoginContentBox,
      VSteps
    },
    data: function() {
      return {
        currentIndex: 0,
        textArr: [
          '填写信息',
          '设置密码',
          '完成'
        ]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .register
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
        font-size 14px
    /* 其他文本 */    
    .register-content
      width 400px
      margin 48px auto 0
</style>