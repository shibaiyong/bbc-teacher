/** 
 * @Desc: 完成注册
 */
<template>
  <div class="complete">
    <!-- 长文字 -->
    <p class="long-text text-one">感谢您</p>
    <p class="long-text text-two">用微笑温暖了一颗颗稚嫩的心</p>
    <!-- 倒计时文字 -->
    <p class="text-item">
      <span style="color:red">{{time}}&nbsp;</span>秒后自动跳转到登录页面
    </p>
    <!-- 点击进入 -->
    <button class="button-item" @click="_loginClick">等不及了，马上进入</button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'RegisterComplete',
    data: function() {
      return {
        time: 5,
        interval: null
      }
    },
    // 当前路由离开的时候要清除定时器
    beforeRouteLeave: function(to, from, next) {
      clearInterval(this.interval)
      this.$parent.$parent.$data.currentIndex = 0
      next()
    },
    mounted: function() {
      this._setInterval()
      this._setStepValue()
    },
    methods: {
      /**
       * 设置定时器
       */
      _setInterval: function() {
        this.interval = setInterval( () => {
          this.time > 0 ? this.time-- : this.time = 0
          this.time == 0 && this.$router.replace('/login')
        }, 1000)
      },

      /** 
       * 设置步骤条 
       */
      _setStepValue: function() {
        this.$parent.$parent.$data.currentIndex = 2
      },

      /** 
       * 自动进入 
       */
      _loginClick: function() {
        this.time = 0
        // 清除定时器
        clearInterval(this.interval)
        this.$router.replace('/login')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .complete
    padding-top 44px
    .long-text
      height 40px
      line-height 40px
      color #885511
    .text-one
      font-size 36px
    .text-two
      font-size 24px  
      margin-bottom 20px

    .text-item
      color #885511
      text-align center
      font-size 14px
      margin-bottom 44px
    .button-item
      width 260px
      height 50px
      line-height 50px
      border-radius 30px
      font-size 18px
      background-image linear-gradient(to bottom, #55c888, #088844)         
      color white 
</style>