<template>
  <div class="container">
    <!-- 登录头部 -->
    <div class="title">
      <!-- 返回首页 -->
      <div class="back">
        <el-icon><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <!-- 登录标题 -->
      <div class="login-title">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <!-- 登录表单 -->
     <div class="login-form">
      <el-form :model="formData" label-position="top" :rules="rule" ref="ruleFormRef">
        <el-form-item label="用户名或邮箱">
          <el-input v-model="formData.username" prop="username" size="large" placeholder="请输入用户名或邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.password" prop="password" size="large" placeholder="请输入密码" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item  >
          <el-button type="primary" @click="submitForm(ruleFormRef)" size="large" class="login-btn">登录账户</el-button>
        </el-form-item>
      </el-form>
      <!-- 登录提示 -->
      <div class="login-tip">
        <p>还没有账户？<router-link to="/auth/register">注册账户</router-link></p>
      </div>
     </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {login} from '@/api/admin'

const ruleFormRef = ref()
const formData = reactive({
  username: '',
  password: ''
})
const rule = reactive({
  username: [
    {require: true, message: "请输入用户名或邮箱", trigger: 'blur'}
  ],
  password: [
    {require: true, message: "请输入密码", trigger: 'blur'}
  ]
})
const submitForm = async (formEl) => {
  if(!formEl) return 
  await formEl.validate((valid,fields) => {
    if(valid){
      // console.log(fields)
      login(formData).then(res => {
        // console.log(res)
        localStorage.setItem('token', res.token)
        localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        if(res.userInfo.userType === 2){
          location.href = '/back'
        }else{
          location.href = '/'
        }
      }).catch(err => {
        console.dir(err)   
    })
    }
  })
}
</script>

<style scoped>
.container{
  width: 384px;
  .title{
    margin-bottom: 20px;
    .back{
      margin-bottom: 60px;
    }
    .login-title{
      text-align: center;
      h2{
        font-size: 36px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }
      p{
        font-size: 18px;
        color: rgb(91, 85, 85);
      }
    }
  }
  .login-form{
    .login-btn{
      margin-top: 25px;
      width: 100%;
    }
  }
  .login-tip{
    text-align: center;
    margin-top: 25px;
  }
}
</style>