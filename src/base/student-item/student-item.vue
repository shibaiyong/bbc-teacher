/** 
 * @Desc: 学生项
 */
<template>
  <li class="student-item">
    <div class="avatar-wrap">
      <div class="edit-warp hover-light">
        <i class="edit" @click="$emit('editStudent', student)"></i>
      </div>
      <div class="avatar">
        <v-avatar 
          size="136" 
          :src="student.gender === 1 ? '/static/res/img/male-avatar.png' : '/static/res/img/female-avatar.png'" 
          style="margin:0 2px;">
        </v-avatar>
      </div>
    </div>
    <div class="info" :class="student.gender === 1 ? 'male' : 'female'">
      <p class="name">{{ student.stu_name }}</p>
      <p class="age">{{ student.birthday | age }}</p>
      <div 
        class="remove-wrapper clickable hover-light" 
        v-show="remove" 
        @click="$emit('removeStudent', student)">
        <v-icon type="icon-remove" color="#fff" size="14"></v-icon>
      </div>
    </div>
  </li>
</template>

<script type="text/ecmascript-6">
  import VAvatar from 'base/avatar'
  export default {
    name: 'StudentItem',
    components: {
      VAvatar,
    },
    props: {
      // 学生数据
      student: {
        type: Object,
        required: true
      },
      // 是否显示删除
      remove: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .student-item
    float left
    padding 20px 24px
    .avatar-wrap
      position relative
      width 160px
      height 160px
      padding 10px
      background url(./img/avatar-bg.png) no-repeat 
      .avatar
        width 140px
        height 140px
        border-radius 50%
        box-shadow 0px 1px 3px 0px rgba(0, 0, 0, 0.4),inset 0px -3px 2px 0px rgba(0, 0, 0, 0.14),inset 0px 1px 2px 0px rgba(255, 255, 255, 0.61)
        background-color rgb(255, 255, 255)
      .edit-warp
        position absolute
        top 9px
        right 9px
        width 38px
        height 38px
        padding 3px
        border-radius 50%
        background-color #F4EDC7
        cursor pointer
        .edit
          display inline-block
          width 32px
          height 32px
          background url(./img/edit.png) no-repeat
    .info
      position relative
      width 142px
      height 69px
      padding-top 14px
      line-height 25px
      margin 0 auto
      text-align center
      font-weight bold
      overflow hidden
      &.male
        color #4f9999 
        background url(./img/male-bubble.png) no-repeat
        .remove-wrapper
          background-color rgba(0, 160, 233, .2)
      &.female
        color #ff4e45 
        background url(./img/female-bubble.png) no-repeat
        .remove-wrapper
          background-color rgba(255, 0, 0, .15)
      .name
        padding 0 10px
      .remove-wrapper
        position absolute
        right -9px
        bottom -6px
        width 36px
        height 36px
        padding 3px 7px 0 0
        background-color #bfa
        border-radius 50%

  @media screen and (max-width: 1600px)
    .student-item
      padding 18px 12px
</style>

