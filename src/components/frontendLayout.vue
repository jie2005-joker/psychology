<template>
  <!-- 前台布局 -->
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image :src="robotImg" alt="心理健康AI助手"></el-image>
        <div class="brand-name">心理健康AI助手</div>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/consultation" class="nav-link" v-if="isLogin"
          >AI咨询</router-link
        >
        <router-link to="/emotionDiary" class="nav-link" v-if="isLogin"
          >情绪日记</router-link
        >
        <router-link to="/knowledgeBase" class="nav-link">知识库</router-link>
        <template v-if="!isLogin">
          <router-link to="/auth/login" class="nav-link">
            <el-button>登录</el-button>
          </router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button type="primary">注册</el-button>
          </router-link>
        </template>
        <template v-else>
          <el-button type="primary" @click="handleLogout">退出登录</el-button>
        </template>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2023 心理健康AI助手. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const robotImg = new URL("@/assets/images/robot.png", import.meta.url).href;

// 判断是否为登录状态
const isLogin = ref(false);
isLogin.value = localStorage.getItem("token") !== null;

// 退出登录
const handleLogout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userInfo")
  router.push("/auth/login")
}
</script>

<style lang="scss" scoped>
.frontend-layout {
  background-color: #fff;
  .navbar-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .brand-section {
      display: flex;
      align-items: center;
      .el-image {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background: white;
        padding: 6px;
        flex-shrink: 0;
      }
      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }
    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;
      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        &:hover {
          color: #4a90e2;
        }
      }
    }
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;
    margin-top: auto;
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
