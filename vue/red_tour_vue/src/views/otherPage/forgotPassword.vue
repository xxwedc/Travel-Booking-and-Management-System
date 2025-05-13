<template>
    <div class="forgot-password-container">
        <div class="forgot-password-box">
            <!-- 进度条部分 -->
            <div class="steps-wrapper">
                <el-steps :active="currentStep" finish-status="success">
                    <el-step title="验证账号" />
                    <el-step title="选择验证方式" />
                    <el-step title="重置密码" />
                </el-steps>
            </div>

            <!-- 表单内容部分 -->
            <div class="form-content">
                <h2>重置密码</h2>
                
                <!-- 步骤1：输入账号 -->
                <el-form v-if="currentStep === 1" ref="accountFormRef" :model="accountForm" :rules="accountRules">
                    <el-form-item prop="username">
                        <el-input
                            v-model="accountForm.username"
                            placeholder="请输入账号"
                            :prefix-icon="User"
                            size="large"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="submit-btn" @click="verifyAccount" :loading="loading">
                            下一步
                        </el-button>
                        <el-button class="back-btn" @click="handleBack">返回登录</el-button>
                    </el-form-item>
                </el-form>

                <!-- 步骤2：选择验证方式 -->
                <div v-if="currentStep === 2 && !verifyMethod" class="verify-methods">
                    <p class="account-info">当前账号：{{ accountForm.username }}</p>
                    <div class="method-options">
                        <div class="method-card" @click="selectMethod('username')">
                            <el-icon><User /></el-icon>
                            <span>身份验证</span>
                            <p>通过验证身份信息找回密码</p>
                        </div>
                        <div class="method-card" @click="selectMethod('phone')">
                            <el-icon><Iphone /></el-icon>
                            <span>手机验证</span>
                            <p>通过手机验证码重置密码</p>
                        </div>
                    </div>
                    <div class="step-buttons">
                        <el-button class="back-btn" @click="goBack">返回上一步</el-button>
                    </div>
                </div>

                <!-- 步骤2.1：身份验证 -->
                <el-form v-if="currentStep === 2 && verifyMethod === 'username'" ref="userInfoFormRef" :model="userInfoForm" :rules="userInfoRules">
                    <p class="account-info">当前账号：{{ accountForm.username }}</p>
                    <el-form-item prop="username">
                        <el-input
                            v-model="userInfoForm.username"
                            placeholder="请输入用户名"
                            :prefix-icon="User"
                            size="large"
                        />
                    </el-form-item>
                    <el-form-item prop="phone">
                        <el-input
                            v-model="userInfoForm.phone"
                            placeholder="请输入注册时的手机号"
                            :prefix-icon="Iphone"
                            size="large"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="submit-btn" @click="verifyUserInfo" :loading="loading">验证</el-button>
                        <el-button class="back-btn" @click="verifyMethod = ''">返回</el-button>
                    </el-form-item>
                </el-form>

                <!-- 步骤2.2：手机验证 -->
                <el-form v-if="currentStep === 2 && verifyMethod === 'phone'" ref="phoneFormRef" :model="phoneForm" :rules="phoneRules">
                    <el-form-item prop="phone">
                        <el-input
                            v-model="phoneForm.phone"
                            placeholder="请输入手机号"
                            :prefix-icon="Iphone"
                            size="large"
                        />
                    </el-form-item>
                    <el-form-item prop="code" class="code-item">
                        <el-input
                            v-model="phoneForm.code"
                            placeholder="请输入6位验证码"
                            :prefix-icon="Key"
                            maxlength="6"
                            size="large"
                        />
                        <el-button 
                            :disabled="countdown > 0"
                            @click="sendCode"
                        >
                            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="submit-btn" @click="verifyPhone" :loading="loading">验证</el-button>
                        <el-button class="back-btn" @click="verifyMethod = ''">返回</el-button>
                    </el-form-item>
                </el-form>

                <!-- 步骤3：重置密码 -->
                <el-form v-if="currentStep === 3" ref="passwordFormRef" :model="passwordForm" :rules="passwordRules">
                    <el-form-item prop="password">
                        <el-input
                            v-model="passwordForm.password"
                            type="password"
                            placeholder="请输入新密码"
                            :prefix-icon="Lock"
                            show-password
                            size="large"
                        />
                    </el-form-item>
                    <el-form-item prop="confirmPassword">
                        <el-input
                            v-model="passwordForm.confirmPassword"
                            type="password"
                            placeholder="请确认新密码"
                            :prefix-icon="Lock"
                            show-password
                            size="large"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="submit-btn" @click="resetPassword" :loading="loading">
                            确认重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <!-- 在现有模板中添加模拟手机界面 -->
        <div class="mock-phone" :class="{ 'show-phone': showMockPhone }">
            <div class="phone-header">
                <div class="status-bar">
                    <span class="time">{{ currentTime }}</span>
                    <div class="right-icons">
                        <span class="signal">
                            <el-icon><Cellphone /></el-icon>
                        </span>
                        <span class="wifi">
                            <el-icon><Monitor /></el-icon>
                        </span>
                        <span class="battery">
                            <el-icon><CircleCheck /></el-icon>
                        </span>
                    </div>
                </div>
                <div class="nav-bar">
                    <span class="back">
                        <el-icon><ArrowLeft /></el-icon>
                    </span>
                    <span class="phone-number">10086</span>
                </div>
            </div>
            <div class="messages-container">
                <div class="message-bubble">
                    <div class="message-text">
                        【增城红旅】您正在验证手机号，您的验证码是：{{ mockCode }}，请尽快验证，请勿泄露你的验证码。如非本人操作请忽略。
                    </div>
                    <div class="message-time">{{ messageTime }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
    User, Lock, Iphone, Key, 
    ArrowLeft, Cellphone, Monitor, 
    CircleCheck
} from '@element-plus/icons-vue'
import request from '@/utils/request'

const router = useRouter()
const currentStep = ref(1)
const loading = ref(false)
const verifyMethod = ref('')
const countdown = ref(0)
const showMockPhone = ref(false)
const mockCode = ref('')
const currentTime = ref('')
const messageTime = ref('')
const userId = ref('')

// 账号表单
const accountFormRef = ref(null)
const accountForm = reactive({
    username: ''
})
const accountRules = {
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ]
}

// 身份验证表单
const userInfoFormRef = ref(null)
const userInfoForm = reactive({
    phone: '',
    username: ''
})
const userInfoRules = {
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ]
}

// 手机验证表单
const phoneFormRef = ref(null)
const phoneForm = reactive({
    phone: '',
    code: ''
})
const phoneRules = {
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { pattern: /^\d{6}$/, message: '请输入6位数字验证码', trigger: 'blur' }
    ]
}

// 密码表单
const passwordFormRef = ref(null)
const passwordForm = reactive({
    password: '',
    confirmPassword: ''
})
const passwordRules = {
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== passwordForm.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

// 验证账号
const verifyAccount = async () => {
    try {
        await accountFormRef.value.validate()
        loading.value = true
        // TODO: 调用验证账号API
        currentStep.value = 2
    } catch (error) {
        ElMessage.error(error.message || '验证失败')
    } finally {
        loading.value = false
    }
}

// 选择验证方式
const selectMethod = (method) => {
    verifyMethod.value = method
}

// 验证身份信息
const verifyUserInfo = async () => {
    try {
        await userInfoFormRef.value.validate()
        loading.value = true
        
        const res = await request({
            url: '/user/checkPassword',
            method: 'post',
            data: {
                account: accountForm.username,
                username: userInfoForm.username,
                phone: userInfoForm.phone,
            }
        })

        if (res.status === 200) {
            userId.value = res.data
            ElMessage.success('验证成功')
            currentStep.value = 3
        } else {
            ElMessage.error(res.message || '验证失败')
        }
    } catch (error) {
        ElMessage.error(error.message || '验证失败')
    } finally {
        loading.value = false
    }
}

// 发送验证码
const sendCode = async () => {
    if (!phoneForm.phone) {
        return ElMessage.warning('请先输入手机号')
    }
    try {
        loading.value = true
        mockCode.value = String(Math.floor(100000 + Math.random() * 900000))
        
        const now = new Date()
        currentTime.value = now.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit'
        })
        messageTime.value = currentTime.value

        countdown.value = 60
        const timer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                clearInterval(timer)
            }
        }, 1000)

        ElMessage({
            type: 'success',
            message: '验证码发送中...',
            duration: 2000
        })

        setTimeout(() => {
            showMockPhone.value = true
            ElMessage.success('验证码已发送')
        }, 2000)

    } catch (error) {
        ElMessage.error(error.message || '发送失败')
    } finally {
        loading.value = false
    }
}

// 验证手机
const verifyPhone = async () => {
    try {
        await phoneFormRef.value.validate()
        loading.value = true

        if (phoneForm.code !== mockCode.value) {
            ElMessage.error('验证码错误，请重新输入')
            phoneForm.code = ''
            loading.value = false
            return
        }

        const res = await request({
            url: '/user/checkPassword',
            method: 'post',
            data: {
                account: accountForm.username,
                phone: phoneForm.phone,
                type: 'phone'
            }
        })

        if (res.status === 200) {
            userId.value = res.data
            ElMessage.success('验证成功')
            currentStep.value = 3
            showMockPhone.value = false
        } else {
            ElMessage.error(res.message || '验证失败')
        }
    } catch (error) {
        ElMessage.error(error.message || '验证失败')
    } finally {
        loading.value = false
    }
}

// 重置密码
const resetPassword = async () => {
    try {
        await passwordFormRef.value.validate()
        loading.value = true
        
        const res = await request({
            url: '/api/updateUserInfo',
            method: 'post',
            data: {
                id: userId.value,
                password: passwordForm.password
            }
        })

        if (res.status === 200) {
            ElMessage.success('密码重置成功')
            router.push('/login')
        } else {
            ElMessage.error(res.message || '重置失败')
        }
    } catch (error) {
        ElMessage.error(error.message || '重置失败')
    } finally {
        loading.value = false
    }
}

// 返回登录页
const handleBack = () => {
    router.push('/login')
}

// 返回上一步
const goBack = () => {
    if (currentStep.value > 1) {
        currentStep.value--
        verifyMethod.value = ''
        if (currentStep.value === 1) {
            accountForm.username = ''
        } else if (currentStep.value === 2) {
            userInfoForm.phone = ''
            userInfoForm.username = ''
            phoneForm.phone = ''
            phoneForm.code = ''
        }
    }
}

// 监听路由变化，隐藏手机界面
watch(
    () => router.currentRoute.value.path,
    () => {
        showMockPhone.value = false
    }
)

// 添加对 currentStep 的监听
watch(currentStep, (newStep) => {
    // 当步骤不是2时，隐藏手机界面
    if (newStep !== 2) {
        showMockPhone.value = false
    }
})
</script>

<style scoped>
.forgot-password-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #b44141 0%, #7d3b3b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.forgot-password-box {
    width: 100%;
    max-width: 480px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

/* 进度条样式 */
.steps-wrapper {
    background: #f5f7fa;
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
}

:deep(.el-steps) {
    --el-text-color-regular: #909399;
    --el-text-color-primary: #303133;
}

:deep(.el-step__title) {
    font-size: 14px;
    line-height: 1.5;
}

:deep(.el-step__head.is-process) {
    color: #b44141;
    border-color: #b44141;
}

:deep(.el-step__title.is-process) {
    color: #b44141;
    font-weight: 500;
}

:deep(.el-step__head.is-success),
:deep(.el-step__title.is-success) {
    color: #67c23a;
}

/* 表单内容样式 */
.form-content {
    padding: 40px;
}

.form-content h2 {
    font-size: 26px;
    color: #2c3e50;
    text-align: center;
    margin-bottom: 40px;
}

/* 验证方式卡片样式 */
.method-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin: 30px 0;
}

.method-card {
    background: #f5f7fa;
    border-radius: 12px;
    padding: 30px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
}

.method-card:hover {
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.method-card .el-icon {
    font-size: 32px;
    color: #b44141;
    margin-bottom: 16px;
}

.method-card span {
    display: block;
    font-size: 18px;
    color: #2c3e50;
    margin-bottom: 12px;
}

.method-card p {
    font-size: 14px;
    line-height: 1.5;
    color: #909399;
    margin: 0;
}

/* 按钮样式 */
.submit-btn {
    width: 100%;
    height: 45px;
    margin-bottom: 15px;
    background: linear-gradient(135deg, #b44141 0%, #7d3b3b 100%);
    border: none;
    font-size: 16px;
}

.back-btn {
    width: auto;
    min-width: 120px;
    height: 45px;
    border-color: #dcdfe6;
    font-size: 16px;
}

.back-btn:hover {
    border-color: #b44141;
    color: #b44141;
}

/* 验证码输入框组 */
.code-item {
    display: flex;
    gap: 15px;
}

.code-item .el-input {
    flex: 1;
}

.code-item .el-button {
    width: 130px;
    height: 45px;
}

/* 账号信息显示 */
.account-info {
    text-align: center;
    color: #606266;
    background: #f5f7fa;
    padding: 15px;
    border-radius: 8px;
    margin: 30px 0;
    font-size: 15px;
}

/* 表单项通用样式 */
:deep(.el-form-item) {
    margin-bottom: 25px;
}

:deep(.el-input__wrapper) {
    padding: 4px 15px;
    height: 45px;
    background-color: #fff !important;
    box-shadow: 0 0 0 1px #dcdfe6;
}

:deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #b44141;
}

:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #b44141 !important;
}

:deep(.el-input__inner:-webkit-autofill) {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: #606266 !important;
}

:deep(.el-input__inner:-webkit-autofill:focus) {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
}

:deep(.el-input__inner:-webkit-autofill:hover) {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
}

/* 模拟手机样式 */
.mock-phone {
    position: fixed;
    left: -400px;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    height: 600px;
    background: #f2f2f7;
    border-radius: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    overflow: hidden;
    border: 12px solid #000;
    opacity: 0;
}

.mock-phone.show-phone {
    left: 20px;
    opacity: 1;
}

/* 手机状态栏 */
.status-bar {
    background: #f2f2f7;
    padding: 5px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #000;
}

.right-icons {
    display: flex;
    gap: 8px;
    align-items: center;
}

.right-icons .el-icon {
    font-size: 14px;
    color: #000;
}

.signal .el-icon {
    font-size: 16px;
}

.battery .el-icon {
    font-size: 16px;
}

/* 手机导航栏 */
.nav-bar {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    background: #f2f2f7;
    border-bottom: 1px solid #e5e5ea;
}

.back {
    color: #007AFF;
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-right: 10px;
}

.phone-number {
    font-size: 16px;
    color: #000;
}

/* 息样式 */
.messages-container {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background: #fff;
}

.message-bubble {
    background: #e5e5ea;
    border-radius: 15px;
    padding: 10px 12px;
    max-width: 95%;
    margin: 10px 0;
}

.message-text {
    font-size: 14px;
    color: #000;
    line-height: 1.4;
    margin-bottom: 4px;
}

.message-time {
    font-size: 11px;
    color: #8e8e93;
    text-align: right;
}

/* 响应式样式 */
@media (max-width: 768px) {
    .mock-phone {
        display: none;
    }
}

@media (max-width: 576px) {
    .forgot-password-box {
        margin: 0 15px;
    }

    .steps-wrapper {
        padding: 15px 10px;
    }

    .form-content {
        padding: 25px;
    }

    :deep(.el-step__title) {
        font-size: 13px;
    }

    .account-info {
        font-size: 14px;
        padding: 12px;
        margin: 20px 0;
    }
}
</style>