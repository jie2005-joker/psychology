<template>
  <div class="container">
   
      <div class="title">
        <div class="title-text">
          <h2>创建您的账户</h2>
          <p>请填写注册信息</p>
        </div>
      </div>
      <div class="form-container">
        <el-form :model="formData" :rules="rules" ref="submitFormRefEl" >
          <el-form-item label="用户名" prop="username" label-position="top">
            <el-input v-model="formData.username" placeholder="请输入用户名" size="large"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" label-position="top">
            <el-input v-model="formData.email" placeholder="请输入邮箱" size="large"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname" label-position="top">
            <el-input v-model="formData.nickname" placeholder="请输入昵称(可选)" size="large"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" label-position="top">
            <el-input v-model="formData.phone" placeholder="请输入手机号(可选)" size="large"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-position="top">
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" size="large"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword" label-position="top">
            <el-input v-model="formData.confirmPassword" type="password" placeholder="请确认密码" size="large"></el-input>
          </el-form-item>
          <el-form-item>
             <el-button type="primary" size="large" class="btn" @click="submitForm">注册</el-button>
          </el-form-item>
        </el-form>
       
        <div class="footer">
          <p>已有账号？</p>
        </div>
      </div>
  </div>
</template>

<script setup>
import {ref, reactive } from 'vue';
import { register } from '@/api/frontend'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
const router = useRouter()
const submitFormRefEl = ref(null)
const formData = reactive({
  "username": "",
  "email": "",
  "nickname": "",
  "phone": "",
  "password": "",
  "confirmPassword": "",
  "gender": 1, //（1 男 2 女）
  "userType": 1, //权限（默认传1）
});

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    // 自定义校验：判断两次密码是否相同
    {
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const submitForm = async () => {
  submitFormRefEl.value.validate(async (valid) => {
    if (!valid) return

    try {
      const res = await register(formData)
      console.log("注册返回：", res)

      // ✅ 正确逻辑
      if(!res){
        ElMessage.error(res.msg || '注册失败')
        return
      }
      ElMessage.success('注册成功')
      router.push('/auth/login')

    } catch (err) {
      ElMessage.error('网络异常或服务器错误')
      console.error(err)
    }
  })
}

// const submitForm = async () => {
//   submitFormRefEl.value.validate(async (valid) => {
//     if (!valid) return

//     try {
//       // 打印 1：你传给后端的完整数据
//       console.log("【发送给后端】", formData);

//       const res = await register(formData);

//       // 打印 2：后端原始返回结果
//       console.log("【后端返回】", res);

//       if (res.success) {
//         ElMessage.success("注册成功！");
//       } else {
//         ElMessage.error(res.msg || "注册失败");
//       }

//     } catch (err) {
//       console.error("【catch错误】", err);
//     }
//   })
// }

</script>

<style lang="scss" scoped>
.container {
  width: 384px;
  .flex-box {
    display: flex;
    align-items: center;
  }
  .title {
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 30px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
