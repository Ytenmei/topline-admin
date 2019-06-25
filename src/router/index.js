import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home')
    //   // @ 表示SRC目录，无论当前当前文件在哪里， @都是src
    // },
    {
      path: '/',
      component: () => import('@/views/layout'),
      children: [ // 所有children 路由都显示到父路由的router-view中
        {
          name: 'home',
          path: '', // 它就是layout 的默认路由子路由
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish', // 它就是layout 的默认路由子路由
          component: () => import('@/views/publish')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
