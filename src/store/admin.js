import { defineStore } from 'pinia'
import {ref} from 'vue'


export const userAdminStore = defineStore('userAdmin', () => {
  const isCollapsed = ref(false)

  const toggleCollapsed = () => {
    isCollapsed.value = !isCollapsed.value
  }
  return {
    isCollapsed,
    toggleCollapsed
  }
})