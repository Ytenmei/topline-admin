import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/home')
      // @ 表示SRC目录，无论当前当前文件在哪里， @都是src
    },
    {
      name: 'layout',
      path: '/layout',
      component: () => import('@/views/layout')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
