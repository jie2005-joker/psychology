<template>
  <!-- 表格查询单组件 -->
  <div>
    <el-form :model="formData" ref="ruleFormRef" :gutter="24">
      <el-row>
        <template v-for="item in itemCol" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop" style="margin-right: 20px;">
          <component :is="isComp(item.comp)" v-model="formData[item.prop]" :placeholder="item.placeholder">
            <template v-if="item.comp === 'select'">
              <el-option label="全部" value="" />
              <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value" />
            </template>
          </component>
          </el-form-item>
        </el-col>
        </template>
      </el-row>
      <el-row>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="info" @click="resetForm(ruleFormRef)">重置</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const ruleFormRef = ref()
const emit = defineEmits(['search'])
const formData = reactive({})
console.log(formData)

const props = defineProps({
  itemList: {
    type: Array,
    default: () => []
  }
})
const isComp = (comp) => {
  return {
    'input': 'elInput',
    'select': 'elSelect'
  }[comp]
}

const itemCol = computed(() => {
    const {itemList} = props
    itemList.forEach(item => {
      item.col = {xs: 24, sm: 12, md: 8, lg: 6, xl: 6}
    })
    return itemList
})

const handleSearch = () => {
  emit('search', formData)
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  emit('search', formData)
}

</script>

<style scoped>
</style>