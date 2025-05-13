<template>
    <div class="news-container">
        <div class="page-header">
            <div class="left-section">
                <h2 class="section-title">新闻管理</h2>
                <div class="search-area">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="搜索新闻标题"
                        class="search-input"
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <el-icon class="search-icon"><Search /></el-icon>
                        </template>
                        <template #suffix>
                            <div class="search-actions" v-if="searchKeyword">
                                <el-icon class="clear-icon" @click="clearSearch"><CircleClose /></el-icon>
                            </div>
                        </template>
                    </el-input>
                    <el-button type="primary" class="search-button" @click="handleSearch">
                        <el-icon><Search /></el-icon>搜索
                    </el-button>
                </div>
            </div>
            <el-button type="primary" class="add-button" @click="handleAdd">
                <el-icon><Plus /></el-icon>发布新闻
            </el-button>
        </div>

        <div class="news-grid" v-loading="loading">
            <div v-for="news in newsList" :key="news.id" class="news-card">
                <div class="news-image">
                    <el-image 
                        :src="news.img" 
                        fit="cover"
                    >
                        <template #error>
                            <div class="image-placeholder">
                                <el-icon><Picture /></el-icon>
                            </div>
                        </template>
                    </el-image>
                    <div class="news-category" :class="getNewsType(news.title)">
                        {{ getNewsTypeLabel(news.title) }}
                    </div>
                </div>
                <div class="news-content">
                    <h3 class="news-title" :title="news.title">{{ news.title }}</h3>
                    <p class="news-desc">{{ news.content }}</p>
                    <div class="news-meta">
                        <div class="meta-item">
                            <el-icon><Calendar /></el-icon>
                            <span>{{ formatDate(news.time) }}</span>
                        </div>
                        <div class="meta-item">
                            <el-icon><User /></el-icon>
                            <span>{{ news.userName || '管理员' }}</span>
                        </div>
                    </div>
                    <div class="news-actions">
                        <el-button-group>
                            <el-button type="primary" link @click="handleEdit(news)">
                                <el-icon><Edit /></el-icon>编辑
                            </el-button>
                            <el-button type="danger" link @click="handleDelete(news)">
                                <el-icon><Delete /></el-icon>删除
                            </el-button>
                        </el-button-group>
                        <el-tag
                            :type="news.code === 1 ? 'success' : 'info'"
                            size="small"
                        >
                            {{ news.code === 1 ? '已发布' : '草稿' }}
                        </el-tag>
                    </div>
                </div>
            </div>
        </div>

        <div class="pagination-container">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[8, 16]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
                <template #total>
                    总计 <span class="total-count">{{ total }}</span> 条
                </template>
            </el-pagination>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    Search, 
    Plus, 
    Edit, 
    Delete, 
    CircleClose,
    Calendar,
    View,
    Picture,
    User
} from '@element-plus/icons-vue'
import request from '../utils/request'
import { useRouter } from 'vue-router'

// 数据相关
const loading = ref(false)
const newsList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(8)
const searchKeyword = ref('')

const router = useRouter()

// 根据标题判断新闻类型
const getNewsType = (title) => {
    if (title.includes('【党员教育】')) return 'guide'
    if (title.includes('【通知】')) return 'notice'
    if (title.includes('【活动】')) return 'event'
    return 'announcement'
}

// 获取新闻类型标签
const getNewsTypeLabel = (title) => {
    if (title.includes('【党员教育】')) return '教育'
    if (title.includes('【通知】')) return '通知'
    if (title.includes('【活动】')) return '活动'
    return '公告'
}

// 获取新闻列表
const getNewsList = async () => {
    loading.value = true
    try {
        const res = await request({
            url: `/news/getNewsByPage/${currentPage.value}/size/${pageSize.value}`,
            method: 'post',
            data: {
                title: searchKeyword.value.trim() || undefined
            }
        })

        // 直接使用返回的数据，不检查 status
        newsList.value = res.list
        total.value = res.total
        
        if (searchKeyword.value && res.list.length === 0) {
            ElMessage.info('未找到相关新闻')
        }
    } catch (error) {
        console.error('获取新闻列表失败:', error)
        ElMessage.error('获取数据失败')
    } finally {
        loading.value = false
    }
}

// 搜索功能
const handleSearch = () => {
    currentPage.value = 1
    getNewsList()
}

// 清空搜索
const clearSearch = () => {
    searchKeyword.value = ''
    currentPage.value = 1
    getNewsList()
}

// 分页处理
const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1
    getNewsList()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    getNewsList()
}

// 新增新闻
const handleAdd = () => {
    router.push('/updateNews')
}

// 编辑新闻
const handleEdit = (news) => {
    // 将新闻数据存储到 sessionStorage
    sessionStorage.setItem('editingNews', JSON.stringify({
        id: news.id,
        title: news.title,
        content: news.content,
        image: news.img,
        time: news.time,
        userName: news.userName
    }))
    router.push('/updateNews')
}

// 删除新闻
const handleDelete = async (row) => {
    try {
        // 显示确认对话框
        await ElMessageBox.confirm(
            '确定要删除这条新闻吗？删除后不可恢复',
            '删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )

        // 用户确认后，调用删除接口
        const response = await request({
            url: '/news/deleteNews',
            method: 'delete',
            data: {
                id: row.id  // 传入要删除的新闻ID
            }
        })

        if (response && response.status === 200) {
            ElMessage.success('删除成功')
            // 重新加载新闻列表
            getNewsList()
        } else {
            ElMessage.error(response?.message || '删除失败')
        }
    } catch (error) {
        if (error !== 'cancel') {  // 忽略用户取消的情况
            console.error('删除新闻失败:', error)
            ElMessage.error('删除失败，请重试')
        }
    }
}

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return ''
    return dateString.substring(0, 10)
}

// 初始化
onMounted(() => {
    getNewsList()
})
</script>

<style scoped>
.news-container {
    padding: 24px;
    min-height: 100%;
    background-color: #f0f2f5;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.section-title {
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 16px 0;
}

.left-section {
    display: flex;
    flex-direction: column;
}

.search-area {
    display: flex;
    align-items: center;
    gap: 12px;
}

.search-input {
    width: 320px;
    transition: all 0.3s;
}

.search-input:focus-within {
    width: 360px;
}

.search-icon {
    font-size: 16px;
    color: #909399;
}

.clear-icon {
    font-size: 16px;
    color: #909399;
    cursor: pointer;
    transition: all 0.3s;
}

.clear-icon:hover {
    color: #f56c6c;
}

.add-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    height: 40px;
    font-size: 14px;
    font-weight: 500;
}

/* 新闻卡片网格布局 */
.news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
}

.news-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    height: 450px;
}

.news-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.news-image {
    position: relative;
    height: 200px;
    overflow: hidden;
    flex-shrink: 0;
}

.news-image :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.news-card:hover .news-image :deep(img) {
    transform: scale(1.05);
}

.image-placeholder {
    width: 100%;
    height: 100%;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 32px;
}

.news-category {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
}

.news-category.announcement {
    background: #409eff;
}

.news-category.guide {
    background: #67c23a;
}

.news-category.event {
    background: #e6a23c;
}

.news-category.notice {
    background: #909399;
}

.news-content {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.news-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    flex-shrink: 0;
}

.news-desc {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 16px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    flex: 1;
}

.news-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-shrink: 0;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #94a3b8;
    font-size: 13px;
}

.news-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
    flex-shrink: 0;
}

.news-actions .el-tag {
    margin-left: auto;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
}

.total-count {
    color: var(--el-color-primary);
    font-weight: 600;
    margin: 0 4px;
}
</style>
