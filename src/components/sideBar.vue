<template>
  <el-aside width="ifCollapse? '64px' : '264px'">
    <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        default-active="2"
        class="menu-style"
      >
        <div class="brand" :class="{ 'brand-collapse': isCollapse }">
          <el-image :src="brandImg"></el-image>
          <div class="info-card" v-show="!isCollapse">
            <h1 class="brand-title">心理健康AI助手</h1>
            <p class="brand-subtitle">管理后台</p>
          </div>
        </div>
        <el-menu-item @click="changeMenu(item.path)" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
          <!-- component 组件 :is="item.meta.icon" 表示根据 item.meta.icon 动态渲染对应的图标组件 -->
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{item.meta.title}}</span>
        </el-menu-item>
      </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
// console.log(router)
import { userAdminStore } from '@/store/admin'
import { computed } from 'vue'
const userAdmin = userAdminStore()
const {isCollapsed, toggleCollapsed} = userAdmin
const isCollapse = computed(() => userAdmin.isCollapsed)
const changeMenu = (key) => {
  // router.push(key)
  // console.log(router.options.routes[0])
  const currentPath = router.options.routes[0].path
  router.push(currentPath + '/' + key)
}
const brandImg = new URL('@/assets/images/robot.png', import.meta.url).href


</script>
<style lang="scss" scoped>
.menu-style {
  height: 100%;
  .brand {
    display: flex;
    align-items: center;
    padding: 20px 16px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 8px;
    justify-content: center;
    .el-image {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      background: white;
      padding: 6px;
      flex-shrink: 0;
    }
    .info-card {
      .brand-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #1f2937;
      }
      .brand-subtitle {
        font-size: 14px;
        color: #6b7280;
      }
    }
  }
  .brand-collapse {
    padding: 10px 0;
    .el-image {
      width: 40px;
      height: 40px;
      margin-right: 0;
    }
  }
}
</style>