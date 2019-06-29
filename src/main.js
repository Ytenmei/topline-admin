import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from './store'

import router from './router'
import './styles/index.less'
import 'nprogress/nprogress.css'

// 配置 axios 的基础路由
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 使用JSONbig处理返回数据中超出JS安全整数范围的数字
// JSON自己会处理数据中的数字
// 后端的数据id超出了js的安全整数范围，会导致报错
// 可以使用JSON-bigint 来处理
// 拦截器，未经处理的后端数据
axios.defaults.transformResponse = [function (data) {
  // data是未经处理的后端响应数据：JSON格式字符串
  // JSONbig.parse 类似于JSON.parse，其作用是将JSON格式字符转成JS对象。
  // 区别是：JSONbig.parse会检测被转换数据中的数字是否超出了JS的安全整数范围，如果超出，它会做特殊处理
  // 如果data 不是一个JSON格式字符串，会导致JSONbig.parse转换失败并异常
  // 执行删除操作，后端返回一个204状态码，但是没有返回任何空字符串，也就是空状态码
  // 这里JSONbig.parse(空字符串)，所以报错了
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
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
  // return response.data.data
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
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
  store,
  render: h => h(App)
}).$mount('#app')
