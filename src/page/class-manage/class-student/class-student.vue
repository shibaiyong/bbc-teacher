/** 
 * @Desc: 在班学生子页面
 */
<template>
  <content-box>
    <div class="class-student">
      <v-loading v-show="loadingVisible"></v-loading>
      <!-- S 头部 -->
      <lesson-header>
        <div style="display:flex;align-items:center;">
          <span style="margin-right:50px;">
            班级人数：{{ students.count }}人
          </span>
          <span class="vertical-center" style="color:#cceded;margin-right:20px;">
            <v-icon 
              type="icon-sex-male" 
              size="28" 
              style="margin-right:3px;">
            </v-icon>
            {{ students.maleCount }}
          </span>
          <span class="vertical-center" style="color:#f7c4c5;">
            <v-icon 
              type="icon-sex-female" 
              size="28" 
              style="margin-right:3px;">
            </v-icon>
            {{ students.femaleCount }}
          </span>
        </div>
      </lesson-header>
      <!-- E 头部 -->

      <!-- S 学生列表 -->
      <ul class="student-list" v-if="students.list.length">
        <student-item
          v-for="student in students.list" :key="student.stu_id"
          :student="student"
          @editStudent="_editStudentClick">
        </student-item>
      </ul>
      <!-- E 学生列表 -->

      <!-- S 修改学生对话框 -->
      <Modal 
        title="修改学生信息"
        v-model="editStudentDialogVisible"
        @on-ok="_handleEditStudent"
        @on-cancel="$refs['editStudentForm'].resetFields()">
        <Form 
          :model="editStudentForm"
          :rules="editStudentFormRule"
          :labelWidth="90"
          ref="editStudentForm"
          style="padding:0 50px;">
          <FormItem label="学生姓名" prop="name">
            <Input 
              size="large"
              v-model="editStudentForm.name" 
              placeholder="请输入学生姓名"/>
          </FormItem>
          <FormItem prop="birthday">
            <span slot="label">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span>
            <DatePicker 
              type="date"
              size="large"
              placeholder="请选择生日"
              :value="editStudentForm.birthday" 
              :options="editStudentBirthdayOptions"
              @on-change="(value) => { editStudentForm.birthday = value }"
              style="width:260px;">
            </DatePicker>
          </FormItem>
          <FormItem prop="sex">
            <span slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
            <RadioGroup v-model="editStudentForm.gender">
              <Radio :label="1">男</Radio>
              <Radio :label="0">女</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </Modal>
      <!-- E 修改学生对话框 -->
  </div>
  </content-box>
</template>

<script type="text/ecmascript-6">
  import ContentBox from 'component/content-box'
  import LessonHeader from 'component/lesson-header'
  import StudentItem from 'base/student-item'
  import { requestGetStudents, requestPatchStudent } from 'api/class-student'
  export default {
    name: 'ClassStudent',
    components: {
      ContentBox,
      LessonHeader,
      StudentItem
    },
    data: function() {
      return {
        // 学生列表数据
        students: {
          count: 0,
          maleCount: 0,
          femaleCount: 0,
          list: [],
        },

        // 修改学生对话框
        editStudentDialogVisible: false,
        editStudentForm: {
          id: '',
          name: '',
          birthday: '',
          gender: '',
          avatar: '',
        },
        editStudentFormRule: {
          name: [
            {
              required: true,
              message: '姓名不能为空',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 10,
              message: '2 至 10 个字符之间',
              trigger: 'blur'
            }
          ],
          birthday: [
            {
              required: true,
              message: '生日不能为空',
              trigger: 'blur'
            }
          ],
        },
        // 禁止选择的日期条件（true为禁止选择）
        editStudentBirthdayOptions: {
          disabledDate(date) {
            return date.getTime() > ( Date.now() - 24 * 60 * 60 * 1000 )
          }
        },
        // loading状态
        loadingVisible: false,
      }
    },
    methods: {
      /**
       * 确认修改学生
       */
      _handleEditStudent: function() {
        // 表单校验
        this.$refs['editStudentForm'].validate((valid) => {
          if (valid) {
            this._editStudent()
          } 
        })
      },

      /**
       * 修改学生点击
       * @param (object)student：当前修改学生
       */
      _editStudentClick: function(student) {
        this.editStudentForm.id = student.stu_id
        this.editStudentForm.name = student.stu_name
        this.editStudentForm.birthday = student.birthday
        this.editStudentForm.gender = student.gender 
        this.editStudentForm.avatar = student.stu_head
        this.editStudentDialogVisible = true
      },

      /**
       * 请求修改学生信息
       */
      _editStudent: function() {
        requestPatchStudent(this.editStudentForm) 
          .then(res => {
            if (res.code === 200) {
              // console.log('requestPatchStudent SUCCESS', res)
              this.$VMessage('success', '学生信息修改成功')
              this.editStudentDialogVisible = false
              this._getStudents()
            } 
            else {
              // console.log('requestPatchStudent FAIL', res)
              this.$VMessage('error', '学生信息修改失败')
            }
          })
      },

      /**
       * 获取学生列表
       */
      _getStudents: function() {
        this.loadingVisible = true
        requestGetStudents()
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)
            if (res.code === 200) {
              // console.log('requestGetStudents SUCCESS', res)
              
              this.students.list = res.data.list
              this.students.count = res.data.count
              // 设置男女比例
              if (res.data.sex != null) {
                this.students.maleCount = res.data.sex.male_num
                this.students.femaleCount = res.data.sex.female_num
              }
            }
          })  
      }
    },
    created: function() {
      // 请求学生列表
      this._getStudents()
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .class-student
    .student-list
      position absolute
      top 60px
      right 0
      bottom 0
      left 0
      overflow-y auto
      padding 20px 20px 0

  @media screen and (max-width: 1600px)
    .class-student
      .student-list
        padding 0
</style>

