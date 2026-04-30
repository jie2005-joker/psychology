import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import {pinia} from 'pinia'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)
// 注册element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
