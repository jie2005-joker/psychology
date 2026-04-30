import server from '@/utils/request'

export function register(data){
  return server.post('/user/add', data)
}

export function createSession(data){
  return server.post('/psychological-chat/session/start', data)
}

export function getSessionList(params){
  return server.get('/psychological-chat/sessions', {params})
}

export function deleteSession(sessionId){
  return server.delete(`/psychological-chat/sessions/${sessionId}`)
}

// 获取会话详细
export function getSessionDetail(sessionId){
  return server.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 获取会话分析结果
export function getSessionAnalysis(sessionId){
  return server.get(`/psychological-chat/session/${sessionId}/emotion`)
}

// 提交情绪日记
export function submitEmotionDiary(data){
  return server.post('/emotion-diary', data)
}

// 获取推荐阅读
export function getRecommendList(params){
  return server.get('/knowledge/article/page', {params})
}

// 获取文章详情
export function getArticleDetail(id){
  return server.get(`/knowledge/article/${id}`)
}
 
