<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑文章' : '新增文章'"
    width="900"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input v-model="formData.summary" type="textarea" placeholder="请输入文章摘要" maxlength="1000" show-word-limit :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tags"
          multiple
          filterable
          allow-create
          placeholder="请选择或输入标签(最多选择3个)"
          style="width: 100%"
          @change="tagJudge"
        >
          <el-option
            v-for="item in tagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片" prop="coverImage">
        <div>
          <el-upload 
         
          class="upload-image"
          action="#"
          :before-upload="beforeImgUpload"
          accept="image/*"
          :http-request="handleUploadRequest"
          :show-file-list="false"
        >
          <img v-if="imageUrl" :src="imageUrl" class="preview-image" />
          <div v-else >
            <p>点击上传封面图片</p>
          </div>
        </el-upload>
          <div style="margin-top: 10px;">
            <el-button v-if="imageUrl" type="danger" @click="removeImage">
          移除封面
          </el-button>
          </div>
        </div>
      </el-form-item>
      <!-- 文章内容 -->
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor 
        v-model="formData.content" 
        placeholder="请输入文章内容,支持富文本格式\n\n可以使用加粗,斜体,列表,标题等格式"
        :maxCharCount="5000"
        @change="handleContentChange"
        @create="handleContentCreate"
        min-height="400px"
        />
      </el-form-item>
    </el-form>
     <div v-if="previewVisible">
        <h3>预览文章内容</h3>
        <div v-html="formData.content"></div>
      </div>
    <template #footer>
     
      <el-button @click="previewVisible = !previewVisible">{{ previewVisible ? '取消预览' : '预览内容' }}</el-button>
      <el-button type="primary"  @click="handleSubmit">{{ isEdit ? '编辑' : '新增' }}</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
      
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref , reactive, nextTick, watch} from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { uploadImage,addArticle,updateArticle } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categoryList: {
    type: Array,
    default: () => []
  },
  articleDetail: {
    type: Object,
    default: null
   }
})

const isEdit = computed(() => !!props.articleDetail?.id)

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue',val)
  }
})

const imageUrl = ref('')
const beforeImgUpload = (file) => {
  //  console.log(file)
  if(!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
    return false
  }
  if(file.size / 1024 / 1024 > 5){
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}
const businessId = ref(null)
const handleUploadRequest = async ({file}) =>  {
  // 生成UUID
  businessId.value = crypto.randomUUID()

  const res = await uploadImage(file, {businessId: businessId.value}) 

  // console.log(res)
  imageUrl.value = fileBaseUrl + res.filePath
  formData.value.coverImage = res.filePath
}

const removeImage = () =>{
  imageUrl.value = ''
  formData.value.coverImage = ''
}
const tagOptions = reactive([
  { value: '情绪管理', label: '情绪管理' },
  { value: '焦虑', label: '焦虑' },
  { value: '抑郁', label: '抑郁' },
  { value: '压力', label: '压力' },
  { value: '睡眠', label: '睡眠' },
  { value: '冥想', label: '冥想' },
  { value: '正念', label: '正念' },
  { value: '放松', label: '放松' },
  { value: '心理健康', label: '心理健康' },
  { value: '自我成长', label: '自我成长' },
  { value: '人际关系', label: '人际关系' },
  { value: '工作压力', label: '工作压力' },
  { value: '学习方法', label: '学习方法' },
  { value: '生活技巧', label: '生活技巧' }
])
const formData = ref({
  title: '',
  categoryId: '',
  summary: '',
  tags: [],
  coverImage: '',
  content: ''
})

const tagJudge = () => {
  if (formData.value.tags.length > 3) {
    ElMessageBox({
      title: '提示',
      message: '最多选择3个标签',
      type: 'warning'
    }).then(() => {
      formData.value.tags = formData.value.tags.slice(0, 3)
    })
  }
}

const emit = defineEmits(['update:modelValue', 'submit'])
const formRef = ref()
const rules = ref({
  title: [{required: true, message: '请输入标题', trigger: 'blur'}],
  categoryId: [{required: true, message: '请选择分类', trigger: 'blur'}],
  content: [{required: true, message: '请输入文章内容', trigger: 'blur'}]
})

const handleClose = () => {

  dialogVisible.value = false
  // 清空表单数据
  formRef.value.resetFields()
  businessId.value = null
  formData.value.tagArray = []
  removeImage()
  // 富文本内容清空
  formData.value.content = ''
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      
      
      if(!isEdit){
        const res = addArticle({
        ...formData.value,
        tags: formData.value.tags.join(',')
        })
        ElMessage.success('新增成功')
      }else{
        const res = updateArticle({
        ...formData.value,
        tags: formData.value.tags.join(',')
        })
        ElMessage.success('编辑成功')
        
      }
    
      delete formData.value.tagArray
      
      setTimeout(() => {
        
        dialogVisible.value = false
        emit('submit')
        // 清空表单数据
      formData.value = {
        title: '',
        content: '',
        categoryId: '',
        summary: '',
        tags: [],
        coverImage: '',
      }
      imageUrl.value = ''
      }, 1500)
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}
// 富文本
const handleContentChange = (content) => {
  formData.value.content = content.html
}
 
const editorRef = ref(null)
 const handleContentCreate = (editor) => {
  editorRef.value = editor
  if(formData.value.content.trim() !== '' && editorRef.value){
    nextTick(() => {
      editorRef.value.setHtml(formData.value.content)
    })
  }
 }

 const previewVisible = ref(false)


watch(() => props.articleDetail, (newVal) => {
  if(!newVal) {
    // console.log(1)
    formData.value = {
      title: '',
      content: '',
      categoryId: '',
      summary: '',
      tags: [],
      coverImage: '',
    }
    return
  }
  else{
    nextTick(() => {
      Object.assign(formData.value, newVal)
      // formData.value.summary =
      formData.value.tags = newVal.tagArray
      if(newVal.coverImage){
        formData.value.coverImage = newVal.coverImage
        imageUrl.value = fileBaseUrl + newVal.coverImage
      }
      businessId.value = newVal.id
      // console.log(formData.value)
    })
  }
})
</script>

<style scoped>
.upload-image{
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #8b949e;
  background-color: #f6f8fa;
}
.preview-image{
  width: 200px;
  height: 120px;
}
</style>