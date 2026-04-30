<template>
  <div>
    <pageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" class="add" @click="handleEdit({})">新增</el-button>
      </template>
    </pageHead>
    <tableForm :itemList="formItem" @search="handleSearch"/>
    <el-table :data="tableData" stripe style="width: 100%; margin-top: 30px;" >
      <el-table-column label="文章标题" width="230" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center; ">
              <el-icon><timer /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
              <el-icon><timer /></el-icon>
              <span style="margin-left: 10px">{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column prop="updatedAt" label="更新时间" width="150" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button text v-if="scope.row.status === 1" type="warning" @click="handleUnpublish(scope.row)">下线</el-button>
          <el-button text v-else type="success" @click="handlePublish(scope.row)">发布</el-button>
          <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="example-pagination-block" style="margin-top: 20px;">
      <el-pagination
       layout="prev, pager, next" 
       background  
       :total="pageList.total"
       v-model="pageList.currentPage"
       :page-size="pageList.size"
       @current-change="handleCurrentChange"
        />
    </div>
    <articleDialog v-model="dialogVisible"  :categoryList="categoryList" @submit="handleSuccess" :articleDetail="articleDetail"/>
  </div>

</template>

<script setup>
import {getCategoryTree, articlePage, getArticleDetail, unpublishArticle, publishArticle, deleteArticle} from '@/api/admin'
import {onMounted , reactive, ref} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 新增文章弹窗
import articleDialog from '@/components/articleDialog.vue'

const dialogVisible = ref(false)
const handleSuccess = () => {
  handleSearch()
}
const formData = ref({
  title: '',
  content: '',
})

const categoryMap = reactive({})

// 分类列表
const categoryList = ref([])

// 表格数据
const tableData = ref([])

onMounted(async () => {
  const res = await getCategoryTree()
  // categoryTree.value = res.data
  // console.log(res)
 categoryList.value = res.map(item => {
    categoryMap[item.id] = item.categoryName
    return {
      label: item.categoryName,
      value: item.id
    }

  })
  formItem[1].options = categoryList.value
  handleSearch({})
})
import pageHead from '@/components/pageHead.vue'
import tableForm from '@/components/tableForm.vue'
const formItem = [
  {comp: 'input', prop: 'title', label: '标题', placeholder: '请输入标题'},
  {comp: 'select', prop: 'categoryId', label: '分类', placeholder: '请选择分类'},
  {comp: 'select', prop: 'status', label: '状态', placeholder: '请选择状态', options: [
    {
    label: '草稿中',
    value: '0',
  },
  {
    label: '已发布',
    value: '1',
  },
  {
    label: '已删除',
    value: '2',
  },
  ]}
]

// 分页记录
const pageList = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})

const handleSearch = async (formData) => {
  // console.log(formData)
  const res = await articlePage({
    ...formData,
    ...pageList
  })
  // console.log(res)
  // const {records, total} = res.data
  tableData.value = res.records
  pageList.total = res.total
}

const handleCurrentChange = (val) => {
  pageList.currentPage = val
  handleSearch({})
}

// 编辑文章
const articleDetail = ref(null)
const handleEdit = (row) => {
  if(!row.id) {
    // 新增文章
    articleDetail.value = null
    dialogVisible.value = true 
  }
  else {
    getArticleDetail(row.id).then(res => {
    // console.log(res)
    articleDetail.value = res
    dialogVisible.value = true
  })
}
  
}

// 上线文章
const handlePublish = (row) => {
 try{
   ElMessageBox.confirm(
    `确定要发布文章${row.title}吗?`,
    '提示',
    {
      confirmButtonText: '确认发布',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const res = await publishArticle(row.id, {status: 1})
    ElMessage.success(`${res.statusText}`)
    handleSearch()
  })
 }
 catch(err){
  ElMessage.error(err.message)
 }
}

// 下线文章
const handleUnpublish = (row) => {
 try{
   ElMessageBox.confirm(
    `确定要下线文章${row.title}吗?`,
    '提示',
    {
      confirmButtonText: '确认下线',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const res = await unpublishArticle(row.id, {status: 2})
    // console.log(res)
    ElMessage.success(`${res.statusText}`)
    handleSearch()
  })
 }
 catch(err){
  ElMessage.error(err.message)
 }
}

// 删除文章
const handleDelete = (row) => {
 try{
   ElMessageBox.confirm(
    `确定要删除文章${row.title}吗?`,
    '提示',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'danger',
    }
  ).then(async () => {
    const res = await deleteArticle(row.id)
    // console.log(res)
    ElMessage.success("删除成功")
    handleSearch()
  })
 }
 catch(err){
  ElMessage.error(err.message)
 }
}
</script>

<style scoped>
.add{
  margin: 10px;
}
</style>