import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import router from './router'
import './styles/index.less'
import 'nprogress/nprogress.css'

// 配置 axios 的基础路由
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
//  往原型对象中添加成员
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
