<template>
  <el-card class="publish-card">
  <div slot="header" class="header">
    <span>发布文章</span>
    <div>
      <el-button :loading="publishLoading" type="success" @click="handlePublish(false)">发布</el-button>
      <el-button :loading="publishLoading" type="primary" @click="handlePublish(true)">存入草稿</el-button>
    </div>
  </div>
  <el-form>
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
    <el-form-item label="封面">
      <el-radio-group v-model="articleForm.cover.type">
      <el-radio :label="1">单图</el-radio>
      <el-radio :label="3">三图</el-radio>
      <el-radio :label="0">无图</el-radio>
      <el-radio :label="-1">自动</el-radio>
    </el-radio-group>
    <template v-if="articleForm.cover.type > 0">
      <UploadImage v-for="item in articleForm.cover.type" :key="item.id"></UploadImage>
    </template>
    </el-form-item>
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
import UploadImage from './components/upload-image'
import ArticleChannel from '@/components/article-channel'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'AppPublish',
  components: {
    ArticleChannel,
    quillEditor,
    UploadImage
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
      publishLoading: false,
      formDirty: false // 内容脏否
    }
  },
  // 监视器，监视组件实例中的成员，
  // 当成员发生改变的时候，监视函数会被调用
  // 注意：这里的监视无法取消，重复监视
  // 需要取消的监视，可以通过this.$watch方式进行监视
  watch: {
    articleForm: {
      handler () { // 当被监视数据发生改变时，这里会被调用
        // console.log(123)
        this.formDirty = true
      },
      deep: true // 对象、数据需要深度监视，普通数据则不需要
      // immediate: true或false // 默认只有当被监视成员发生改变的时候才会调用监视函数。
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  created () {
    // 发布页面直接调用监视
    this.watchForm()
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  },
  methods: {
    // 发布时按钮状态
    handlePublish (draft = false) {
      this.publishLoading = true // 禁用按钮点击状态
      this.submitAdd(draft).then(() => {
        this.publishLoading = false
      })
    },
    // 发布文章
    submitAdd (draft) {
      return this.$http({
        method: 'POST',
        url: '/articles',
        data: this.articleForm, // 发布文章的数据
        params: {
          draft
        }
      }).then(data => {
        this.$message({
          type: 'success',
          message: draft === true ? '保存草稿成功' : '发布成功'
        })
        this.$router.push({ name: 'article-list' })
      }).catch(err => {
        console.log(err)
        this.$message.error(draft === true ? '保存草稿成功' : '发布失败')
      })
    },
    watchForm () {
      const unWatch = this.$watch('articleForm', function () {
        // console.log(this.formdDirty)
        this.formDirty = true
        unWatch()
      }, {
        deep: true
      })
    }
    // 当要从当前导航到另一个路由的时候被触发
    // 我么可以再这控制路由离开的行为
    // 若有未保存的数据，提示用户
    // to 要去那么可
    // from 来自哪里
    // next 允许通过的方法
  },
  beforeRouteLeave (to, from, next) {
    // 如果表单没有被用户修改过，则让导航直接通过
    if (!this.formDirty) {
      return next()
    }
    const answer = window.confirm('当前有未保存的数据，确认离开吗？')
    if (answer) {
      next()
    } else {
      // 取消当前导航
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
