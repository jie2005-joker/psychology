import {createRouter, createWebHistory } from 'vue-router'
import {ElMessage} from 'element-plus'

const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: () => import('@/components/backendLayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        // meta 就是路由的 “附加配置箱”
        meta: {
          title: "数据分析",
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: "知识文章",
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultations',
        component: () => import('@/views/consultations.vue'),
        meta: {
          title: "咨询记录",
          icon: 'Message'
        }
      },
      {
        path: 'emotion',
        component: () => import('@/views/emotion.vue'),
        meta: {
          title: "情绪日志",
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/components/authLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册'
        }
      }
    ]
  }
]

const frontendRoutes = [
  {
    path: '/',
    component: () => import('@/components/frontendLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/views/home.vue')
      },
      {
        path: 'consultation',
        component: () => import('@/views/consultation.vue')
      },
      {
        path: 'emotionDiary',
        component: () => import('@/views/emotionDiary.vue')
      },
      {
        // 知识库
        path: 'knowledgeBase',
        component: () => import('@/views/knowledgeBase.vue')
      },
      {
        path: '/knowledge/article/:id',
        component: () => import('@/views/articleDetail.vue'),
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory (),
  routes: [...backendRoutes, ...frontendRoutes],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 未登录
  if (!token) {
    if (to.path.startsWith('/back')) {
      ElMessage.error('请先登录')
      next('/auth/login')
    } else {
      next()
    }
    return
  }

  // 已登录 → 拿用户信息
  let userInfo = null
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo'))
  } catch (e) {}

  const userType = userInfo?.userType

  // ==========================================
  // 管理员（2）：只能访问后台，不能访问前台
  // ==========================================
  if (userType === 2) {
    // 已经在后台 → 放行
    if (to.path.startsWith('/back')) {
      next()
    } 
    // 不在后台 → 跳后台（关键：只在需要时跳）
    else if (from.path !== '/back/dashboard') {
      next('/back/dashboard')
    } 
    // 其他情况 → 必须放行！！！
    else {
      next()
    }
    return
  }

  // ==========================================
  // 普通用户（1）：禁止访问后台
  // ==========================================
  if (userType === 1) {
    if (to.path.startsWith('/back')) {
      ElMessage.error('无权限访问后台')
      next('/') // 跳首页
      return
    }
  }

  // 所有情况最终放行
  next()
})


export default router