<template>
    <div class="login-container">
        <!-- 背景动画 -->
        <div class="area">
            <ul class="circles">
                <li v-for="n in 10" :key="n"></li>
            </ul>
        </div>

        <div class="login-box">
            <div class="login-header">
                <div class="logo-wrapper">
                    <img src="http://localhost:8888/pic/mlzc.png" alt="logo" class="logo-image">
                </div>
                <h2>增城红旅管理系统</h2>
                <p class="sub-title">Red Tourism Management System</p>
            </div>
            
            <el-form 
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                class="login-form"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        placeholder="请输入用户名"
                        :prefix-icon="User"
                        size="large"
                    />
                </el-form-item>
                
                <el-form-item prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        placeholder="请输入密码"
                        :prefix-icon="Lock"
                        show-password
                        size="large"
                        @keyup.enter="handleLogin"
                    />
                </el-form-item>
                
                <el-form-item class="login-options">
                    <div class="left-options">
                        <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
                    </div>
                    <div class="right-options">
                        <el-link 
                            type="primary" 
                            :underline="false" 
                            class="forget-pwd"
                            @click="handleForgotPassword"
                        >忘记密码？</el-link>
                    </div>
                </el-form-item>
                
                <el-form-item>
                    <el-button 
                        type="primary" 
                        class="login-button"
                        :loading="loading"
                        size="large"
                        @click="handleLogin"
                    >
                        {{ loading ? '登录中...' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import request from '../../src/utils/request'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
    username: '',
    password: ''
})

const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ]
}

const handleLogin = async () => {
    try {
        await loginFormRef.value.validate()
        
        loading.value = true
        
        const res = await request({
            url: '/user/loginByRole',
            method: 'post',
            data: {
                account: loginForm.username.trim(),
                password: loginForm.password
            }
        })
        
        if (res.status === 200 && res.data) {
            const token = res.data
            const currentTime = new Date().getTime()
            
            localStorage.setItem('token', token)
            localStorage.setItem('tokenTime', currentTime.toString())
            localStorage.setItem('username', loginForm.username.trim())
            
            const expiresIn = 24 * 60 * 60 * 1000
            localStorage.setItem('tokenExpires', (currentTime + expiresIn).toString())
            
            ElMessage({
                type: 'success',
                message: res.message || '登录成功',
                duration: 2000
            })
            
            loginForm.username = ''
            loginForm.password = ''
            
            await router.replace('/')
            
        } else {
            throw new Error(res.message || '登录失败')
        }
        
    } catch (error) {
        ElMessage({
            type: 'error',
            message: error.message || '登录失败，请稍后重试',
            duration: 3000
        })
        
        loginForm.password = ''
        
    } finally {
        loading.value = false
    }
}

// 移除 checkSavedLogin 函数的内容，保留空函数
const checkSavedLogin = () => {
    // 移除所有本地存储相关代码
}

// 添加处理忘记密码的函数
const handleForgotPassword = () => {
    router.push('/forgotPassword')
}
</script>

<style scoped>
.login-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #b44141 0%, #7d3b3b 100%);
    position: relative;
    overflow: hidden;
}

.login-box {
    width: 420px;
    padding: 30px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(8px);
    position: relative;
    z-index: 2;
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.logo-wrapper {
    
    margin: 0 auto 15px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
}

.logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.login-header h2 {
    font-size: 26px;
    color: #445566;
    margin: 0 0 8px 0;
    font-weight: 600;
}

.sub-title {
    font-size: 15px;
    color: #8896a6;
    margin: 0;
}

.login-form {
    margin-top: 30px;
}

.login-form :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.9) !important;
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(180, 65, 65, 0.1);
    transition: all 0.3s ease;
    padding: 4px 15px;
}

.login-form :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px rgba(180, 65, 65, 0.3);
    background: rgba(255, 255, 255, 0.95);
}

.login-form :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 2px rgba(180, 65, 65, 0.2);
    background: rgba(255, 255, 255, 1);
}

.login-form :deep(.el-input__inner) {
    height: 40px;
    color: #445566;
}

.login-form :deep(.el-input__inner::placeholder) {
    color: #a4b0be;
}

.login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 24px;
    padding: 0 2px;
}

.left-options {
    display: flex;
    align-items: center;
}

.right-options {
    display: flex;
    align-items: center;
    position: absolute;
    right: 20px;
}

.login-options :deep(.el-checkbox) {
    height: 32px;
    display: flex;
    align-items: center;
}

.login-options :deep(.el-checkbox__label) {
    color: #8896a6;
    font-size: 14px;
    padding-left: 8px;
}

.forget-pwd {
    font-size: 12px;
    color: #666;
    transition: all 0.3s;
    padding: 6px 0;
}

.forget-pwd:hover {
    color: #cc6666 !important;
    transform: translateX(2px);
}

.login-options :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #b44141;
    border-color: #b44141;
}

.login-options :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: #b44141;
}

.login-options :deep(.el-checkbox__inner:hover) {
    border-color: #b44141;
}

.login-button {
    width: 100%;
    height: 40px;
    font-size: 16px;
    border-radius: 8px;
    font-weight: 500;
    letter-spacing: 2px;
    background: linear-gradient(135deg, #b44141 0%, #7d3b3b 100%);
    border: none;
    transition: all 0.3s;
}

.login-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(180, 65, 65, 0.3);
    background: linear-gradient(135deg, #c44141 0%, #8d3b3b 100%);
}

.login-button:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(180, 65, 65, 0.2);
}

/* 背景动画 */
.area {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
}

.circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
}

.circles li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.06);
    animation: animate 25s linear infinite;
    bottom: -150px;
    border-radius: 50%;
}

.circles li:nth-child(1) {
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
    background: rgba(136, 150, 166, 0.1);
}

.circles li:nth-child(2) {
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
    background: rgba(136, 150, 166, 0.06);
}

.circles li:nth-child(3) {
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
    background: rgba(136, 150, 166, 0.08);
}

.circles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
    background: rgba(136, 150, 166, 0.09);
}

.circles li:nth-child(5) {
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
}

.circles li:nth-child(6) {
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
}

.circles li:nth-child(7) {
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
}

.circles li:nth-child(8) {
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
}

.circles li:nth-child(9) {
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
}

.circles li:nth-child(10) {
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
}

@keyframes animate {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
    }
    100% {
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
    }
}

/* 响应式设计 */
@media screen and (max-width: 576px) {
    .login-box {
        width: 90%;
        padding: 30px 20px;
        margin: 0 20px;
    }

    .login-header h2 {
        font-size: 24px;
    }

    .sub-title {
        font-size: 14px;
    }
}

/* 添加以下样式来覆盖浏览器自动填充的背景色 */
.login-form :deep(.el-input__inner:-webkit-autofill) {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: #445566 !important;
    caret-color: #b44141;
    transition: background-color 5000s ease-in-out 0s;
}

.login-form :deep(.el-input__inner:-webkit-autofill:hover),
.login-form :deep(.el-input__inner:-webkit-autofill:focus) {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
}
</style>

