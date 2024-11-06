<template>
  <div class="login">
    <div class="login-box">
      <img src="@/assets/login.jpg" alt="">
      <div class="login-form">
        <el-form v-if="isLogin" ref="loginForm" :model="loginForm" :rules="loginRules">
          <div class="login-form-title">
            <h1>项目管理系统</h1>
          </div>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
              prefix-icon="iconfont icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="iconfont icon-lock"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              class="login-btn"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="toggleForm">
              注册新账号
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 注册表单 -->
        <el-form v-else ref="registerForm" :model="registerForm" :rules="registerRules">
          <div class="login-form-title">
            <h1>注册</h1>
          </div>
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              type="text"
              auto-complete="off"
              placeholder="用户名"
              prefix-icon="iconfont icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="iconfont icon-lock"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              prefix-icon="iconfont icon-lock"
            />
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              class="login-btn"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleRegister"
            >
              <span v-if="!loading">注册</span>
              <span v-else>注册中...</span>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="toggleForm">
              已有账号？登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'LoginRegister',
})
export default class extends Vue {
  private isLogin = true // 控制表单切换
  private loading = false

  // 登录表单
  private loginForm = {
    username: '',
    password: '',
  }

  // 注册表单
  private registerForm = {
    username: '',
    password: '',
    confirmPassword: '',
  }

  // 登录验证规则
  loginRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  }

  // 注册验证规则
  registerRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
    ],
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      { validator: this.validateConfirmPassword, trigger: 'blur' },
    ],
  }

  // 确认密码验证
  private validateConfirmPassword(rule: any, value: string, callback: Function) {
    if (value !== this.registerForm.password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
  // 切换登录/注册表单
  private toggleForm() {
    this.isLogin = !this.isLogin
  }
  // 登录处理
  private handleLogin() {
    (this.$refs.loginForm as any).validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true
        await UserModule.Login(this.loginForm as any)
          .then((res: any) => {
            if (String(res.code) === '1') {
              this.$router.push('/')
            } else {
              // this.$message.error(res.msg)
              this.loading = false
            }
          })
          .catch(() => {
            // this.$message.error('用户名或密码错误！')
            this.loading = false
          })
      } else {
        return false
      }
    })
  }
  // 注册处理
  private async handleRegister() {
  (this.$refs.registerForm as Form).validate(async (valid: boolean) => {
    if (valid) {
      this.loading = true
      try {
        const result = await UserModule.Register(this.registerForm as any)
        // Check if registration was successful by examining result structure
        if (result.code === 1) { // Assuming code '1' means success
          this.$message.success('注册成功，请登录')
          // Redirect to login screen after successful registration
          this.isLogin = true // Switch to login form
          this.loading = false // Reset loading state
        } else {
          // Display a message or handle registration failure
          this.$message.error(result.msg || '注册失败，请稍后再试')
          this.loading = false
        }
      } catch (error) {
        // Handle the error, possibly display a user-friendly message
        this.$message.error('注册过程中发生错误，请稍后重试')
        this.loading = false
      }
    }
  })
}
}
</script>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #333;
}

.login-box {
  width: 1000px;
  height: 474.38px;
  border-radius: 8px;
  display: flex;
  img {
    width: 60%;
    height: auto;
  }
}

.login-form {
  background: #ffffff;
  width: 40%;
  border-radius: 0px 8px 8px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    width: 214px;
    height: 307px;
  }
}

.login-btn {
  border-radius: 17px;
  padding: 11px 20px !important;
  margin-top: 10px;
  font-weight: 500;
  font-size: 12px;
  border: 0;
  color: #333333;
  background-color: #1287d0;
  &:hover,
  &:focus {
    background-color: #1287d0;
    color: #ffffff;
  }
}

.login-form-title {
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}
</style>
