
import server from '@/utils/request'

export function login(data) {
  return server.post('/user/login', data)
}

export function getCategoryTree() {
  return server.get('/knowledge/category/tree')
}

export function articlePage(params) {
  return server.get('/knowledge/article/page', {params})
}

export function addArticle(data) {
  return server.post('/knowledge/article', data)
}
 
export function uploadImage(file, businessInfo){
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')
  return server.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取文章详情
export function getArticleDetail(id) {
  return server.get(`/knowledge/article/${id}`)
}

// 更新文章
export function updateArticle(data) {
  return server.put(`/knowledge/article/${data.id}`, data)
}

// 下线文章
export function unpublishArticle(id, data) {
  return server.put(`/knowledge/article/${id}/status`, data)
}

// 上线文章
export function publishArticle(id, data) {
  return server.put(`/knowledge/article/${id}/status`, data)
}

// 删除文章
export function deleteArticle(id) {
 return server.delete(`/knowledge/article/${id}`)
}

// 获取咨询记录
export function getConsultations(params) {
  return server.get('/psychological-chat/sessions', {params})
}

// 获取咨询记录详情
export function getConsultationDetail(sessionId) {
  return server.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 获取情绪日志
export function getEmotionLogs(params) {
  return server.get('/emotion-diary/admin/page', {params})
}

// 删除情绪日志
export function deleteEmotionLog(id) {
  return server.delete(`/emotion-diary/admin/${id}`)
}

// 获取数据分析
export function getAnalysisData() {
  return server.get('/data-analytics/overview')
}

// 退出登录
export function logout() {
  return server.post('/user/logout')
}
