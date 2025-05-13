<template>
    <div class="scenic-container">
        <div class="page-header">
            <div class="left-section">
                <div class="title-wrapper">
                    <h2>景点管理</h2>
                    <div class="title-decoration"></div>
                </div>
                <div class="search-area">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="请输入景点名称搜索"
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
                <el-icon><Plus /></el-icon>新增景点
            </el-button>
        </div>

        <el-card class="table-card" :body-style="{ padding: '20px' }">
            <!-- 表格 -->
            <el-table
                v-loading="loading"
                :data="scenicList"
                border
                stripe
                style="width: 100%"
            >
                <el-table-column label="景点图片" width="120" align="center">
                    <template #default="{ row }">
                        <div class="image-wrapper">
                            <el-image
                                :src="row.img"
                                :preview-src-list="scenicList.map(item => item.img)"
                                :initial-index="scenicList.findIndex(item => item.img === row.img)"
                                preview-teleported
                                fit="cover"
                                class="scenic-image"
                            >
                                <template #error>
                                    <div class="image-placeholder">
                                        <el-icon><Picture /></el-icon>
                                    </div>
                                </template>
                            </el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="景点名称" min-width="180" />
                <el-table-column prop="address" label="地址" min-width="220" />
                <el-table-column prop="detail" label="详情" min-width="300">
                    <template #default="{ row }">
                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            :width="400"
                            popper-class="detail-popover"
                        >
                            <template #default>
                                <div class="detail-content">{{ row.detail }}</div>
                            </template>
                            <template #reference>
                                <div class="detail-text">{{ formatDetail(row.detail) }}</div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="开放时间" min-width="150">
                    <template #default="{ row }">
                        {{ formatTime(row.startTime) }} - {{ formatTime(row.endTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="建成时间" width="120">
                    <template #default="{ row }">
                        {{ formatDate(row.time) }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.state === 0 ? 'success' : 'danger'">
                            {{ row.state === 0 ? '正常' : '关闭' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button-group>
                            <el-button type="primary" link @click="handleEdit(row)">
                                <el-icon><Edit /></el-icon>编辑
                            </el-button>
                            <el-button type="danger" link @click="handleDelete(row)">
                                <el-icon><Delete /></el-icon>删除
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :total="total"
                    :page-sizes="[5, 10]"
                    :pager-count="5"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    small
                >
                    <template #total>
                        总计 <span class="total-count">{{ total }}</span> 条
                    </template>
                    <template #sizes="{ size }">
                        <el-select
                            v-model="pageSize"
                            class="page-size-select"
                        >
                            <el-option
                                v-for="item in [5, 10]"
                                :key="item"
                                :value="item"
                                :label="`${item}条/页`"
                            />
                        </el-select>
                    </template>
                    <template #prev>
                        <span>上一页</span>
                    </template>
                    <template #next>
                        <span>下一页</span>
                    </template>
                    <template #jumper>
                        <span>前往</span>
                        <el-input
                            v-model="currentPage"
                            class="jump-input"
                        />
                        <span>页</span>
                    </template>
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete, Picture, CircleClose } from '@element-plus/icons-vue'
import request from '../utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()

// 数据相关
const loading = ref(false)
const scenicList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)
const searchKeyword = ref('')

// 格式化时间
const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString.substring(0, 5)  // 只显示时:分
}

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return ''
    return dateString.substring(0, 10)  // 只显示年-月-日
}

// 格式化详情文本
const formatDetail = (text) => {
    if (!text) return ''
    return text.length > 50 ? text.substring(0, 50) + '...' : text
}

// 获取景点列表
const getList = async () => {
    loading.value = true
    try {
        const res = await request({
            url: `/scenic/getScenicByPage/${currentPage.value}/size/${pageSize.value}`,
            method: 'post',
            data: {
                name: searchKeyword.value.trim() || null
            }
        })

        if (res && Array.isArray(res.list)) {
            scenicList.value = res.list
            total.value = res.total || res.list.length
            
            // 如果搜索无结果，显示提示
            if (searchKeyword.value && res.list.length === 0) {
                ElMessage.info('未找到相关景点')
            }
        } else {
            ElMessage.error('获取数据失败')
        }
    } catch (error) {
        console.error('获取景点列表失败:', error)
        ElMessage.error('获取数据失败')
    } finally {
        loading.value = false
    }
}

// 搜索功能
const handleSearch = () => {
    currentPage.value = 1  // 搜索时重置到第一页
    getList()
}

// 分页处理
const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1  // 重置到第一页
    getList()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    getList()
}

// 新增景点
const handleAdd = () => {
    router.push('/addScenic')
}

// 编辑景点
const handleEdit = (row) => {
    // 将景点数据存储到 sessionStorage
    sessionStorage.setItem('editingScenic', JSON.stringify({
        id: row.id,
        name: row.name,
        detail: row.detail,
        address: row.address,
        img: row.img,
        longitude: row.longitude,
        latitude: row.latitude,
        startTime: row.startTime,
        endTime: row.endTime,
        time: row.time,
        state: row.state,
        capacity: row.capacity
    }))
    router.push('/updateScenic')
}

// 删除景点
const handleDelete = (row) => {
    ElMessageBox.confirm(
        `确定要删除景点"${row.name}"吗？`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        try {
            const res = await request({
                url: '/scenic/deleteScenic',
                method: 'delete',
                data: {
                    id: row.id
                }
            })
            if(res) {
                ElMessage.success('删除成功')
                getList() // 刷新列表
            } else {
                ElMessage.error('删除失败')
            }
        } catch(error) {
            console.error('删除景点失败:', error)
            ElMessage.error('删除失败')
        }
    }).catch(() => {})
}

// 清空搜索
const clearSearch = () => {
    searchKeyword.value = ''
    getList() // 重置列表
}

// 初始化
onMounted(() => {
    getList()
})

const handleCancel = () => {
    router.push('/scenic')
}
</script>

<style scoped>
.scenic-container {
    padding: 24px;
    min-height: 100%;
    background-color: #f0f2f5;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 0 4px;
}

.title-wrapper {
    position: relative;
}

.title-wrapper h2 {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
    padding-bottom: 8px;
}

.title-decoration {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--el-color-primary);
    border-radius: 2px;
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

:deep(.el-input__wrapper) {
    padding-right: 8px;
}

:deep(.el-input__inner) {
    font-size: 14px;
}

.search-icon {
    font-size: 16px;
    color: #909399;
}

.search-actions {
    display: flex;
    align-items: center;
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

.search-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 20px;
    height: 40px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
}

.search-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.search-button .el-icon {
    font-size: 16px;
}

.table-card {
    border-radius: 12px;
    background-color: #f8fafc;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
}

.table-card:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.image-wrapper {
    padding: 4px;
    border-radius: 8px;
    background-color: #f3f6fa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.scenic-image {
    width: 80px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
    display: block;
}

.scenic-image :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s;
}

.scenic-image:hover :deep(img) {
    transform: scale(1.1);
}

.image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eef2f6;
    color: #909399;
    font-size: 20px;
}

:deep(.el-table) {
    background-color: transparent;
    --el-table-tr-bg-color: #f8fafc;
    border: none;
    --el-table-border-color: #ebeef5;
}

:deep(.el-table::before) {
    display: none;
}

:deep(.el-table th) {
    background-color: #eef2f6 !important;
    border-bottom: 2px solid #e5e9f2;
    font-weight: 600;
    color: #1e293b;
    height: 50px;
}

:deep(.el-table td) {
    padding: 12px 0;
    border-bottom: 1px solid #edf2f7;
}

:deep(.el-table--striped .el-table__row--striped td) {
    background-color: #f3f6fa !important;
}

:deep(.el-table__row) {
    transition: all 0.3s;
}

:deep(.el-table__row:hover td) {
    background-color: #e8f0fe !important;
}

:deep(.el-button-group) {
    display: flex;
    gap: 8px;
}

:deep(.el-button-group .el-button--link) {
    height: 32px;
    padding: 0 12px;
    border-radius: 4px;
    transition: all 0.2s;
}

:deep(.el-button-group .el-button--link.el-button--primary) {
    color: var(--el-color-primary);
    background-color: #e8f0fe;
}

:deep(.el-button-group .el-button--link.el-button--primary:hover) {
    color: #fff;
    background-color: var(--el-color-primary);
}

:deep(.el-button-group .el-button--link.el-button--danger) {
    color: var(--el-color-danger);
    background-color: #fef0f0;
}

:deep(.el-button-group .el-button--link.el-button--danger:hover) {
    color: #fff;
    background-color: var(--el-color-danger);
}

:deep(.el-tag) {
    width: 64px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border: none;
}

:deep(.el-tag--success) {
    background-color: #f0f9eb;
    color: var(--el-color-success);
}

:deep(.el-tag--danger) {
    background-color: #fef0f0;
    color: var(--el-color-danger);
}

:deep(.el-pagination) {
    --el-pagination-button-bg-color: transparent;
    font-weight: normal;
    font-size: 14px;
}

:deep(.el-pagination .el-pager li) {
    border-radius: 4px;
    transition: all 0.2s;
}

:deep(.el-pagination .el-pager li.is-active) {
    background-color: var(--el-color-primary);
    color: #fff;
    font-weight: 600;
}

:deep(.el-pagination .btn-prev, .el-pagination .btn-next) {
    border-radius: 4px;
    padding: 0 8px;
}

.search-button, .add-button {
    height: 40px;
    padding: 0 24px;
    font-size: 14px;
    border-radius: 6px;
    font-weight: 500;
}

.add-button {
    background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
    border: none;
}

.add-button:hover {
    background: linear-gradient(45deg, var(--el-color-primary-dark-2), var(--el-color-primary));
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    padding: 12px 0;
}

.left-section {
    display: flex;
    align-items: center;
    gap: 24px;
}

/* 添加图片预览相关样式 */
:deep(.el-image-viewer__wrapper) {
    position: fixed;
    z-index: 2100; /* 确保高于侧边栏 */
}

:deep(.el-image-viewer__mask) {
    position: fixed;
    z-index: 2099;
}

:deep(.el-image-viewer__close) {
    color: #fff;
}

:deep(.el-image-viewer__actions) {
    opacity: 1;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px 15px;
    border-radius: 20px;
}

:deep(.el-image-viewer__prev, .el-image-viewer__next) {
    color: #fff;
    font-size: 32px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    padding: 20px;
    transition: all 0.3s;
}

:deep(.el-image-viewer__prev:hover, .el-image-viewer__next:hover) {
    background: rgba(0, 0, 0, 0.5);
}

.detail-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

:deep(.detail-popover) {
    max-width: 400px;
    background-color: #f3f6fa !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

:deep(.detail-popover .el-popover__content) {
    padding: 12px 16px;
    background-color: #f3f6fa;
}

.detail-content {
    line-height: 1.6;
    color: #1e293b;
    font-size: 14px;
    max-height: 200px;
    overflow-y: auto;
    padding: 4px;
    border-radius: 4px;
    background-color: #f8fafc;
}

.detail-content::-webkit-scrollbar {
    width: 6px;
}

.detail-content::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
}

.detail-content::-webkit-scrollbar-track {
    background-color: #f3f6fa;
    border-radius: 3px;
}

/* 添加分页相关样式 */
.total-count {
    color: var(--el-color-primary);
    font-weight: 600;
    margin: 0 4px;
}

.size-text {
    margin-right: 4px;
    color: #606266;
}

:deep(.page-size-select) {
    width: 90px;
    margin: 0 8px;
}

:deep(.el-pagination .el-select .el-input) {
    width: 90px;
}

:deep(.jump-input) {
    width: 50px;
    margin: 0 8px;
}

:deep(.el-pagination .el-input__inner) {
    text-align: center;
}

:deep(.el-pagination button) {
    background: transparent;
}

:deep(.el-pagination .btn-prev, .el-pagination .btn-next) {
    border-radius: 4px;
    padding: 0 8px;
}

:deep(.el-pagination .el-pager li) {
    border-radius: 4px;
    transition: all 0.2s;
}

:deep(.el-pagination .el-pager li.is-active) {
    background-color: var(--el-color-primary);
    color: #fff;
    font-weight: 600;
}
</style>