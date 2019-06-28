  // 过滤出有效的数据字段
<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
      </div>
      <el-form ref="form" :model="filterParams" label-width="80px">
      <el-form-item label="状态">
    <el-radio-group v-model="filterParams.status">
      <el-radio label="">全部</el-radio>
      <el-radio v-for="(item, index) in statTypes"
      :key="item.label"
      :value="index + ''"
      :label="index">{{ item.label }}</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="频道">
    <article-channel v-model="filterParams.channel_id"></article-channel>
  </el-form-item>
  <el-form-item label="时间">
    <el-date-picker
    value-format="yyyy-MM-dd"
    v-model="begin_end_pubdate"
    @change="handleDateChange"
      type="daterange"
      rage-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" :loding="articleLoding" @click="onSubmit">查询</el-button>
  </el-form-item>
</el-form>
    </el-card>
    <!-- /筛选区域 -->
    <!-- 列表 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>共找到<strong>{{ totalCount }}</strong>条符合条件的内容</span>
      </div>
      <!-- table 表格 -->
      <!--
        data 用来指定表格的数据
        表格不需要我们手动遍历
        只需要把数据给el-table的data属性就可
        然后配置 el-table-column 需要展示的数据字段即可
       -->
      <el-table
        class="list-table"
        :data="articles"
        style="width: 100%"
        v-loading="articleLoding">
        <el-table-column
            label="封面"
          width="60">
          <!-- 表格列默认只能输出文本，需要自定义里面的内容 -->
          <!-- slot-scope是插槽作用域
            scope（自定义名字）其中有一成员为row
            scope.row为当前遍历对象
          -->
          <template slot-scope="scope">
            <img width="30" :src="scope.row.cover.images[0]" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布日期"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
          <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="success" plain>修改</el-button>
            <el-button type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--
      分页默认10条数据，接口没有指定数据，则默认为10条
      一：分多少页
      total 总记录数
      current-page 高亮的当前页码数据
      二：页面改变加载对应的页码数据
     -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :current-page="page"
      :disabled="articleLoding"
      @current-change="handleCurrentChange"
      >
      <!-- 当前页改变时触发触发 -->
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
export default {
  name: 'ArticleList',
  components: {
    ArticleChannel
  },
  data () {
    return {
      articles: [], // 列表数据
      // form: {
      //   name: '',
      //   region: '',
      //   date1: '',
      //   date2: '',
      //   delivery: false,
      //   type: [],
      //   resource: '',
      //   desc: '',
      //   value1: ''
      // },
      totalCount: 0,
      articleLoding: false, // 控制文档加载中loding效果
      page: 1, // 当前页码
      statTypes: [ // 文章状态
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      filterParams: {
        status: '', // 文章状态
        channel_id: '', // 频道ID
        begin_pubdate: '', // 开始事件
        end_pubdate: '' // 结束事件
      },
      begin_end_pubdate: [] // 存储日期选择器同步的开始时间，和结束时间(傀儡)
    }
  },
  created () {
    // 加载文章列表
    this.loadArticles()
  },
  methods: {
    loadArticles (page = 1) { // 函数参数的默认值
      this.articleLoding = true
      const fileterDate = {}
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          fileterDate[key] = this.filterParams[key]
        }
      }
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page, // 请求数据的页码，不穿默认为1
          per_page: 10, // 请求数据的每页大小，默认为10
          ...fileterDate
        }
      }).then(data => {
        console.log(data)
        this.articles = data.results // 列表数据
        this.totalCount = data.total_count // 总记录数
        this.articleLoding = false
      })
    },
    onSubmit () {
      // console.log('submit！')
      this.page = 1 // 让分页组件的页码回到第一页
      this.loadArticles() // 加载第一页的数据
    },
    handleCurrentChange (page) {
      // 当页码发生改变的时候，请求该页码对应的数据
      // console.log(page)
      this.loadArticles(page)
    },
    handleDelete (article) {
      // console.log(article.id)
      this.$confirm('确认删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        this.$http({ // 取消执行
          method: 'DELETE',
          url: `http://ttapi.research.itcast.cn/mp/v1_0/articles/${article.id}`
        }).then(data => {
          // 提示删除成功
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新加载数列表
          this.loadArticles(this.page)
        })
      }).catch(() => { // 取消执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 日期选择组件改变事件
    handleDateChange (value) {
      // console.log(value)
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 20px;
}
</style>
