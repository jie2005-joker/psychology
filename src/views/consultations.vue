<template>
  <div>
    <pageHead title="咨询记录" />
    <el-table :data="sessionData" style="width: 100%;" stripe>
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar fit="fill" style="font-size: 10px;">{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志">
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-content">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column label="消息数" prop="messageCount" width="100"  align="center"/>
      <el-table-column label="咨询时间" prop="lastMessageTime" width="200" align="center" />
      <el-table-column label="操作" width="100" align="center">
        <template #default="scope">
          <el-button text type="primary" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination layout="prev, pager, next" :total="page.total" @current-change="handleCurrentChange" />
    </div>
  </div>
  <el-dialog title="咨询记录详情" v-model="dialogVisible" width="70%">
    <div class="session-detail">
      <div class="detail-header">
        <div class="detail-row">
          <div class="detail-label">用户名</div>
          <div class="detail-value">{{ detailContent.userNickname }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">开始时间</div>
          <div class="detail-value">{{ detailContent.startedAt }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">消息数</div>
          <div class="detail-value">{{ detailContent.messageCount }}</div>
        </div>
      </div>
      <div class="messages-container">
        <div class="messages-header">
          <h3>对话记录</h3>
        </div>
        <div class="messages-list">
          <div v-for="message in dialogDetail" :key="message.id" class="message-item" :class="message.senderType === 1 ? 'user-message' : 'ai-message'">
            <div class="message-header">
              <div class="sender">{{ message.senderType === 1 ? '用户' : 'AI助手' }}</div>
              <div class="time">
                {{ message.createdAt }}
              </div>
            </div>
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import pageHead from '@/components/pageHead.vue'
import { getConsultations, getConsultationDetail } from '@/api/admin'
import { onMounted, ref } from 'vue'

const sessionData = ref([])

const dialogVisible = ref(false)
const detailContent = ref({})
const dialogDetail = ref([])
// 分页切换
const handleCurrentChange = (val) => {
  page.value.currentPage = val
  handleSearch()
}

// 分页参数
const page = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
}) 

// 获取咨询记录列表
const handleSearch = () => {
  getConsultations(page.value).then(res => {
    const {records, total} = res
    // console.log(res)
    sessionData.value = records
    page.value.total = total
  })
}
onMounted(() => {
  handleSearch()
})

const handleDetail = (row) => {
  console.log(row)
  dialogVisible.value = true
  detailContent.value = row
  getConsultationDetail(row.id).then(res => {
    // detailContent.value.messages = res
    // console.log(res)
    dialogDetail.value = res
  })
}
</script>

<style lang="scss" scoped>
.session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
.session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
}

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h3 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }

        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
</style>