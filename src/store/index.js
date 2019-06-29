// Vue 容器： 集中式状态（数据管理） 此处的数据和组件无关 任何组件都可以读取和修改
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 创建容器对象
const store = new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user_info'))
  },
  mutations: {
    changeUser (state, data) {
      // 修改容器中的用户信息，对象拷贝，将data中的数据成员拷贝到state.user中
      Object.assign(state.user, data)
      window.localStorage.setItem('user-info', JSON.stringify(state.user))
    }
  }
})

// 导出容器
export default store
