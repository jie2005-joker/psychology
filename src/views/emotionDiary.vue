<template>
  <div class="emotionDiary-container">
    <div class="header-section">
      <div class="header-content">
        <el-icon style="font-size: 30px;"><Notebook /></el-icon>
        <h1>情绪日记</h1>
      </div>
    </div>
    <div class="content">
      <!-- 今日情绪评分 -->
      <div class="diary-card">
        <div class="title">今日情绪评分</div>
        <div class="section">
          <p>您今天的整体情绪状态如何?(1-10分)</p>
          <el-rate
            v-model="emotionData.moodScore"
            :texts= "emotionStatus"
            show-text
            :max="10"
            size="large"
          />
        </div>
      </div>
      <!-- 主要情绪 -->
      <div class="diary-card">
        <div class="title">主要情绪</div>
        <div class="emotion-grid">
          <div class="emotion-card" v-for="item in mainEmotion" :key="item.name" @click="selectEmotion(item.name)" :class="{'selected' : item.name===emotionData.dominantEmotion}">
            <el-image
              :src="item.url"
              style="width: 50px; height: 50px;"
            />
            <p class="emotion-name">{{item.name}}</p>
          </div>
        </div>
      </div>   
      <div class="diary-card">
        <div class="title">情绪触发</div>
        <div class="detail-form">
          <div class="form-label">情绪触发因素</div>
          <el-input 
            v-model="emotionData.emotionTriggers" 
            placeholder="请输入情绪触发因素" 
            :rows="3" 
            type="textarea"
            :maxlength="1000" 
            show-word-limit
            clearable
            />
          <div class="form-label">今日感想</div>
          <el-input 
            v-model="emotionData.diaryContent" 
            placeholder="写下你今天的想法,感受或发生的有趣事情" 
            :rows="5" 
            type="textarea"
            :maxlength="2000" 
            show-word-limit
            clearable
          />
          <div class="life-indicators">
             <div class="indicator-group">
               <div class="form-label">
                睡眠质量
              </div>
              <el-select
                v-model="emotionData.sleepQuality"
                placeholder="请选择睡眠质量"
                >
                <el-option label="很差" value=1 />
                <el-option label="较差" value=2 />
                <el-option label="一般" value=3 />
                <el-option label="好" value=4 />
                <el-option label="非常好" value=5 />
              </el-select>
             </div>
              <div class="indicator-group">
                <div class="form-label">
                  压力等级
                </div>
                <el-select
                  v-model="emotionData.stressLevel"
                  placeholder="请选择压力等级"
                  >
                  <el-option label="较低" value=1 />
                  <el-option label="低" value=2 />
                  <el-option label="中" value=3 />
                  <el-option label="高" value=4 />
                  <el-option label="极高" value=5 />
                  </el-select>
              </div>
          </div>
          <div class="action-buttons">
            <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="submitForm">提交记录</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {reactive} from 'vue'
import {dayjs, ElMessage} from 'element-plus'
import {submitEmotionDiary} from '@/api/frontend'
const mainEmotion = [
  {name: '开心', url: new URL('@/assets/images/开心.png', import.meta.url).href},
  {name: '平静', url: new URL('@/assets/images/平静.png', import.meta.url).href},
  {name: '焦虑', url: new URL('@/assets/images/焦虑.png', import.meta.url).href},
  {name: '悲伤', url: new URL('@/assets/images/悲伤.png', import.meta.url).href},
  {name: '兴奋', url: new URL('@/assets/images/兴奋.png', import.meta.url).href},
  {name: '疲惫', url: new URL('@/assets/images/疲惫.png', import.meta.url).href},
  {name: '惊讶', url: new URL('@/assets/images/惊讶.png', import.meta.url).href},
  {name: '困惑', url: new URL('@/assets/images/困惑.png', import.meta.url).href},
]
const emotionStatus = ['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']
const emotionData = reactive({
  diaryDate: dayjs().format('YYYY-MM-DD'),
  moodScore: 0,
  dominantEmotion: '',
  emotionTriggers: '',
  diaryContent: '',
  sleepQuality: null,
  stressLevel: null
})

const selectEmotion = (name) => {
  emotionData.dominantEmotion = name
}

// 重置表单
const resetForm = () => {
  Object.assign(emotionData, {
    diaryDate: dayjs().format('YYYY-MM-DD'),
    moodScore: 0,
    dominantEmotion: '',
    emotionTriggers: '',
    diaryContent: '',
    sleepQuality: null,
    stressLevel: null
  })
}

// 提交记录
const submitForm = () => {
  emotionData.sleepQuality = Number(emotionData.sleepQuality)
  emotionData.stressLevel = Number(emotionData.stressLevel)
  if(!emotionData.moodScore){
    ElMessage.error('请选择情绪评分')
    return
  }
  submitEmotionDiary(emotionData).then(res => {
    ElMessage.success('提交成功')
    resetForm()
  })
}
</script>

<style scoped lang="scss">
.emotionDiary-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .header-section {
        background: linear-gradient(135deg, #7ED321 0%, #F5A623 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        margin: 0 auto;
        width: 980px;
        padding: 20px;
        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            .title {
                margin-bottom: 20px;
                font-size: 25px;
                font-weight: 600;
                color: #374151;
            }
            .section {
                margin-bottom: 20px;
                p {
                    font-size: 15px;
                    color: #6B7280;
                    margin-bottom: 15px;
                }
            }
            .emotion-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                .emotion-card {
                    padding: 15px;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    text-align: center;
                    cursor: pointer;
                    background: #F9FAFB;
                    .emotion-name {
                        margin-top: 10px;
                        padding: 0 75px;
                        color: #374151;
                    }
                    &.selected {
                        border-color: #7ED321;
                        background: #F0FDF4;
                        transform: translateY(-3px);
                    }
                }
            }
            .detail-form {
                .form-label {
                    margin: 10px 0;
                    color: #374151;
                }
                .life-indicators {
                    display: flex;
                    gap: 20px;
                    .indicator-group {
                        flex: 1;
                    }
                }
                .action-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 40px
                }
            }
        }
    }
}
</style>
