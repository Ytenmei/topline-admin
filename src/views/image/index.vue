<template>
  <el-card class="image-card">
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active">
        <el-radio-button
        label="全部"
        @click.native="loadImages()"></el-radio-button>
        <el-radio-button
        label="收藏"
        @click.native="loadImages(true)"></el-radio-button>
      </el-radio-group>
      <!-- <el-button type="primary">上传图片</el-button> -->
      <!--
        on-success 是一个prop参数
        prop 绑定的数据时一个表达式
       -->
      <el-upload
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="{ Authorization: `Bearer ${$store.state.user.token}`}"
        name="image"
        :on-success="handleUpload"
        :show-file-list="false">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-row :gutter="20">
      <el-col :span="5" v-for="item in images" :key="item.id">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style="height:200px;max-width: 100%"/>
          <div style="padding: 10px; display: flex; justify-content: center;">
            <el-button
            type="primary"
            @click="handleCollect(item)"
            :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" circle plain></el-button>
            <el-button
            type="primary"
            @click="handleDelete(item)"
            icon="el-icon-delete"
            circle plain></el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'ImageList',
  data () {
    return {
      active: '全部',
      images: []
    }
  },
  created () {
    this.loadImages()
  },
  methods: {
    // 记载素材图片
    async loadImages (collect = false) {
      this.$http({
        method: 'GET',
        url: '/user/images',
        params: {
          collect // true:为收藏图片； false为全部图片
        }
      }).then(data => {
        console.log(data)
        this.images = data.results
      })
    },
    // 收藏图片
    handleCollect (item) {
      const collect = !item.is_collected
      this.$http({
        method: 'PUT',
        url: `/user/images/${item.id}`,
        data: {
          collect: collect
        }
      }).then(data => {
        item.is_collected = collect
        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}收藏成功`
        })
      }).catch(err => {
        console.log(err)
        this.$message.error(`${collect ? '' : '取消'}收藏失败`)
      })
    },
    // 删除图片
    handleDelete (item) {
      console.log(item)
      this.$confirm('确认删除素材图片吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.loadImages()
        }).catch(err => {
          console.log(err)
          this.$message.error('删除失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleUpload () {
      this.loadImages(false)
    }
  }
}

</script>

<style lang="less" scoped>
.image-card {
  .action {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between
  }
}
</style>
