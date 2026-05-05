<template>
  <!-- 导航栏组件 -->
  <div class="nav-bar">
    <div class="flex-box">
      <el-button @click="toggleSide">
        <el-icon>
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
      </el-button>
      <!-- 导航区域,在屏幕宽度小于600px且侧边栏展开时,隐藏该标题 -->
      <p class="nav-title" :class="{ hidden: !isCollapse }">
        {{ route.meta.title }}
      </p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar :src="img" alt="默认头像" />
          <p class="user-name" style="margin-left: 15px; margin-right: 6px">
            {{ userInfo?.username || "杰" }}
          </p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
const img = new URL("@/assets/images/1.png", import.meta.url).href;
import { userAdminStore } from "@/store/admin";
const userAdmin = userAdminStore();
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
import { logout } from "@/api/admin";

import { computed, ref } from "vue";
import { ElMessageBox } from "element-plus";
// import { Fold, Expand } from '@element-plus/icons-vue'
function toggleSide() {
  userAdmin.toggleCollapsed();
}
const isCollapse = computed(() => userAdmin.isCollapsed);
//   return isCollapsed.value ? Fold : Expand
// })

const userInfo = ref(null);
userInfo.value = JSON.parse(localStorage.getItem("userInfo")) || {};
// console.log(userInfo.value);
const handleCommand = (command) => {
  console.log(command);
  if (command === "logout") {
    // 退出登录逻辑
    ElMessageBox.confirm("确定退出登录吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      // 退出登录逻辑
      logout().then(() => {
        // ElMessage.success("退出登录成功");
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        router.push("/auth/login");
      });
    });
  }
};
</script>

<style scoped>
.nav-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 24, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;

  .flex-box {
    height: 100%;
    display: flex;
    align-items: center;
    .nav-title {
      font-size: 24px;
      font-weight: bold;
      margin-left: 20px;
    }
    @media (max-width: 600px) {
      .hidden {
        display: none;
      }
    }
  }
}
</style>
