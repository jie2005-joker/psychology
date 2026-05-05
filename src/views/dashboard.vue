<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card v-if="analysisData?.systemOverview" class="card">
          <div class="card-content">
            <div class="avatar users">
              <el-image
                :src="imgUrl1"
                style="width: 40px; height: 40px"
              ></el-image>
            </div>
            <div class="info">
              <div class="title">总用户数</div>
              <div class="value">
                {{ analysisData?.systemOverview?.totalUsers || 0 }}
              </div>
              <div class="subtitle-title">
                活跃用户: {{ analysisData?.systemOverview?.activeUsers || 0 }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="analysisData?.systemOverview" class="card">
          <div class="card-content">
            <div class="avatar like">
              <el-image
                :src="imgUrl2"
                style="width: 40px; height: 40px"
              ></el-image>
            </div>
            <div class="info">
              <div class="title">情绪日志</div>
              <div class="value">
                {{ analysisData?.systemOverview?.totalDiaries || 0 }}
              </div>
              <div class="subtitle-title">
                今日新增:
                {{ analysisData?.systemOverview?.todayNewDiaries || 0 }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="analysisData?.systemOverview" class="card">
          <div class="card-content">
            <div class="avatar comments">
              <el-image
                :src="imgUrl3"
                style="width: 40px; height: 40px"
              ></el-image>
            </div>
            <div class="info">
              <div class="title">咨询会话</div>
              <div class="value">
                {{ analysisData?.systemOverview?.totalSessions || 0 }}
              </div>
              <div class="subtitle-title">
                今日新增:
                {{ analysisData?.systemOverview?.todayNewSessions || 0 }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="analysisData?.systemOverview" class="card">
          <div class="card-content">
            <div class="avatar smile">
              <el-image
                :src="imgUrl4"
                style="width: 40px; height: 40px"
              ></el-image>
            </div>
            <div class="info">
              <div class="title">平均情绪</div>
              <div class="value">
                {{ analysisData?.systemOverview?.avgMoodScore || 0 }}/10
              </div>
              <div class="subtitle-title">情绪健康指数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card style="width: 100%">
          <template #header>
            <div class="chart-header">情绪趋势分析</div>
          </template>
          <div class="chart-content">
            <div ref="chartRef" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="width: 100%">
          <template #header>
            <div class="chart-header">咨询会话统计</div>
          </template>
          <div class="chart-content">
            <div
              v-if="analysisData?.consultationStats"
              class="consultation-stats"
            >
              <div class="stat-item">
                <div class="stat-label">总会话数</div>
                <div class="stat-value">
                  {{ analysisData.consultationStats.totalSessions }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">平均时长</div>
                <div class="stat-value">
                  {{ analysisData.consultationStats.avgDurationMinutes }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">活跃用户</div>
                <div class="stat-value">
                  {{ analysisData.systemOverview.activeUsers }}
                </div>
              </div>
            </div>
            <div
              ref="consultationChartRef"
              style="width: 100%; height: 260px"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px; width: 100%">
      <el-card style="width: 100%">
        <template #header>
          <div class="chart-header">用户活跃度趋势</div>
        </template>
        <div class="chart-content">
          <div ref="activityChartRef" style="width: 100%; height: 300px"></div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script setup>
import { getAnalysisData } from "@/api/admin";
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

const imgUrl1 = new URL("@/assets/images/users.png", import.meta.url).href;
const imgUrl2 = new URL("@/assets/images/like.png", import.meta.url).href;
const imgUrl3 = new URL("@/assets/images/comments.png", import.meta.url).href;
const imgUrl4 = new URL("@/assets/images/smile.png", import.meta.url).href;
const analysisData = ref(null);

const chartRef = ref(null);
const emotionChart = ref(null);

const emotionTrend = ref(null);
const trendDate = ref(null);
onMounted(() => {
  getAnalysisData().then((res) => {
    // console.log(res)
    analysisData.value = res;

    emotionTrend.value = res?.emotionTrend || [];
    initCharts();
  });
});

// 初始化图表
const initCharts = () => {
  initEmotionChart();
  initConsultationChart();
  initActivityChart();
};
const initEmotionChart = () => {
  // 检查是否有数据
  if (!chartRef.value) return;
  // 销毁旧图表实例
  if (emotionChart.value) {
    emotionChart.value.dispose();
  }
  emotionChart.value = echarts.init(chartRef.value);

  trendDate.value = analysisData.value.emotionTrend || [];

  emotionChart.value.setOption({
    title: {
      text: "情绪趋势分析",
      textStyle: {
        fontSize: 18,
        color: "#2d3436",
        fontWeight: "bold",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      backgroundColor: "#ffffff", // 必须加白色背景，边框才看得见
      borderColor: "#faebaf",
      borderWidth: 1,
      show: true,
      confine: true,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["平均情绪评分", "记录数量"],
      top: 40,
    },
    grid: {
      left: "3%",
      right: "3%",
      top: 80,
      bottom: "3%",
    },
    xAxis: {
      type: "category",
      data: trendDate.value.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "#2d3436",
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "情绪评分",
        position: "left",
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
      {
        type: "value",
        name: "记录数量",
        position: "right",
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
    ],
    series: [
      {
        name: "平均情绪评分",
        type: "line",
        yAxisIndex: 0,
        data: trendDate.value.map((item) => item.avgMoodScore),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#faebaf",
        },
        itemStyle: {
          color: "#faebaf",
        },
      },
      {
        name: "记录数量",
        type: "line",
        yAxisIndex: 1,
        data: trendDate.value.map((item) => item.recordCount),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#eeb5a3",
        },
        itemStyle: {
          color: "#eeb5a3",
        },
      },
    ],
  });
};

const consultationChart = ref(null);
const consultationChartRef = ref(null);
const initConsultationChart = () => {
  if (!consultationChartRef.value) return;
  if (consultationChart.value) {
    consultationChart.value.dispose();
  }
  consultationChart.value = echarts.init(consultationChartRef.value);

  const dailyTrend = analysisData.value.consultationStats.dailyTrend || [];

  consultationChart.value.setOption({
    title: {
      text: "咨询活动统计",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["会话数量", "参与用户数"],
      top: 40,
      textStyle: {
        color: "#636e72",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: dailyTrend.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      axisLabel: {
        color: "#636e72",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#636e72",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.1)",
        },
      },
    },
    series: [
      {
        name: "会话数量",
        type: "bar",
        data: dailyTrend.map((item) => item.sessionCount),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#74b9ff" },
              { offset: 1, color: "#0984e3" },
            ],
          },
        },
        barWidth: "40%",
      },
      {
        name: "参与用户数",
        type: "bar",
        data: dailyTrend.map((item) => item.userCount),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#fdcb6e" },
              { offset: 1, color: "#f39c12" },
            ],
          },
        },
        barWidth: "40%",
      },
    ],
  });
};

// 初始化用户活跃度趋势图表
const activityChart = ref(null);
const activityChartRef = ref(null);
const initActivityChart = () => {
  if (!activityChartRef.value) return;
  if (activityChart.value) {
    activityChart.value.dispose();
  }
  activityChart.value = echarts.init(activityChartRef.value);

  const userActivity = analysisData.value.userActivity;

  // 配置图表选项
  activityChart.value.setOption({
    title: {
      text: "用户活跃度趋势",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["活跃用户", "新增用户", "日记用户", "咨询用户"],
      top: 40,
      textStyle: {
        color: "#636e72",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: userActivity.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      axisLabel: {
        color: "#636e72",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#636e72",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.1)",
        },
      },
    },
    series: [
      {
        name: "活跃用户",
        type: "line",
        data: userActivity.map((item) => item.activeUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#a29bfe",
        },
        itemStyle: {
          color: "#a29bfe",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(162, 155, 254, 0.4)" },
              { offset: 1, color: "rgba(162, 155, 254, 0.1)" },
            ],
          },
        },
      },
      {
        name: "新增用户",
        type: "line",
        data: userActivity.map((item) => item.newUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fdcb6e",
        },
        itemStyle: {
          color: "#fdcb6e",
        },
      },
      {
        name: "日记用户",
        type: "line",
        data: userActivity.map((item) => item.diaryUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#00b894",
        },
        itemStyle: {
          color: "#00b894",
        },
      },
      {
        name: "咨询用户",
        type: "line",
        data: userActivity.map((item) => item.consultationUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fab1a0",
        },
        itemStyle: {
          color: "#fab1a0",
        },
      },
    ],
  });
};
</script>

<style scoped>
.dashboard-container {
  .card:hover {
    transform: scale(1.1);
    transition: all 0.3s ease-in-out;
  }
  .card-content {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }
    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }
      .value {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px;
      }
      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }
  .chart-content {
    padding: 20px;
    height: 300px;
    position: relative;

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .consultation-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }
}
</style>
