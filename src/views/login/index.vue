<template>
  <div class="login-wrap">
    <div class="login-form-waro">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form ref="ruleForm" :model="form" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- 栅格布局 -->
            <el-col :span="10">
            <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
            <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
                                                <!--要么是null要么是定时器     三元表达式判断        -->
            <el-button @click="handleSendCode" :disabled="!!codeTimer || codeLoging ">{{ codeTimer ? `剩余${codeSecons}秒`:'获取验证码'}}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree" @change=handleYen></el-checkbox>
            <span>我已阅读并同意
              <a href="#">用户协议
              </a>和
              <a href="#">隐私条款
              </a></span>
          </el-form-item>
          <el-form-item>
            <el-button class="btn-login" type="primary" @click="handleLogin" :loading="loginLoding" :disabled='isDisable'>登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
const initCodeSeconds = 60
export default {
  name: 'AppLogin',
  data () {
    return {
      // 表单数据
      form: {
        mobile: '',
        code: '',
        // 是否同意用户协议
        agree: false
      },
      isDisable: true,
      // 登录按钮的loding 状态
      loginLoding: false,
      // 倒计时事件
      codeSecons: initCodeSeconds,
      // 倒计时定时器
      codeTimer: null,
      sendMobile: '', // 保存初始化验证之后的手机号
      // 表单验证规则
      codeLoging: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度必须为11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度为6位字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      // 通过initGeetest 得到的极验验证码对象
      captchaObj: null
    }
  },
  methods: {
    handleLogin () {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录
        this.submitLogin()
      })
    },
    submitLogin () {
      this.loginLoding = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => {
        this.$message({
          showClose: true,
          message: '登陆成功',
          type: 'success'
        })
        this.loginLoding = false
        this.$router.push({
          name: 'home'
        })
      }).catch(error => {
        if (error.response.status === 400) {
          this.$message.error('登陆失败!手机号或者验证错误')
        }
        this.loginLoding = false
      })
    },
    handleSendCode () {
      // 校验手机号
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        // 判断返回的结果：输入手机号为空字符串，没输为空字符串
        if (errorMessage) {
          return
        }

        if (this.captchaObj) {
          if (this.form.mobile !== this.sendMobile) {
            // 在重新初始化之前，把之前初始化后的插件DOM删除掉
            document.body.removeChild(document.querySelector('.geetest_panel '))
            // 重新初始化
            this.showGeetest()
          } else {
            this.captchaObj.verify()
          }
        } else {
          this.showGeetest()
        }
        // 手机号码有效，才初始化验证码插件
        // this.showGeetest()
      })
    },
    showGeetest () {
      // const { mobile } = this.form
      // 判断70行
      this.codeLoging = true
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${this.form.mobile}`
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
          // 只有 Read了才能显示代码
          captchaObj.onReady(() => {
            this.sendMobile = this.form.mobile
            captchaObj.verify()
            // 验证码初始化好
            this.codeLoging = false
          }).onSuccess(() => {
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
            captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${this.form.mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              this.codeCountDown()
            })
          })
        })
      })
    },
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeSecons--
        if (this.codeSecons <= 0) {
          this.codeSecons = initCodeSeconds
          window.clearInterval(this.codeTimer)
          this.codeTimer = null
        }
      }, 1000)
    },
    handleYen () {
      if (this.form.agree === true) {
        this.isDisable = false
      } else {
        this.isDisable = true
      }
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
