import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import JSONbig from 'json-bigint'

import router from './router'
import './styles/index.less'
import 'nprogress/nprogress.css'

// 配置 axios 的基础路由
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
// 使用JSONbig处理返回数据中超出JS安全整数范围的数字
// JSON自己会处理数据中的数字
// 后端的数据id超出了js的安全整数范围，会导致报错
// 可以使用JSON-bigint 来处理
axios.defaults.transformResponse = [function (data) {
  // data是未经处理的后端响应数据：JSON格式字符串
  return JSONbig.parse(data)
}]
// Axios 请求拦截器
// 所有axios发起的请求都需要经过这里
// return config 允许通过的方式
// config 是本次请求相关的配置
axios.interceptors.request.use((config) => {
  // console.log(config)
  // 添加本地储存用户信息
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  if (userInfo) { // 如果登陆了，才给那些需要token的接口统一添加token
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  // 让所有经过这里的aixos请求都添加token信息
  return config
}, error => {
  return Promise.reject(error)
})

// Axios 响应拦截器
// 所有axios发情的响应都需要经过这里
axios.interceptors.response.use((response) => {
  return response.data.data
}, error => {
  // 本地储存的用户信息状态码
  const status = error.response.status
  // 判断
  if (status === 401) {
    // 删除用户信息
    window.localStorage.removeItem('user_info')
    // 跳转到login页面
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})
//  往原型对象中添加成员
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
