<template>
<!--
  el-menu
  default-active 制定默认激活的菜单项
  @open \@close 展示和收起菜单项的时候会触发
  background-color 设置菜单栏的背景色
  text-color 设置菜单栏文本颜色
  active-text-color 设置激活时候的高亮颜色
  el-submenu
  index 导航标识，可以用作路由导航路径
  router // 是否使用vue-router的模式，启动弄该模式会激活导航时以index作为path进行路由跳转
 -->
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    router
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-menu-item index="/">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>内容管理</span>
      </template>
    <el-menu-item index="/publish">
      <i class="el-icon-menu"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-menu"></i>
      <span slot="title">内容列表</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="el-icon-menu"></i>
      <span slot="title">评论列表</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="el-icon-menu"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>粉丝管理</span>
      </template>
    <el-menu-item index="2-2">
      <i class="el-icon-menu"></i>
      <span slot="title">图文数据</span>
    </el-menu-item>
    <el-menu-item index="/fans/overview">
      <i class="el-icon-menu"></i>
      <span slot="title">粉丝概况</span>
    </el-menu-item>
    <el-menu-item index="2-4">
      <i class="el-icon-menu"></i>
      <span slot="title">粉丝画像</span>
    </el-menu-item>
    <el-menu-item index="2-5">
      <i class="el-icon-menu"></i>
      <span slot="title">粉丝列表</span>
    </el-menu-item>
    </el-submenu>
    <el-menu-item index="account">
      <i class="el-icon-setting"></i>
      <span slot="title">账户设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {

    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
