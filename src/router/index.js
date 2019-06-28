import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
Vue.use(Router)

const router = new Router({
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
        { // 发布文章
          name: 'publish',
          path: '/publish', // 它就是layout 的默认路由子路由
          component: () => import('@/views/publish')
        },
        { // 编辑文章
          name: 'publish-edit',
          path: '/publish/:id', // 它就是layout 的默认路由子路由
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article', // 它就是layout 的默认路由子路由
          component: () => import('@/views/article')
        },
        {
          name: 'article-comment',
          path: '/comment', // 它就是layout 的默认路由子路由
          component: () => import('@/views/comment')
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
// router.beforeEach((to, from, next) => {
//   nprogress.start()
//   // 如果是非/login 页面，判断其登录状态
//   // console.log(to)
//   const userInfo = (window.localStorage.getItem('user_info'))
//   if (to.path !== '/login') {
//     // 如果没有登录，让其跳转到登录页
//     if (!userInfo) {
//       return next({ name: 'login' })
//     }
//     next()
//   } else {
//     // 登录页面，允许通过
//     // next()
//     // 注意：如果登录了，就不允许访问登录页了
//     if (userInfo) {
//       next(false)
//     } else {
//       // 没有登录，才允许访问登录页
//       next()
//     }
//   }
//   // 如果了登录了，则允许通过
// })
router.afterEach((to, from) => {
  nprogress.done()
})
export default router
