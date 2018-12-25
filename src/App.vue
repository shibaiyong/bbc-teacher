<template>
  <div id="app" class="app" ref="app">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'App',
    methods: {
      _resizeEvent: function() {
        const appEl = this.$refs.app
        const screenWidth = document.body.clientWidth
        appEl.style.minHeight = screenWidth / 16 * 7.5 + 'px'
      }
    },
    mounted: function() {
      this._resizeEvent()
      window.addEventListener('resize', this._resizeEvent)
    },
  }  
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .app
    position relative
    width 100%  
    height 100%
    background url(./image/bg.png) no-repeat
</style>

