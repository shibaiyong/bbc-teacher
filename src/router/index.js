/**
 * @Desc: 路由定义
 */
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 登陆
const Login = r => require.ensure([], () => r(require('page/login')), 'Login')

// 忘记密码
const ForgetPassword = r => require.ensure([], () => r(require('page/forget-password')), 'ForgetPassword')
const IdentityCheck = r => require.ensure([], () => r(require('page/forget-password/identity-check')), 'IdentityCheck')
const ResetPassword = r => require.ensure([], () => r(require('page/forget-password/reset-password')), 'ResetPassword')
const ResetComplete = r => require.ensure([], () => r(require('page/forget-password/reset-complete')), 'ResetComplete')

// 注册
const Register = r => require.ensure([], () => r(require('page/register')), 'Register')
const Authentication = r => require.ensure([], () => r(require('page/register/authentication')), 'Authentication')
const SetPassword = r => require.ensure([], () => r(require('page/register/set-password')), 'SetPassword')
const RegisterComplete = r => require.ensure([], () => r(require('page/register/register-complete')), 'RegisterComplete')

// 首页
const Home = r => require.ensure([], () => r(require('page/home')), 'Home')

// 开心上课
const AttendClass = r => require.ensure([], () => r(require('page/attend-class')), 'AttendClass')

// 轻松备课
const PrepareLesson = r => require.ensure([], () => r(require('page/prepare-lesson')), 'PrepareLesson')
const PrepareLessonOnline = r => require.ensure([], () => r(require('page/prepare-lesson/prepare-lesson-online')), 'PrepareLessonOnline')
const PrepareLessonDisk = r => require.ensure([], () => r(require('page/prepare-lesson/prepare-lesson-disk')), 'PrepareLessonDisk')
const MaterialLibrary = r => require.ensure([], () => r(require('page/prepare-lesson/material-library')), 'MaterialLibrary')

// 班级管理
const ClassManage = r => require.ensure([], () => r(require('page/class-manage')), 'ClassManage')
const ClassStudent = r => require.ensure([], () => r(require('page/class-manage/class-student')), 'ClassStudent')

// 我的收藏
const MyCollection = r => require.ensure([], () => r(require('page/my-collection')), 'MyCollection')

// 路由定义
const routers = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/forget-password',
    name: 'forget-password',
    component: ForgetPassword,
    redirect: '/forget-password/identity-check',
    children: [
      {
        path: 'identity-check',
        name: 'identity-check',
        component: IdentityCheck,
        meta: {
          title: '身份验证'
        }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPassword,
        meta: {
          title: '重置登录密码'
        }
      },
      {
        path: 'reset-complete',
        name: 'reset-complete',
        component: ResetComplete,
        meta: {
          title: '完成重置'
        }
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    redirect: '/register/authentication',
    children: [{
      path: 'authentication',
      name: 'authentication',
      component: Authentication,
      meta: {
        title: '身份验证'
      }
    },
    {
      path: 'set-password',
      name: 'set-password',
      component: SetPassword,
      meta: {
        title: '设置密码'
      }
    },
    {
      path: 'register-complete',
      name: 'register-complete',
      component: RegisterComplete,
      meta: {
        title: '完成注册'
      }
    }
  ]},
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      title: '首页',
      requireAuth: true
    }
  },
  {  
    path: '/attend-class',
    name: 'attend-class',
    component: AttendClass,
    meta: {
      title: '开心上课',
      requireAuth: true
    }
  },
  {
    path: '/prepare-lesson',
    name: 'prepare-lesson', 
    component: PrepareLesson,
    redirect: '/prepare-lesson/prepare-lesson-online',
    children: [{
      path: 'prepare-lesson-online',
      name: 'prepare-lesson-online', 
      component: PrepareLessonOnline,
        meta: {
          title: '在线备课',
          requireAuth: true
        }
      },
      {
        path: 'prepare-lesson-disk',
        name: 'prepare-lesson-disk',
        component: PrepareLessonDisk,
        meta: {
          title: '备课云盘',
          requireAuth: true
        },
      },
      {
        path: 'material-library',
        name: 'material-library',
        component: MaterialLibrary,
        meta: {
          title: '素材库',
          requireAuth: true
        },
      }
    ]
  },
  {
    path: '/class-manage',
    name: 'class-manage',
    component: ClassManage,
    redirect: '/class-manage/class-student',
    children: [{
      path: 'class-student',
      name: 'class-student', 
      component: ClassStudent,
        meta: {
          title: '在班学生',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/my-collection',
    name: 'my-collection',
    component: MyCollection,
    meta: {
      title: '我的收藏',
      requireAuth: true
    },
  },
  {
    path: '*',
    redirect: '/login'
  },
]

const router = new Router({
  linkActiveClass: 'router-active',
  routes: routers
})

export default router
