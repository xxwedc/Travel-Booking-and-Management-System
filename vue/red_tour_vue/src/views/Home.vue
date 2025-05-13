<template>
    <div class="home-container">
        <!-- 数据概览卡片 -->
        <div class="stat-cards">
            <el-card v-for="(stat, index) in statistics" :key="index" class="stat-card">
                <div class="stat-content">
                    <div class="stat-icon" :style="{ background: stat.bgColor }">
                        <el-icon><component :is="stat.icon" /></el-icon>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">{{ stat.value }}</div>
                        <div class="stat-label">{{ stat.label }}</div>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 图表区域 -->
        <div class="charts-container">
            <el-card class="chart-card">
                <template #header>
                    <div class="chart-header">
                        <span>用户年龄分布占比</span>
                    </div>
                </template>
                <div ref="visitChartRef" class="chart"></div>
            </el-card>

            <el-card class="chart-card">
                <template #header>
                    <div class="chart-header">
                        <span>用户性别占比</span>
                    </div>
                </template>
                <div ref="pieChartRef" class="chart"></div>
            </el-card>
        </div>

       
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

import {
    Place,
    User,
    Calendar,
    Comment
} from '@element-plus/icons-vue'

// 添加数据响应式变量
const panelData = ref(null)

// 添加获取数据的方法
const getPanelData = async () => {
    try {
        const res = await request.get('/api/getPanel')
        if (res.status === 200) {
            panelData.value = res.data
            await initCharts()
        } else {
            ElMessage.error('获取数据失败，请稍后重试')
        }
    } catch (error) {
        ElMessage.error('获取数据失败，请稍后重试')
    }
}

// 修改统计数据，移除趋势相关属性
const statistics = computed(() => {
    if (!panelData.value) return []
    return [
        {
            label: '景点总数',
            value: panelData.value.scenicCount || 0,
            icon: Place,
            bgColor: 'var(--el-color-primary)'
        },
        {
            label: '游客数量',
            value: panelData.value.userCount || 0,
            icon: User,
            bgColor: '#67c23a'
        },
        {
            label: '预约订单数量',
            value: panelData.value.orderCount || 0,
            icon: Calendar,
            bgColor: '#e6a23c'
        },
        {
            label: '留言数量',
            value: panelData.value.commentCount || 0,
            icon: Comment,
            bgColor: '#f56c6c'
        }
    ]
})

// 访问趋势图表
let visitChart = null
const visitChartRef = ref(null)

// 景点分布图表
let pieChart = null
const pieChartRef = ref(null)

// 修改图表初始化函数
const initCharts = async () => {
    if (!panelData.value) return
    await Promise.all([
        initVisitChart(),
        initPieChart()
    ])
}

// 修改年龄分布图表初始化
const initVisitChart = async () => {
    await nextTick()
    if (!visitChartRef.value || !panelData.value) return
    
    visitChart = echarts.init(visitChartRef.value)
    
    // 处理年龄数据统计
    const ageGroups = {
        '18-25岁': 0,
        '26-35岁': 0,
        '36-45岁': 0,
        '46-55岁': 0,
        '56岁以上': 0
    }
    
    if (Array.isArray(panelData.value.ageList)) {
        panelData.value.ageList.forEach(age => {
            if (age <= 25) ageGroups['18-25岁']++
            else if (age <= 35) ageGroups['26-35岁']++
            else if (age <= 45) ageGroups['36-45岁']++
            else if (age <= 55) ageGroups['46-55岁']++
            else ageGroups['56岁以上']++
        })
    }
    
    const ageData = Object.entries(ageGroups).map(([range, count]) => ({
        range,
        count
    }))

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: (params) => {
                const value = params[0].value
                const total = panelData.value.ageList.length
                const percentage = ((value / total) * 100).toFixed(1)
                return `${params[0].name}: ${value}人 (${percentage}%)`
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            position: 'top',
            axisLabel: {
                formatter: '{value}人'
            }
        },
        yAxis: {
            type: 'category',
            data: ageData.map(item => item.range),
            inverse: true
        },
        series: [
            {
                name: '用户数量',
                type: 'bar',
                data: ageData.map(item => item.count),
                label: {
                    show: true,
                    position: 'right',
                    formatter: (params) => {
                        const total = panelData.value.ageList.length
                        const percentage = ((params.value / total) * 100).toFixed(1)
                        return `${params.value}人 (${percentage}%)`
                    }
                },
                itemStyle: {
                    color: function(params) {
                        const colors = ['#91cc75', '#73c0de', '#5470c6', '#fc8452', '#ee6666']
                        return colors[params.dataIndex]
                    },
                    borderRadius: [0, 4, 4, 0]
                }
            }
        ]
    }
    visitChart.setOption(option)
}

// 修改性别分布图表初始化
const initPieChart = async () => {
    await nextTick()
    if (!pieChartRef.value || !panelData.value) return
    
    pieChart = echarts.init(pieChartRef.value)
    
    // 确保数组存在且是数组
    if (!Array.isArray(panelData.value.sexList)) {
        return
    }
    
    const genderCount = {
        male: panelData.value.sexList.filter(sex => sex === 1).length,
        female: panelData.value.sexList.filter(sex => sex === 0).length
    }
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}人 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: '5%',
            top: 'middle',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            formatter: name => {
                const item = option.series[0].data.find(d => d.name === name)
                // 使用实际总人数计算百分比
                const total = panelData.value.sexList.length
                const percentage = ((item.value / total) * 100).toFixed(1)
                return `${name}  ${percentage}%`
            }
        },
        color: ['#409EFF', '#FF69B4'], // 男蓝女粉
        series: [
            {
                name: '性别分布',
                type: 'pie',
                radius: '65%',
                center: ['35%', '50%'],
                data: [
                    { value: genderCount.male, name: '男性' },
                    { value: genderCount.female, name: '女性' }
                ],
                itemStyle: {
                    borderRadius: 4,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{d}%',
                    position: 'inside',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#fff'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    scale: true,
                    scaleSize: 5
                }
            }
        ]
    }
    pieChart.setOption(option)
}

// 监听窗口大小化
const handleResize = () => {
    if (visitChart) {
        visitChart.resize()
    }
    if (pieChart) {
        pieChart.resize()
    }
}

// 修改生命周期钩子
onMounted(async () => {
    await getPanelData()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (visitChart) {
        visitChart.dispose()
    }
    if (pieChart) {
        pieChart.dispose()
    }
})
</script>
<style scoped>
.home-container {
    padding: 32px;
    /* 更柔和的背景渐变 */
    background: linear-gradient(135deg, #f5f8fc 0%, #edf1f7 100%);
    min-height: 100vh;
}

.stat-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;
}

.stat-card {
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    /* 更亮的卡片背景 */
    background: #ffffff;
    /* 更明显的阴影 */
    box-shadow: 0 4px 20px rgba(31, 45, 61, 0.06);
    overflow: hidden;
    position: relative;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    /* 更明显的顶部渐变 */
    background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.4));
    opacity: 0;
    transition: opacity 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    /* 更深的悬停阴影 */
    box-shadow: 0 12px 24px rgba(31, 45, 61, 0.09);
}

.stat-card:hover::before {
    opacity: 1;
}

.stat-content {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 24px;
    position: relative;
}

.stat-icon {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 28px;
    /* 更明显的图标阴影 */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
}

.stat-icon::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
    top: 0;
    left: 0;
}

.stat-card:hover .stat-icon {
    transform: scale(1.08) rotate(-3deg);
}

.stat-info {
    flex: 1;
}

.stat-value {
    font-size: 32px;
    font-weight: 700;
    /* 更深的文字渐变 */
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
}

.stat-label {
    font-size: 16px;
    /* 更深的标签颜色 */
    color: #475569;
    font-weight: 500;
    letter-spacing: 0.3px;
}

.charts-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
}

.chart-card {
    border-radius: 20px;
    border: none;
    background: #ffffff;
    /* 更明显的图表卡片阴影 */
    box-shadow: 0 4px 20px rgba(31, 45, 61, 0.06);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.chart-card:hover {
    /* 更深的图表卡片悬停阴影 */
    box-shadow: 0 12px 24px rgba(31, 45, 61, 0.09);
    transform: translateY(-3px);
}

.chart {
    height: 400px;
    padding: 16px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    /* 更明显的标题背景渐变 */
    background: linear-gradient(to right, #ffffff, #f1f5f9);
    border-bottom: 1px solid #e2e8f0;
}

.chart-header span {
    font-size: 18px;
    font-weight: 600;
    /* 更深的标题文字渐变 */
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.3px;
}

:deep(.el-card__header) {
    padding: 0;
    border-bottom: none;
}

:deep(.el-card__body) {
    padding: 24px;
}

/* 响应式设计 */
@media screen and (max-width: 1400px) {
    .stat-cards {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (max-width: 768px) {
    .home-container {
        padding: 20px;
    }
    
    .charts-container {
        grid-template-columns: 1fr;
    }
    
    .stat-cards {
        grid-template-columns: 1fr;
    }
}

/* 修改统计卡片的图标背景色 */
:deep(.stat-icon[style*="var(--el-color-primary)"]) {
    background: linear-gradient(135deg, #409EFF 0%, #2e89ff 100%) !important;
}

:deep(.stat-icon[style*="#67c23a"]) {
    background: linear-gradient(135deg, #67c23a 0%, #4eb319 100%) !important;
}

:deep(.stat-icon[style*="#e6a23c"]) {
    background: linear-gradient(135deg, #e6a23c 0%, #d48b1c 100%) !important;
}

:deep(.stat-icon[style*="#f56c6c"]) {
    background: linear-gradient(135deg, #f56c6c 0%, #e74c4c 100%) !important;
}
</style>
