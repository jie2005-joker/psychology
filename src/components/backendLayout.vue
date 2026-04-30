<!-- vue 组件 -->
 <template>
  <div class="backend-layout">
    <el-container class="main-container">
      <sideBar />
      <el-container>
        <el-header>
          <navBar />
        </el-header>
        <el-main class="main-content">
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import sideBar from './sideBar.vue'
import navBar from './navBar.vue'
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-container {
    height: 100%;
    .el-header{
      height: 74px !important;
    }
    .content-container {
      padding: 20px;
      background-color: #fff;
      min-height: calc(100% - 74px);
    }
  }
}
</style>
