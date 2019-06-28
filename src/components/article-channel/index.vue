<template>
<!--
  el-select 组件
  value属性，用来绑定同步的数据
 -->
  <el-select :value="value" clearable @change="handleChange">
    <el-option
    v-for="item in channels"
    :key="item.id"
    :label="item.name"
    :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ArticleChannel',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    loadChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        this.channels = data.channels
      }).catch(err => {
        console.log(err)
        this.$message.error('加载频道列表失败')
      })
    },
    handleChange (val) {
      // console.log(value)
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
