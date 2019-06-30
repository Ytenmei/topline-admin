<template>
  <el-card class="publish-card">
  <div slot="header" class="header">
    <span>更新文章</span>
    <div>
      <el-button :loading="publishLoading" type="success" @click="handlePublish(false)">更新</el-button>
      <el-button :loading="publishLoading" type="primary" @click="handlePublish(true)">存入草稿</el-button>
    </div>
  </div>
  <el-form v-loading="editLoading" >
    <el-form-item>
      <el-input type="text" v-model="articleForm.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item>
      <!-- <el-input type="textarea" v-model="articleForm.content"></el-input> -->
       <!-- bidirectional data binding（双向数据绑定） -->
      <quill-editor
        v-model="articleForm.content"
        ref="myQuillEditor"
        :options="editorOption"
        >
      </quill-editor>
    </el-form-item>
    <el-form-item label="封面"></el-form-item>
    <el-form-item label="频道">
      <!--
        组件通信：
        父传子：Props Down
        子传父  Events Up
       -->
      <article-channel
        v-model="articleForm.channel_id"
      ></article-channel>
      <!-- <article-channel
        :value="articleForm.channel_id"
        @input="articleForm.channel_id = $event"
      ></article-channel> -->
      <!-- <el-select v-model="articleForm.channel_id">
        <el-option label="区域一" value="shanghai"></el-option>
      </el-select> -->
    </el-form-item>
  </el-form>
</el-card>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'AppEdit',
  components: {
    ArticleChannel,
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: '', // 标题
        content: '', // 内容
        cover: { // 封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: '' // 频道
      },
      editorOption: {}, // 富文本编辑器参数选项
      editLoading: false, // 记载文章时的Loding效果
      publishLoading: false, // 更新时禁用按钮
      formDirty: false // 内容脏否
    }
  },
  watch: {
    articleForm: {
      handler () { // 当被监视数据发生改变时，这里会被调用
        this.formDirty = false
      },
      deep: true // 对象、数据需要深度监视，普通数据则不需要
      // immediate： true或false //默认只有当被监视成员发生改变的时候才会调用监视函数
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    articleID () {
      return this.$route.params.id
    }
  },
  created () {
    // 编辑页面直接调用监视数据
    this.watchForm()
    this.loadArticle()
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  },
  methods: {
    // 获取文章内容
    loadArticle () {
      // 加载文章时的loding效果
      this.editLoading = true
      this.$http({
        method: 'GET',
        url: `/articles/${this.articleID}`
      }).then(data => {
        this.articleForm = data
        this.editLoading = false
        // 加载文章后调用watchForm查看数据是否更改
        // 数据的修改并不是立即出发试图的更新
        // 监视器的监视先y于真正的数据修改执行。最后的结果看formDirty
        // Vue 提供了这样的一个API，简单理解就是延时调用
        this.$nextTick(() => {
          this.watchForm()
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('加载文章详情失败')
      })
    },
    // 更新时按钮状态
    handlePublish (draft = false) {
      this.publishLoading = true // 禁用按钮点击状态
      this.submitEdit(draft).then(() => {
        this.publishLoading = false
      })
    },
    // 修改文章
    submitEdit (draft) {
      return this.$http({
        method: 'PUT',
        url: `/articles/${this.articleID}`,
        data: this.articleForm, // 发布文章的数据
        params: {
          draft
        }
      }).then(data => {
        this.$message({
          type: 'success',
          // 判断draft
          message: draft === true ? '保存草稿成功' : '更新成功'
        })
        this.$router.push({ name: 'article-list' })
      }).catch(err => {
        console.log(err)
        this.$message.error(draft === true ? '保存草稿失败' : '更新失败')
      })
    },
    // 监视页面数据是否有改动
    watchForm () {
      const unWacth = this.$watch('articleForm', function () {
        this.formDirty = true
        unWacth()
      }, {
        deep: true
      })
    }
  },
  // 当要从当前导航到另一个路由的时候被触发
  // 我么可以再这控制路由离开的行为
  // 若有未保存的数据，提示用户
  // to 要去那么可
  // from 来自哪里
  // next 允许通过的方法
  beforeRouteLeave (to, from, next) {
    // 如果编辑页面加载完毕后，没有被用户修改过（formDirty），则让导航直接通过
    if (this.formDirty) {
      return next()
    }
    const answer = window.confirm('当前页面有未保存的数据，确认离开吗？')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
}
</script>

<style lang="less" scoped>
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
