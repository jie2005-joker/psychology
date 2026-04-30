<template>
  <div class="knowledge-container">
    <div class="header-section">
      <div class="header-content">
        <el-icon size="30"><Collection /></el-icon>
        <h1>情绪知识库</h1>
      </div>
    </div>
    <div class="content">
      <div class="recommend-section">
        <div class="section-title">
          推荐阅读
        </div>
        <div class="recommend-list">
          <div class="recommend-item" v-for="item in recommendList" :key="item.id" @click="handleArticleDetail(item.id)">
            <h4>{{item.title}}</h4>
            <p class="read-count">
              <el-icon><Histogram /></el-icon>
              阅读量 {{item.readCount}}
            </p>
          </div>
        </div>
      </div>
      <div class="article-list">
        <div class="article-item" v-for="item in articleList" :key="item.id" @click="handleArticleDetail(item.id)">
          <el-image :src="getImg(item.coverImage)" style="width: 240px;
            height: 150px;"></el-image>
          <div class="info">
            <div class="title">
              <h3>{{item.title}}</h3>
              <el-tag type="primary">{{ item.categoryName }}</el-tag>
            </div>
            <div style="margin-top: 10px;">
              <div class="flex-box">
                <el-icon><Avatar /></el-icon>
                <span>{{ item.authorName }}</span>
              </div>
              <div class="flex-box">
                <el-icon><List /></el-icon>
                <span>{{ item.updatedAt }}</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <el-icon><Platform /></el-icon>
              <span style="margin-left: 5px;">观看人数 {{ item.readCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-wrapper">
      <el-pagination 
      layout="prev, pager, next" 
      :total="pagination.total" 
      @change="changeCurrentPage"/>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, reactive} from 'vue'
import {getRecommendList} from '@/api/frontend'
import {useRouter} from 'vue-router'
const router = useRouter()
const recommendList = ref([])

const articleList = ref([])

const changeCurrentPage = (page) => {
  pagination.currentPage = page
  getArticleList()
}

const handleArticleDetail = (id) => {
  router.push(`/knowledge/article/${id}`)
}



// 处理图片路径
const getImg = (img) => {
  return img ? 'http://159.75.169.224:1235' + img : 'https://file.itndedu.com/psychology_ai.png'
}

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})

const getArticleList = () => {
  const params = {
    sortField: 'publishedAt',
    sortDirection: 'desc',
    ...pagination
  }
  getRecommendList(params).then(res => {
    articleList.value = res.records
    pagination.total = res.total
  })
}

onMounted(() =>{
  // 获取文章列表
  getArticleList()
  // 获取推荐阅读列表
  getRecommendList({
    sortField: 'readCount',
    sortDirection: 'desc',
    currentPage: 1,
    size: 5
  }).then(res => {
    // console.log(res)
    recommendList.value = res.records
  })

})
</script>

<style scoped lang="scss">
.knowledge-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .flex-box {
        display: flex;
        align-items: center;
        span {
            margin-left: 10px;
        }
    }
    .header-section {
        background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        display: flex;
        gap: 20px;
        margin: 0 auto;
        width: 1200px;
        padding: 20px;
        .recommend-section {
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 15px;
            height: 400px;
            .section-title {
                font-size: 12;
                font-weight: 600;
                color: #374151;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .recommend-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                .recommend-item {
                    border-left: 4px solid #f59e0b;
                    padding-left: 10px;
                    cursor: pointer;
                    .read-count {
                        margin-top: 15px;
                        font-size: 12px;
                        color: #6b7280;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
        .article-list {
            flex: 1;
            .article-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                cursor: pointer;
                .info {
                    margin-left: 20px;
                    .title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
    }
    .pagination-wrapper {
        display: flex;
        justify-content: center;
        padding-bottom: 30px;
    }
}
</style>

