<template>
    <div class="header">
        <div class="left-section">
            <div class="logo">
                <h1>增城红旅管理系统</h1>
            </div>
        </div>
        
        <div class="right-section">
            <div class="header-actions">
                

                <el-tooltip content="全屏" placement="bottom">
                    <div class="action-item" @click="toggleFullScreen">
                        <el-icon><FullScreen /></el-icon>
                    </div>
                </el-tooltip>
                

                <el-divider direction="vertical" />

                <el-dropdown trigger="click" class="user-dropdown">
                    <div class="user-profile">
                        <div class="avatar-wrapper">
                            <el-avatar :size="36" :src="avatarUrl">
                                {{ username.charAt(0).toUpperCase() }}
                            </el-avatar>
                            <div class="avatar-badge">
                                <el-icon><CircleCheckFilled /></el-icon>
                            </div>
                        </div>
                        <div class="user-info">
                            <span class="username">{{ username }}</span>
                            <div class="role-wrapper">
                                <el-icon><UserFilled /></el-icon>
                                <span class="user-role">超级管理员</span>
                            </div>
                        </div>
                        <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="goToAccount">
                                <el-icon><UserFilled /></el-icon>个人信息
                            </el-dropdown-item>
                            <el-dropdown-item divided @click="handleLogout">
                                <el-icon><SwitchButton /></el-icon>退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
    HomeFilled,
    FullScreen,
    ArrowDown,
    UserFilled,
    SwitchButton,
    CircleCheckFilled,
    User
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import '../styles/Header.css'

const router = useRouter()
const username = ref('')
const avatarUrl = ref('')

// 在组件挂载时获取用户名
onMounted(() => {
    const storedUsername = localStorage.getItem('username')
    username.value = storedUsername || '未登录'
    
    // 如果未登录且当前不在登录页，才重定向到登录页
    if (!storedUsername && router.currentRoute.value.path !== '/login') {
        router.push('/login')
    }
})

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

const handleLogout = () => {
    // 清除本地存储的用户信息
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('password')
    
    ElMessage.success('退出成功')
    // 跳转到登录页
    router.push('/login')
}

// 添加跳转到个人信息页面的方法
const goToAccount = () => {
  router.push('/account')
}
</script>
