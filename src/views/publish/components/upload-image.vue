<template>
  <div>
    <div class="box-wrap" @click="handleShowMdiaBox">
      <p>点击选择图片</p>
      <i
      style="margin-top: 20px;
      font-size: 90px;color: #eee;"
      class="iconfont icon-image_upload"
      ></i>
      <img src="" width="120">
    </div>
      <!-- 对话框 -->
    <el-dialog
      title="素材"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleShowMdiaBox () {
      // 显示弹窗
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.box-wrap {
  width: 200px;
  height:200px;
  border:1px solid #eee;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center
}
</style>
