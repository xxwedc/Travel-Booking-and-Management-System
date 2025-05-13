<template>
    <div class="comment-container">
        <div class="page-header">
            <div class="left-section">
                <h2 class="section-title">评论管理</h2>
                <div class="search-area">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="搜索评论内容"
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
        </div>

        <el-card class="table-card">
            <el-table
                v-loading="loading"
                :data="commentList"
                border
                stripe
                style="width: 100%"
            >
                <el-table-column label="用户" width="200">
                    <template #default="{ row }">
                        <div class="user-info">
                            <el-avatar :size="32" :src="row.avatar">
                                {{ row.userName?.charAt(0)?.toUpperCase() }}
                            </el-avatar>
                            <span>{{ row.userName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="评论内容" min-width="300" show-overflow-tooltip />
                <el-table-column label="评论时间" width="180">
                    <template #default="{ row }">
                        {{ formatDate(row.time) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                    <template #default="{ row }">
                        <el-button type="danger" link @click="handleDelete(row)">
                            <el-icon><Delete /></el-icon>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :total="total"
                    :page-sizes="[5, 10, 20]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                >
                    <template #total>
                        总计 <span class="total-count">{{ total }}</span> 条
                    </template>
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, CircleClose, Delete } from '@element-plus/icons-vue'
import request from '../utils/request'

// 数据相关
const loading = ref(false)
const commentList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)
const searchKeyword = ref('')

// 获取评论列表
const getCommentList = async () => {
    loading.value = true
    try {
        const res = await request({
            url: `/comment/getCommentByPages/${currentPage.value}/size/${pageSize.value}`,
            method: 'post',
            data: {
                ...(searchKeyword.value.trim() && {
                    content: searchKeyword.value.trim()
                })
            }
        })

        if (res?.list) {
            commentList.value = res.list
            total.value = res.total || 0
        } else {
            commentList.value = []
            total.value = 0
            if (searchKeyword.value.trim()) {
                ElMessage.info('未找到相关评论')
            } else {
                ElMessage.warning('获取数据失败')
            }
        }
    } catch (error) {
        console.error('获取评论列表失败:', error)
        commentList.value = []
        total.value = 0
        ElMessage.error(error.response?.data?.message || '获取数据失败')
    } finally {
        loading.value = false
    }
}

// 删除评论
const handleDelete = (comment) => {
    ElMessageBox.confirm(
        '确定要删除这条评论吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await request({
                url: '/comment/deleteCommentById',
                method: 'delete',
                headers: {
                    'Authorization': token
                },
                data: comment
            })
            
            if (res.status === 200) {
                ElMessage.success('删除成功')
                getCommentList() // 重新获取列表
            } else {
                ElMessage.error('删除失败')
            }
        } catch (error) {
            console.error('删除评论失败:', error)
            ElMessage.error('删除失败')
        }
    }).catch(() => {})
}

// 搜索功能
const handleSearch = () => {
    if (!searchKeyword.value.trim()) {
        ElMessage.warning('请输入搜索关键词')
        return
    }
    currentPage.value = 1  // 搜索时重置到第一页
    getCommentList()
}

// 清空搜索
const clearSearch = () => {
    searchKeyword.value = ''
    currentPage.value = 1  // 清空搜索时重置到第一页
    getCommentList()
}

// 分页处理
const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1  // 重置到第一页
    getCommentList()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    getCommentList()
}

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 始化
onMounted(() => {
    getCommentList()
})
</script>

<style scoped>
.comment-container {
    padding: 24px;
    min-height: 100%;
    background-color: #f0f2f5;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
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

.table-card {
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

:deep(.el-table) {
    --el-table-header-bg-color: #f8fafc;
    --el-table-row-hover-bg-color: #f1f5f9;
}

:deep(.el-table th) {
    font-weight: 600;
    color: #1e293b;
    background-color: var(--el-table-header-bg-color);
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    padding: 16px;
}

.total-count {
    color: var(--el-color-primary);
    font-weight: 600;
    margin: 0 4px;
}
</style>
