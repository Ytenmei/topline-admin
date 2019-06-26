<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="特殊资源">
    <el-radio-group v-model="form.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="活动区域">
    <el-select v-model="form.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="活动形式">
    <el-date-picker
      v-model="form.value1"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">查询</el-button>
  </el-form-item>
</el-form>
    </el-card>
    <!-- /筛选区域 -->
    <!-- 列表 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>共找到15条符合条件的内容</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
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
        style="width: 100%">
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
          prop="status"
          label="状态">
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--
      分页默认10条数据，接口没有指定数据，则默认为10条
      一：分多少页
      二：页面改变加载对应的页码数据
     -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="handleCurrentChange"
      >
      <!-- 当前页改变时触发触发 -->
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [], // 列表数据
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        value1: ''
      },
      totalCount: 0
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    loadArticles (page = 1) { // 函数参数的默认值
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page, // 请求数据的页码，不穿默认为1
          per_page: 20 // 请求数据的每页大小，默认为10
        }
      }).then(data => {
        console.log(data)
        this.articles = data.results // 列表数据
        this.totalCount = data.total_count // 总记录数
      })
    },
    onSubmit () {
      console.log('submit！')
    },
    handleCurrentChange (page) {
      // 当页码发生改变的时候，请求该页码对应的数据
      // console.log(page)
      this.loadArticles(page)
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 20px;
}
</style>
