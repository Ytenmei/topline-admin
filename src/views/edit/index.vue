<template>
  <el-card class="publish-card">
  <div slot="header" class="header">
    <span>发布文章</span>
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
  name: 'APPEdit',
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
      publishLoading: false // 更新时禁用按钮
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
