<template>
  <div>
    <pageHead title="情绪日志" />
    <tableForm :itemList="tableItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%">
     <el-table-column prop="id" label="ID" width="80" />
     <el-table-column label="会话ID" width="100">
      <template #default="scope">
        <el-avatar style="font-size: 12px;">
          {{ scope.row.nickname }}
        </el-avatar>
      </template>
     </el-table-column>
     <el-table-column prop="diaryDate" label="记录日期" width="100" />
     <el-table-column label="情绪评分" align="center">
      <template #default="scope">
        <el-rate 
        v-model="scope.row.moodScore"
        :max="10" 
        :colors="colors"
        disabled/>
      </template>
     </el-table-column>
     <el-table-column label="生活指标" width="130">
      <template #default="scope">
        <div>
          <p>睡眠质量: {{ scope.row.sleepQuality }}</p>
          <p>压力: {{ scope.row.stressLevel }}</p>
        </div>
      </template>
     </el-table-column>
     <el-table-column label="日记内容" prop="diaryContent" width="160" />
     <el-table-column label="操作" align="center" fixed="right">
      <template #default="scope">
        <el-button text type="primary" @click="handleDetail(scope.row)">查看详情</el-button>
        <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
     </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="pagination.total" @current-change="handleCurrentChange" />
    <!-- 模态框详情 -->
     <el-dialog
      v-model="emotionDialogVisible"
      width="800px"
      title="情绪日志详情"
     >
      <div class="detail-content">
        <!-- <h4>用户信息</h4> -->
        <div class="detail-section" v-if="detailRow">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ detailRow.username }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ detailRow.nickname }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{ detailRow.userId }}</el-descriptions-item>
            <el-descriptions-item label="记录日期">{{ detailRow.diaryDate }}</el-descriptions-item>
          </el-descriptions>
        </div>

        

        <div class="detail-section" v-if="detailRow">
          <h4>情绪状态</h4>
           <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate 
                v-model="detailRow.moodScore"
                :max="10" 
                :colors="colors"
                show-score
                disabled/>
              </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getEmotionTagType(detailRow.dominantEmotion)">{{ detailRow.dominantEmotion }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量">{{ detailRow.sleepQuality }}/5</el-descriptions-item>
            <el-descriptions-item label="压力水平">{{ detailRow.stressLevel }}/5</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section" v-if="detailRow">
          <h4>日记内容</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="情绪触发因素">
                {{detailRow.emotionTriggers}}
              </el-descriptions-item>
              <el-descriptions-item label="日记内容">
                {{detailRow.diaryContent}}
              </el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="ai-analysis-result" v-if="aiEmotion">
          <h5>AI情绪分析结果</h5>
           <div class="ai-keywords-section">
              <!-- <h5>AI情绪分析结果</h5> -->
              <el-descriptions :column="2" border>
              <el-descriptions-item label="主要情绪">
                <el-tag :type="getAiEmotionTagType(aiEmotion.primaryEmotion)">{{ aiEmotion.primaryEmotion }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪强度">
                 <el-progress :percentage="aiEmotion.emotionScore" :color="getEmotionScoreColor(aiEmotion.emotionScore)"/>
              </el-descriptions-item>
              <el-descriptions-item label="风险等级">
                <el-tag :type="getRiskLevelTagType(aiEmotion.riskLevel)">{{ getRiskLevelText(aiEmotion.riskLevel) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪性质">
                <el-tag :type="aiEmotion.isNegative ? 'danger' : 'success'">{{ aiEmotion.isNegative ? '负面情绪' : '正面情绪' }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="ai-suggestion-section">
            <h5>专业建议</h5>
            <p>{{ aiEmotion.suggestion }}</p>
          </div>
          <div class="ai-risk-section">
            <h5>风险描述</h5>
            <p>{{ aiEmotion.riskDescription }}</p>
          </div>
          <div class="ai-improvements-section" style="border-bottom: 1px solid #ccc;">
            <h5>改善建议</h5>
            <ul>
              <li v-for="item in aiEmotion.improvementSuggestions" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
       <div v-if="aiEmotion?.timestamp" class="analysisTime" style="margin: 20px 0;">
        <span style="color: #909399; font-size: 14px;">分析时间：{{ aiEmotion.timestamp }}</span>
       </div>
       <div class="detail-section" v-if="detailRow">
          <h4>时间信息</h4>
           <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">
             {{ detailRow.createdAt }}
              </el-descriptions-item>
            <el-descriptions-item label="更新时间">
             {{ detailRow.updatedAt }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </template>
     </el-dialog>
  </div>
</template>

<script setup>
import pageHead from '@/components/pageHead.vue'
import tableForm from '@/components/tableForm.vue'
import { getEmotionLogs, deleteEmotionLog } from '@/api/admin.js'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const colors = ref(['red', 'orange', '#FFD700'])

// 情绪映射状态
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '开心': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}

// 表单配置
const tableItem = [
  {comp: 'input', prop: 'userId', label: '用户ID', placeholder: '请输入用户ID'},
  {comp: 'select', prop: 'emotionScoreRange', label: '情绪评分', placeholder: '请选择评分范围', options:
    [
      {label: '低分(1-3)', value: '1-3'},
      {label: '中分(4-6)', value: '4-6'},
      {label: '高分(7-10)', value: '7-10'},
    ]
  }
]

const tableData = ref([])

const params = ref({})
const handleSearch = (formData) => {
  console.log(formData)
  if(formData.emotionScoreRange === "7-10"){
    formData.minMoodScore = 7
    formData.maxMoodScore = 10
  }else if(formData.emotionScoreRange === "1-3"){
    formData.minMoodScore = 1
    formData.maxMoodScore = 3
  }else if(formData.emotionScoreRange === "4-6"){
    formData.minMoodScore = 4
    formData.maxMoodScore = 6
  }
  tableData.value = []
  params.value = {
    ...formData,
    ...pagination.value
  }
  getEmotionLogs(params.value).then(res => {
    // tableData.value = res.data
    // console.log(res)
    const {records, total} = res
    pagination.value.total = total
    tableData.value = records
  })
}

// 删除
const handleDelete = async (row) => {
  console.log(row)
  try{
    // 确认删除
    await ElMessageBox.confirm('确认删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await deleteEmotionLog(row.id)
    console.log(res)
    ElMessage.success('删除成功')
    handleSearch({})
  }catch(err){
    console.dir(err)
    ElMessage.error('删除失败')
  }
  
    
}

const emotionDialogVisible = ref(false)
const detailRow = ref(null)

const aiEmotion = ref(null)
const handleDetail = (row) => {
  // console.log(row)
  detailRow.value = row
  if(row.aiEmotionAnalysis){
    aiEmotion.value = JSON.parse(row.aiEmotionAnalysis) 
  }
  // console.log(aiEmotion.value)
  emotionDialogVisible.value = true
}
const handleClose = () => {
  emotionDialogVisible.value = false
  detailRow.value = null
  aiEmotion.value = null
}
// 分页
const pagination = ref({
  total: 0,
  size: 10,
  current: 1
})

onMounted(() => {
  handleSearch({})
})

// 切换分页
const handleCurrentChange = (val) => {
  pagination.value.current = val
  handleSearch(formData)
}
</script>

<style lang="scss" scoped>
.detail-content {
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>