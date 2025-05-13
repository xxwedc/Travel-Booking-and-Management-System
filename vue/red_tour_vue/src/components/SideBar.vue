<template>
    <el-menu
        class="sidebar-menu"
        :default-active="activeMenu"
        background-color="#f8fafc"
        text-color="#475569"
        active-text-color="#b44141"
        router
    >
        <div class="logo-wrapper">
            <img src="http://localhost:8888/pic/mlzc.png" alt="logo" class="logo-image">
        </div>

        <el-menu-item index="/home" class="menu-item">
            <el-icon><HomeFilled /></el-icon>
            <template #title>首页</template>
        </el-menu-item>

        <el-menu-item index="/scenic" class="menu-item">
            <el-icon><LocationFilled /></el-icon>
            <template #title>景点管理</template>
        </el-menu-item>

        <el-menu-item index="/order" class="menu-item">
            <el-icon><Calendar /></el-icon>
            <template #title>预约订单</template>
        </el-menu-item>

        <el-menu-item index="/user" class="menu-item">
            <el-icon><UserFilled /></el-icon>
            <template #title>用户管理</template>
        </el-menu-item>
    

        <el-menu-item index="/news" class="menu-item">
            <el-icon><Document /></el-icon>
            <template #title>新闻管理</template>
        </el-menu-item>

        <el-menu-item index="/comment" class="menu-item">
            <el-icon><ChatDotRound /></el-icon>
            <template #title>评论管理</template>
        </el-menu-item>

        <el-menu-item index="/account" class="menu-item">
            <el-icon><Setting /></el-icon>
            <template #title>账号设置</template>
        </el-menu-item>

    </el-menu>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
    HomeFilled,
    LocationFilled,
    Calendar,
    UserFilled,
    MapLocation,
    Setting,
    Document,
    ChatDotRound
} from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = ref(route.path)

watch(() => route.path, (newPath) => {
    activeMenu.value = newPath
})
</script>

<style scoped>
.sidebar-menu {
    height: 100vh;
    border-right: none;
    box-shadow: 1px 0 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    position: relative;
}

.logo-wrapper {
    height: 64px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #e2e8f0;
    background: linear-gradient(to right, #fef2f2, #f8fafc);
    margin-bottom: 8px;
}

.logo-image {
    height: 40px;
    width: auto;
    object-fit: contain;
    transition: all 0.3s;
}

.system-title {
    font-size: 18px;
    font-weight: 600;
    color: #b44141;
    white-space: nowrap;
    letter-spacing: 1px;
    transition: opacity 0.3s;
}

.menu-item {
    margin: 4px 12px;
    border-radius: 8px;
    height: 48px;
}

:deep(.el-menu) {
    border-right: none;
}

:deep(.el-menu-item) {
    transition: all 0.3s ease;
    margin: 4px 12px;
    border-radius: 8px;
}

:deep(.el-menu-item:hover) {
    background-color: #f1f5f9 !important;
    transform: translateX(4px);
}

:deep(.el-menu-item.is-active) {
    background: linear-gradient(to right, #fef2f2, #fff1f1) !important;
    color: #b44141 !important;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(180, 65, 65, 0.1);
}

:deep(.el-menu-item .el-icon) {
    font-size: 18px;
    margin-right: 12px;
}

.collapse-trigger {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff, #f8fafc);
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
}

.collapse-trigger:hover {
    background: linear-gradient(135deg, #fef2f2, #fff1f1);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(180, 65, 65, 0.15);
}

.collapse-trigger .el-icon {
    font-size: 18px;
    color: #b44141;
    transition: all 0.3s;
}

.collapse-trigger .el-icon.is-collapse {
    transform: rotate(180deg);
}

/* 添加折叠时的样式 */
:deep(.el-menu--collapse) {
    width: 64px !important;
}

:deep(.el-menu--collapse .menu-item) {
    margin: 4px 8px;
}

/* 优化滚动条样式 */
.sidebar-menu::-webkit-scrollbar {
    width: 4px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-track {
    background-color: transparent;
}
</style>
