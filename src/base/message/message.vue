<template>
  <div class="v-message">
    <div class="v-message-wrap" :class="'v-message--' + type">
      <v-icon 
        :type="'icon-' + type" 
        :color="type === 'loading' ? '#259755' : ''"/>
      <span class="v-message-content">
        {{ content }}
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VMessage',
    mounted: function() {
      this.visible = true
      setTimeout(() => {
        this.visible = false
        this.$el.parentNode.removeChild(this.$el)
      }, this.duration)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .v-message
    position fixed
    top 30px
    left 0
    right 0
    text-align center
    z-index 99999
    pointer-events none
    .v-message-wrap
      display inline-block
      padding 10px 30px
      pointer-events all
      border-radius 10px
      background #ffffff
      .v-message-content
        margin-left 4px
        font-size 16px
      &.v-message--success
        color #00672b
        background-color #c8fdcf
        box-shadow 0.521px 2.954px 8px 0px rgba(0, 0, 0, 0.17),inset 0px -2px 1px 0px rgba(59, 174, 74, 0.26),inset 0px 1px 1px 0px rgba(217, 255, 222, 0.004)
      &.v-message--info
        color #0071db
        background-color #b9e7ff
        box-shadow 0.521px 2.954px 8px 0px rgba(0, 0, 0, 0.17),inset 0px -2px 1px 0px rgba(66, 166, 199, 0.27),inset 0px 1px 1px 0px rgba(185, 241, 255, 0.004)
      &.v-message--warn
        color #fc5300
        background-color #ffe3cc
        box-shadow 0.521px 2.954px 8px 0px rgba(0, 0, 0, 0.17),inset 0px -2px 1px 0px rgba(255, 193, 142, 0.24),inset 0px 1px 1px 0px rgba(255, 245, 236, 0.89)
      &.v-message--error
        color #fc0000
        background-color #ffd1d1
        box-shadow 0.521px 2.954px 8px 0px rgba(0, 0, 0, 0.17),inset 0px -2px 1px 0px rgba(255, 193, 142, 0.24),inset 0px 1px 1px 0px rgba(255, 245, 236, 0.89)
</style>
