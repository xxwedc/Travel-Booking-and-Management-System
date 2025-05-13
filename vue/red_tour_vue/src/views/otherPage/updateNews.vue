<template>
  <div class="update-news-container">
    <el-card class="news-form">
      <h2 class="form-title">{{ isEdit ? '编辑新闻' : '发布新闻' }}</h2>
      
      <el-form label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>

        <el-form-item label="标题图片">
          <div class="cover-upload-container">
            <div class="image-box">
              <div class="image-label">当前图片</div>
              <div class="image-content">
                <img v-if="coverImageUrl" :src="coverImageUrl" class="preview-image" />
                <div v-else class="empty-image">暂无图片</div>
              </div>
            </div>

            <div class="replace-arrow">
              <span class="arrow-text">=></span>
            </div>

            <div class="image-box">
              <div class="image-label">替换图片</div>
              <div class="image-content">
                <template v-if="coverFileList.length > 0">
                  <div class="preview-container">
                    <img :src="coverFileList[0].url" class="preview-image" />
                    <div class="delete-icon" @click="handleCoverRemove(coverFileList[0])">
                      <el-icon><Delete /></el-icon>
                    </div>
                  </div>
                </template>
                <el-upload 
                  v-else
                  class="cover-upload" 
                  list-type="picture-card"
                  :on-change="handleCoverChange"
                  :on-remove="handleCoverRemove"
                  :file-list="coverFileList"
                  :limit="1"
                  :auto-upload="false"
                  accept="image/jpeg,image/png">
                  <el-icon><Plus /></el-icon>
                </el-upload>
              </div>
            </div>
          </div>
          <div class="el-upload__tip">
            <div>• 只能上传一张标片，建议尺寸 800x400</div>
            <div>• 支持 JPG/PNG 格式，大小不超过 2MB</div>
          </div>
        </el-form-item>

        <el-form-item label="内容图片">
          <div class="content-upload-container">
            <el-upload 
              class="content-upload" 
              list-type="picture-card"
              :on-change="handleContentChange"
              :on-remove="handleContentRemove"
              :before-upload="beforeContentUpload"
              :limit="3"
              :file-list="contentImageList"
              :auto-upload="false"
              accept="image/jpeg,image/png">
              <template v-if="contentImageList.length < 3">
                <el-icon><Plus /></el-icon>
              </template>
            </el-upload>
          </div>
          <div class="el-upload__tip">
            <div>• 最多上传 3 张内容图片</div>
            <div>• 支持 JPG/PNG 格式，大小不超过 2MB</div>
          </div>
        </el-form-item>

        <el-form-item label="新闻内容">
          <el-input v-model="content" type="textarea" :rows="10" placeholder="请输入新闻内容"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            {{ isEdit ? '保存' : '发布' }}
          </el-button>
          <el-button @click="handleBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { Plus, Delete } from '@element-plus/icons-vue'  // 添加 Delete 图标
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'  // 确保导入了request
import { useRouter } from 'vue-router'

export default {
  components: {
    Plus,
    Delete  // 注册 Delete 组件
  },
  setup() {
    const router = useRouter()
    const coverImageUrl = ref('')
    const coverFileList = ref([])  // 新增 coverFileList
    const contentImageList = ref([])
    const title = ref('')
    const content = ref('')
    const isEdit = ref(false)
    const newsId = ref(null)

    const getNewsImages = async (newsId) => {
      try {
        const response = await request({
          url: '/images/getImgData',
          method: 'post',
          data: {
            id: newsId
          }
        })

        if (response && response.status === 200 && Array.isArray(response.data)) {
          // 将获取到的图片数据转换为 contentImageList 需要的格式
          contentImageList.value = response.data.map(item => ({
            name: item.path.split('/').pop(), // 从路径中提取文件名
            url: item.path,
            uid: `existing-${item.id}`, // 使用实际的图片ID作为uid的一部分
            status: 'success'
          }))
        }
      } catch (error) {
        console.error('获取新闻图片失败:', error)
        ElMessage.error('获取新闻图片失败')
      }
    }

    onMounted(() => {
      // 获取 sessionStorage 中的编辑数据
      const editingNews = sessionStorage.getItem('editingNews')
      if (editingNews) {
        isEdit.value = true
        const newsData = JSON.parse(editingNews)
        
        // 保存新闻 ID
        newsId.value = newsData.id
        
        // 填充表单数据
        title.value = newsData.title
        content.value = newsData.content
        if (newsData.image) {
          coverImageUrl.value = newsData.image
        }
        
        // 如果是编辑模式，获取新闻相关的图片
        getNewsImages(newsData.id)
        
        // 清除 sessionStorage
        sessionStorage.removeItem('editingNews')
      }
    })

    const uploadImages = async (files) => {
      try {
        const formData = new FormData()
        files.forEach(file => {
          formData.append('files', file)
        })

        const response = await request({
          url: '/api/images/uploadImages',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response && response.status === 200) {
          return response.data // 返回图片链接数组
        }
        throw new Error('上传失败')
      } catch (error) {
        console.error('上传图片失败:', error)
        ElMessage.error('上传图片失败')
        return null
      }
    }

    const handleCoverChange = (uploadFile) => {
      if (uploadFile.raw) {
        const previewUrl = URL.createObjectURL(uploadFile.raw)
        coverFileList.value = [{
          name: uploadFile.name,
          raw: uploadFile.raw,
          uid: uploadFile.uid,
          status: 'ready',
          url: previewUrl
        }]
      }
    }

    const handleContentChange = (uploadFile) => {
      if (uploadFile.raw) {
        const previewUrl = URL.createObjectURL(uploadFile.raw)
        
        const fileObj = {
          name: uploadFile.name,
          raw: uploadFile.raw,
          uid: uploadFile.uid,
          status: 'ready',
          url: previewUrl
        }
        
        const existingIndex = contentImageList.value.findIndex(item => item.uid === uploadFile.uid)
        if (existingIndex === -1) {
          contentImageList.value.push(fileObj)
        }
      }
    }

    const handleContentRemove = async (file) => {
      const index = contentImageList.value.findIndex(item => item.uid === file.uid)
      if (index !== -1) {
        // 检查是否是已存在的图片（通过uid前缀判断）
        if (String(file.uid).startsWith('existing-')) {
          try {
            // 从 uid 中提取实际的图片 ID（去掉 'existing-' 前缀）
            const imageId = parseInt(file.uid.replace('existing-', ''))
            const response = await request({
              url: '/api/images/deleteImagesById',
              method: 'post',
              data: {
                id: imageId  // 使用实际的图片ID
              }
            })
            
            if (response && response.status === 200) {
              ElMessage.success('图片删除成功')
            } else {
              ElMessage.error('图片删除失败')
              return // 如果删除失败，不从列表中移除
            }
          } catch (error) {
            console.error('删除图片失败:', error)
            ElMessage.error('删除图片失败')
            return // 如果发生错误，不从表中移除
          }
        } else if (file.url && !file.url.startsWith('http')) {  // 清理本地预览 URL
          URL.revokeObjectURL(file.url)
        }
        
        contentImageList.value.splice(index, 1)
      }
    }

    const beforeContentUpload = (file) => {
      if (contentImageList.value.length >= 3) {
        ElMessage.warning('最多只能上传3张图片')
        return false
      }
      
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        ElMessage.warning('图片大小不能超过 2MB!')
        return false
      }
      return true
    }

    const saveImageToDb = async (newsId, imagePath) => {
      try {
        const response = await request({
          url: '/api/images/insertImages',
          method: 'post',
          data: {
            otherId: newsId,
            path: imagePath
          }
        })
        
        if (response && response.status === 200) {
          return true
        }
        return false
      } catch (error) {
        console.error('保存图片数据失败:', error)
        return false
      }
    }

    const handleSubmit = async () => {
      try {
        // 验证表单数据
        if (!title.value || !content.value) {
          ElMessage.warning('请填写完整的新闻信息')
          return
        }

        if (!isEdit.value && coverFileList.value.length === 0) {
          ElMessage.warning('请上传标题图片')
          return
        }

        // 上传封面图片
        let coverImageUrl = null
        if (coverFileList.value.length > 0 && coverFileList.value[0].raw) {
          const coverUrls = await uploadImages([coverFileList.value[0].raw])
          if (!coverUrls || coverUrls.length === 0) {
            ElMessage.error('封面图片上传失败')
            return
          }
          coverImageUrl = coverUrls[0]
        }

        // 上传内容图片
        const newContentImages = []
        for (const file of contentImageList.value) {
          if (file.raw) {  // 只上传新添加的图片
            const urls = await uploadImages([file.raw])
            if (!urls || urls.length === 0) {
              ElMessage.error('内容图片上传失败')
              return
            }
            newContentImages.push(urls[0])
          }
        }

        // 构造新闻数据
        const newsData = {
          title: title.value,
          content: content.value,
        }

        if (isEdit.value) {
          // 编辑模式
          newsData.id = newsId.value
          if (coverImageUrl) {
            newsData.img = coverImageUrl
          }

          // 保存新上传的内容图片到 images 表
          if (newContentImages.length > 0) {
            for (const imagePath of newContentImages) {
              const saved = await saveImageToDb(newsId.value, imagePath)
              if (!saved) {
                ElMessage.error('保存图片失败')
                return
              }
            }
          }

          const response = await request({
            url: '/news/updateNews',
            method: 'put',
            data: newsData
          })

          if (response && response.status === 200) {
            ElMessage.success('更新成功')
            router.push('/news')
          } else {
            ElMessage.error(response.message || '更新失败')
          }
        } else {
          // 发布模式
          const newsData = {
            userName: localStorage.getItem('token'),
            title: title.value,
            content: content.value,
            img: coverImageUrl,
            time: formatDate(new Date()),
            code: 1
          }

          // 保存新闻
          const newsResponse = await request({
            url: '/news/addNews',
            method: 'post',
            data: newsData
          })

          if (newsResponse && newsResponse.data && newsResponse.data.id) {
            const newsId = newsResponse.data.id

            // 保存内容图片到 images 表
            if (newContentImages.length > 0) {
              for (const imagePath of newContentImages) {
                const saved = await saveImageToDb(newsId, imagePath)
                if (!saved) {
                  ElMessage.error('保存图片失败')
                  return
                }
              }
            }

            ElMessage.success('发布成功')
            router.push('/news')
          } else {
            ElMessage.error('发布失败')
          }
        }
      } catch (error) {
        console.error(isEdit.value ? '更新失败:' : '发布失败:', error)
        ElMessage.error(isEdit.value ? '更新失败，请重试' : '发布失败，请重试')
      }
    }

    const handleCoverRemove = (file) => {
      if (file.url && !file.url.startsWith('http')) {
        URL.revokeObjectURL(file.url)
      }
      coverFileList.value = []
    }

    const handleBack = () => {
      router.push('/news')
    }

    // 在组件卸载时清理定时器
    onUnmounted(() => {
      // 清理封面图片预览
      if (coverFileList.value.length > 0 && coverFileList.value[0].url && !coverFileList.value[0].url.startsWith('http')) {
        URL.revokeObjectURL(coverFileList.value[0].url)
      }
      
      // 清理内容图片预览
      contentImageList.value.forEach(file => {
        if (file.url && !file.url.startsWith('http')) {
          URL.revokeObjectURL(file.url)
        }
      })
    })

    // 在 setup 部定义格式化函数
    function formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      
      return `${year}-${month}-${day}`  // 只返回年月日，格式为 YYYY-MM-DD
    }

    return {
      coverImageUrl,
      coverFileList,
      contentImageList,
      title,
      content,
      handleCoverChange,
      handleContentChange,
      handleContentRemove,
      beforeContentUpload,
      handleSubmit,
      handleCoverRemove,
      isEdit,
      handleBack,
      newsId
    }
  }
}
</script>

<style scoped>
.update-news-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}

.cover-upload-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.image-box {
  width: 200px;
}

.image-label {
  margin-bottom: 8px;
}

.image-content {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  height: 150px;
}

.empty-image {
  color: #909399;
}

.replace-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
}

.arrow-text {
  font-size: 32px;
  color: #409EFF;
}

.cover-upload {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-upload :deep(.el-upload--picture-card) {
  width: 100% !important;
  height: 100% !important;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 确保预览图片填满容器并保持比例 */
.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-upload :deep(.el-upload-list--picture-card) {
  width: 200px !important;
  height: 150px !important;
}

.cover-upload :deep(.el-upload-list__item) {
  width: 200px !important;
  height: 150px !important;
  margin: 0;
}

.cover-upload :deep(.el-upload-list__item img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-upload:not(:has(.el-upload-list__item)) :deep(.el-upload--picture-card) {
  display: flex;
  width: 200px !important;
  height: 150px !important;
  margin: 0;
}

.content-upload-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.content-upload :deep(.el-upload-list--picture-card) {
  display: flex;
  gap: 8px;
}

.content-upload :deep(.el-upload-list__item) {
  width: 148px !important;
  height: 148px !important;
  margin: 0 !important;
}

.content-upload :deep(.el-upload--picture-card) {
  width: 148px !important;
  height: 148px !important;
  margin: 0 !important;
  line-height: 148px !important;
  display: flex;
}

.content-upload :deep(.el-upload.el-upload--picture-card) {
  display: none;
}

.content-upload:not(:has(.el-upload-list__item:nth-child(3))) :deep(.el-upload.el-upload--picture-card) {
  display: flex !important;
}

.content-upload :deep(.el-upload-list__item-thumbnail) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

.content-upload :deep(.el-upload-list__item.is-success) {
  border-color: #67C23A !important;
}

.content-upload :deep(.el-upload-list__item-status-label) {
  display: block !important;
  position: absolute;
  right: -12px;
  top: -12px;
  width: 24px;
  height: 24px;
  background: #67C23A;
  text-align: center;
  transform: rotate(45deg);
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.1);
}

.content-upload :deep(.el-upload-list__item-status-label i) {
  transform: rotate(-45deg);
  font-size: 12px;
  margin-top: 11px;
  color: #fff;
}

:deep(.el-icon) {
  font-size: 28px;
  color: #8c939d;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.delete-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.delete-icon :deep(.el-icon) {
  font-size: 16px;
  color: #fff;
}
</style>
