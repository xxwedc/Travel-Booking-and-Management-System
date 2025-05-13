<template>
    <div class="order-container">
        <div class="page-header">
            <div class="left-section">
                <h2 class="section-title">
                    <el-icon class="title-icon"><Calendar /></el-icon>
                    预约订单管理
                </h2>
                <div class="filter-section">
                    <el-select
                        v-model="selectedScenic"
                        placeholder="选择景点筛选"
                        clearable
                        class="scenic-select"
                        @change="handleScenicChange"
                    >
                        <el-option
                            label="全部景点"
                            value=""
                        />
                        <el-option
                            v-for="item in scenicList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </div>
        </div>

        <el-card class="table-card" :body-style="{ padding: '0px' }">
            <el-table
                v-loading="loading"
                :data="orderList"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{
                    background: '#f8fafc',
                    color: '#1e293b',
                    fontWeight: '600',
                    fontSize: '14px',
                    height: '50px'
                }"
               :cell-style="{
                    fontSize: '14px',
                    padding: '12px 0'
                }"
            >
                <el-table-column prop="id" label="订单编号" width="120" />
                
                <el-table-column prop="userName" label="预约人" width="120" />
                <el-table-column prop="scenicName" label="预约景点" min-width="180" />
                <el-table-column label="预约人信息" width="300">
                    <template #default="{ row }">
                        <div v-for="(visitor, index) in JSON.parse(row.content)" :key="index" class="visitor-info">
                            {{ visitor.name }} ({{ visitor.id }})
                            {{ index < JSON.parse(row.content).length - 1 ? '、' : '' }}
                        </div>
                    </template>
                </el-table-column>
               
                <el-table-column prop="phone" label="联系电话" width="120" />
                <el-table-column prop="orderTime" label="参观时段" width="180" />
                <el-table-column label="预约人数" width="100" align="center">
                    <template #default="{ row }">
                        {{ JSON.parse(row.content).length }}
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="预约时间" width="180" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button 
                            type="danger" 
                            link 
                            @click="handleDelete(row)"
                        >
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
                    :page-sizes="[10, 20]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
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
import { Delete, Calendar } from '@element-plus/icons-vue'
import request from '../utils/request'

// 数据相关
const loading = ref(false)
const orderList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedScenic = ref('')
const scenicList = ref([])

// 分页处理
const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1
    getOrderList()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    getOrderList()
}

// 添加选择景点的处理函数
const handleScenicChange = () => {
    currentPage.value = 1 // 重置页码
    getOrderList()
}

// 获取订单列表
const getOrderList = async () => {
    loading.value = true
    try {
        const params = {
            scenicId: selectedScenic.value || undefined
        }

        const { list, total: totalCount } = await request.post(
            `/orderInfo/getOrderInfoByPage/${currentPage.value}/size/${pageSize.value}`,
            params
        )

        orderList.value = list || []
        total.value = totalCount || 0

    } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取数据失败')
    } finally {
        loading.value = false
    }
}

// 删除处理函数
const handleDelete = (row) => {
    ElMessageBox.confirm(
        `确定要删除订单"${row.id}"吗？`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        try {
            await request.post('/order/deleteOrderById', { id: row.id })
            ElMessage.success('删除成功')
            getOrderList()
        } catch (error) {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }).catch(() => {})
}

// 获取景点列表
const getScenicList = async () => {
    try {
        const response = await request.post('/order/getScenicName')
        if (response) {
            // 将后端返回的数据格式转换为 el-select 需要的格式
            scenicList.value = response.map(item => ({
                value: item.id,
                label: item.name
            }))
        }
    } catch (error) {
        console.error('获取景点列表失败:', error)
        ElMessage.error('获取景点列表失败')
    }
}

// 初始化
onMounted(() => {
    getScenicList()
    getOrderList()
})
</script>

<style scoped>
.order-container {
    padding: 24px;
    min-height: 100%;
    background-color: #f8fafc;
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
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-icon {
    font-size: 24px;
    color: var(--el-color-primary);
}

.left-section {
    display: flex;
    flex-direction: column;
}

.table-card {
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.table-card:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

:deep(.el-table) {
    border-radius: 12px 12px 0 0;
    overflow: hidden;
}

:deep(.el-table th) {
    font-weight: 600;
    color: #1e293b;
    background-color: var(--el-table-header-bg-color);
}

:deep(.el-table td) {
    transition: background-color 0.3s ease;
}

:deep(.el-table tr:hover td) {
    background-color: #f1f5f9 !important;
}

:deep(.el-button.el-button--danger) {
    transition: all 0.3s ease;
}

:deep(.el-button.el-button--danger:hover) {
    color: var(--el-color-danger) !important;
    background-color: var(--el-color-danger-light-9);
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 0;
    padding: 16px 24px;
    background-color: #fff;
    border-radius: 0 0 12px 12px;
    border-top: 1px solid var(--el-border-color-lighter);
}

.total-count {
    color: var(--el-color-primary);
    font-weight: 600;
    margin: 0 4px;
}

.visitor-info {
    display: inline-block;
    margin-right: 8px;
    color: #475569;
}

:deep(.el-table .cell) {
    padding: 0 16px;
}

.filter-section {
    display: flex;
    gap: 16px;
}

.scenic-select {
    width: 240px;
}
</style>
