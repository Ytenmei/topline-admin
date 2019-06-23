<template>
  <div class="login-wrap">
    <div class="login-form-waro">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form ref="form" :model="form" >
          <el-form-item >
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item >
            <!-- 栅格布局 -->
            <el-col :span="10">
            <el-input v-model="form.name" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
            <el-button @click="handleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-login" type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      },
      captchaObj: null
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleSendCode () {
      const { mobile } = this.form
      // 判断70行
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const data = res.data.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          // 隐藏按钮式
          product: 'bind'
        }, (captchaObj) => {
          // 调用
          this.captchaObj = captchaObj
          captchaObj.onReady(function () {
            captchaObj.verify()
          }).onSuccess(function () {

          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height:  100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #666;
  .login-form-waro {
    padding: 50px;
    background-color: #fff;

    .btn-login {
      width: 100%;
    }
    border-radius: 10px;
  }
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    img {
      width: 200px;
    }
  }
}
</style>
