# 心理健康助手 (Psychology Health Assistant)

🧠 一个完整的心理健康咨询平台，提供 AI 心理咨询、情绪日记、心理健康知识文章等功能，包含用户端和管理后台。

## ✨ 核心功能

### 👤 用户端功能

#### 💬 心理咨询聊天
- **AI 心理咨询会话**：创建一对一的心理咨询对话
- **会话管理**：查看历史咨询记录、删除会话
- **情绪分析**：自动分析咨询对话中的情绪状态
- **消息记录**：完整保存咨询对话内容

#### 📔 情绪日记
- **情绪记录**：提交每日情绪日记
- **情绪追踪**：记录和管理个人情绪变化

#### 📚 心理健康知识库
- **文章浏览**：阅读心理健康相关文章
- **文章详情**：支持 Markdown 渲染的文章详情页面
- **推荐阅读**：根据用户偏好推荐文章
- **知识分类**：树形结构的知识分类体系

#### 🔐 用户认证
- **用户注册**：新用户注册功能
- **用户登录**：安全的登录验证

### 🛠️ 管理后台功能

#### 📊 数据看板
- **数据概览**：平台整体数据统计
- **数据分析**：用户行为、咨询量等分析

#### 📝 文章管理
- **文章 CRUD**：创建、编辑、删除文章
- **文章上下线**：控制文章发布状态
- **封面图上传**：支持文章封面图片上传
- **富文本编辑**：集成 WangEditor 富文本编辑器
  - 支持 16+ 种字体大小
  - 13+ 种字体选择（包括中英文字体）
  - 丰富的颜色选择（40+ 种颜色）
  - 背景色设置
  - 标题、列表、引用等格式化功能
  - 链接插入、撤销/重做

#### 💬 咨询管理
- **咨询记录查看**：查看所有用户的咨询会话
- **会话详情**：查看完整的咨询对话内容
- **情绪日志管理**：查看和删除用户情绪日记

#### 🏷️ 分类管理
- **知识分类树**：管理文章分类的层级结构

## 🚀 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | Vue 3 (Composition API + `<script setup>`) |
| **构建工具** | Vite |
| **UI 组件库** | Element Plus |
| **富文本编辑器** | WangEditor (@wangeditor/editor-for-vue) |
| **路由管理** | Vue Router |
| **HTTP 客户端** | Axios (封装于 `src/utils/request`) |
| **语言** | JavaScript |

## 📁 项目结构

psychology/
├── public/ 静态公共资源
├── src/
│ ├── api/ API 接口层
│ │ ├── admin.js 后台管理 API
│ │ └── frontend.js 用户端 API
│ ├── assets/ 资源文件 (样式、图片等)
│ ├── components/ 可复用组件
│ │ ├── MarkdownRenderer.vue Markdown 渲染组件
│ │ ├── RichTextEditor.vue 富文本编辑器组件
│ │ ├── articleDialog.vue 文章对话框组件
│ │ ├── authLayout.vue 认证页面布局
│ │ └── backendLayout.vue 后台管理布局
│ ├── config/ 配置文件
│ ├── views/ 页面级组件
│ │ ├── articleDetail.vue 文章详情页
│ │ ├── consultation.vue 心理咨询聊天页
│ │ ├── consultations.vue 咨询记录列表页
│ │ ├── dashboard.vue 数据看板页
│ │ └── ...
│ ├── utils/ 工具函数
│ │ └── request.js Axios 请求封装
│ ├── App.vue 根组件
│ └── main.js 应用入口
├── .github/workflows/ GitHub Actions CI/CD
├── .vscode/ VSCode 配置
├── index.html HTML 入口
├── package.json 项目依赖
├── vite.config.js Vite 配置


## 🛠️ 开发指南

### 环境要求

- **Node.js**: >= 16.x
- **npm**: >= 8.x

### 安装依赖

```bash
npm install

启动开发服务器
bash

npm run dev

访问 http://localhost:5173 预览项目。
构建生产版本
bash

npm run build

构建产物输出到 dist/ 目录。
预览生产构建
bash

npm run preview

API 接口说明

项目使用 Axios 封装了统一的请求工具 (src/utils/request)，API 分为两层：

用户端 API (src/api/frontend.js):

    register(data) - 用户注册
    createSession(data) - 创建咨询会话
    getSessionList(params) - 获取会话列表
    getSessionDetail(sessionId) - 获取会话消息
    getSessionAnalysis(sessionId) - 获取情绪分析
    submitEmotionDiary(data) - 提交情绪日记
    getRecommendList(params) - 获取推荐文章
    getArticleDetail(id) - 获取文章详情

管理端 API (src/api/admin.js):

    login(data) / logout() - 管理员登录/退出
    getCategoryTree() - 获取分类树
    articlePage(params) - 文章分页列表
    addArticle(data) / updateArticle(data) - 添加/更新文章
    publishArticle(id) / unpublishArticle(id) - 上线/下线文章
    deleteArticle(id) - 删除文章
    uploadImage(file, businessInfo) - 图片上传
    getConsultations(params) - 获取咨询记录
    getEmotionLogs(params) - 获取情绪日志
    getAnalysisData() - 获取数据分析

🔧 配置说明
富文本编辑器配置

RichTextEditor.vue 组件支持以下配置：
javascript

// 自定义工具栏
toolbarKeys: [
  'bold', 'italic', 'underline', 'color', 'bgColor',
  'fontSize', 'fontFamily',
  'header1', 'header2', 'header3',
  'bulletedList', 'numberedList', 'blockquote',
  'insertLink', 'undo', 'redo'
]

// 字数限制
maxCharCount: 2000  // 默认最大字符数

// 最小高度
minHeight: '300px'

Vite 配置

编辑 vite.config.js 修改：

    开发服务器端口
    API 代理配置
    构建选项
    插件配置


📝 开发规范

    使用 Vue 3 Composition API (<script setup> 语法)
    组件采用 PascalCase 命名
    API 调用统一封装在 src/api/ 目录
    页面级组件放在 src/views/
    可复用组件放在 src/components/
    使用 Element Plus 作为 UI 组件库

🎨 特色功能
1. 富文本编辑器

    字数统计和进度条显示
    支持 40+ 种治愈系配色方案
    中英文字体支持（Arial、微软雅黑、宋体、楷体等）
    16 档字体大小选择
    实时内容同步（v-model 双向绑定）

2. 心理咨询系统

    完整的会话管理流程
    情绪分析集成
    历史咨询记录可追溯

3. 双端架构

    用户端：简洁友好的咨询和阅读界面
    管理端：功能完善的内容和数据管理

🤝 贡献

欢迎提交 Issue 和 Pull Request！
📄 许可证

MIT
📞 项目信息

    项目地址: https://github.com/jie2005-joker/psychology
    作者: @jie2005-joker
    创建时间: 2026

