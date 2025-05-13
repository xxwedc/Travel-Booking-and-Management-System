<template>
    <div class="user-container">
        <el-tabs v-model="activeTab" class="user-tabs" @tab-click="handleTabChange">
            <el-tab-pane label="管理员账号" name="admin">
                <div class="admin-section" v-loading="adminLoading">
                    <div class="search-wrapper">
                        <el-input
                            v-model="searchKeyword"
                            placeholder="搜索管理员"
                            class="search-input"
                            @keyup.enter="handleSearch"
                            clearable
                        >
                            <template #prefix>
                                <el-icon class="search-icon"><Search /></el-icon>
                            </template>
                        </el-input>
                        <div class="search-buttons">
                            <el-button 
                                type="primary" 
                                @click="handleSearch" 
                                :loading="activeTab === 'admin' ? adminLoading : tableLoading"
                            >
                                <el-icon><Search /></el-icon>
                                搜索
                            </el-button>
                            <el-button @click="clearSearch">
                                <el-icon><RefreshLeft /></el-icon>
                                重置
                            </el-button>
                            <el-button type="primary" @click="handleAddAdmin">
                                <el-icon><Plus /></el-icon>
                                新设管理员
                            </el-button>
                        </div>
                    </div>
                    <div class="admin-cards">
                        <el-empty v-if="!adminList.length" description="暂无管理员" />
                        <div v-else v-for="admin in adminList" :key="admin.id" class="admin-card">
                            <div class="admin-avatar">
                                <el-avatar :size="64" :src="admin.avatar">
                                    {{ admin.username?.charAt(0)?.toUpperCase() }}
                                </el-avatar>
                                <div class="admin-status" :class="{ active: admin.status === 1 }">
                                    <el-icon><CircleCheck /></el-icon>
                                </div>
                            </div>
                            <div class="admin-info">
                                <div class="admin-name">{{ admin.username }}</div>
                                <div class="admin-role">超级管理员</div>
                            </div>
                            <div class="admin-contact">
                                <div class="contact-item">
                                    <el-icon><Phone /></el-icon>
                                    <span>{{ admin.phone }}</span>
                                </div>
                            </div>
                            <div class="admin-actions">
                                <el-button type="danger" text @click="handleDelete(admin)">
                                    <el-icon><Delete /></el-icon>删除
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div class="pagination-container" v-if="adminList.length">
                        <el-pagination
                            v-model:current-page="currentPage"
                            v-model:page-size="pageSize"
                            :total="total"
                            :page-sizes="[6, 12]"
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
            </el-tab-pane>

            <el-tab-pane label="普通用户" name="user">
                <div class="user-section">
                    <div class="search-wrapper">
                        <el-input
                            v-model="searchKeyword"
                            placeholder="搜索用户"
                            class="search-input"
                            @keyup.enter="handleSearch"
                            clearable
                        >
                            <template #prefix>
                                <el-icon class="search-icon"><Search /></el-icon>
                            </template>
                        </el-input>
                        <div class="search-buttons">
                            <el-button 
                                type="primary" 
                                @click="handleSearch" 
                                :loading="activeTab === 'admin' ? adminLoading : tableLoading"
                            >
                                <el-icon><Search /></el-icon>
                                搜索
                            </el-button>
                            <el-button @click="clearSearch">
                                <el-icon><RefreshLeft /></el-icon>
                                重置
                            </el-button>
                        </div>
                    </div>
                    <el-card class="table-card">
                        <el-table
                            v-loading="tableLoading"
                            :data="userList"
                            border
                            stripe
                            style="width: 100%"
                            :empty-text="searchKeyword ? '未找到匹配的用户' : '暂无用户数据'"
                            highlight-current-row
                        >
                            <el-table-column label="头像" width="80" align="center">
                                <template #default="{ row }">
                                    <el-avatar :size="40" :src="row.avatar">
                                        {{ row.username?.charAt(0)?.toUpperCase() }}
                                    </el-avatar>
                                </template>
                            </el-table-column>
                            <el-table-column prop="username" label="用户名" min-width="120" />
                            <el-table-column prop="phone" label="手机号" width="120" />
                            <el-table-column label="注册时间" width="180">
                                <template #default="{ row }">
                                    {{ formatDate(row.joinedTime) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" width="100">
                                <template #default="{ row }">
                                    <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                                        {{ row.status === 1 ? '正常' : '禁用' }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="地址" min-width="180" />
                            <el-table-column label="性别" width="80">
                                <template #default="{ row }">
                                    {{ row.sex === 0 ? '女' : row.sex === 1 ? '男' : '未知' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="age" label="年龄" width="80" />
                            <el-table-column label="操作" width="120" fixed="right">
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
                                :page-sizes="[6, 12]"
                                layout="total, sizes, prev, pager, next, jumper"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                            >
                                <template #total>
                                    总 <span class="total-count">{{ total }}</span> 条
                                </template>
                            </el-pagination>
                        </div>
                    </el-card>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            v-model="addAdminDialogVisible"
            title="新设管理员"
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="addAdminFormRef"
                :model="addAdminForm"
                :rules="addAdminRules"
                label-width="100px"
            >
            <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addAdminForm.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addAdminForm.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="addAdminForm.password"
                        type="password"
                        placeholder="请输入密码"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input
                        v-model="addAdminForm.confirmPassword"
                        type="password"
                        placeholder="请再次输入密码"
                        show-password
                    />
                </el-form-item>
                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addAdminDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitAddAdmin" :loading="submitLoading">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    Search, 
    Phone, 
    CircleCheck,
    RefreshLeft,
    Delete,
    Plus
} from '@element-plus/icons-vue'
import request from '@/utils/request'

const adminList = ref([])

const tableLoading = ref(false)
const adminLoading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(6)
const searchKeyword = ref('')
const userList = ref([])

// 添加选项卡状态
const activeTab = ref('admin')

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return '--'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(/\//g, '-')
}

// 获取用户列表
const getUserList = async () => {
    if (activeTab.value === 'admin') {
        adminLoading.value = true
    } else {
        tableLoading.value = true
    }
    
    try {
        const searchUser = {
            username: searchKeyword.value?.trim(),
            role: activeTab.value === 'admin' ? 1 : 2
        }
        
        if (activeTab.value === 'admin') {
            const response = await request({
                url: `/user/getUserByPage/${currentPage.value}/size/${pageSize.value}`,
                method: 'post',
                data: searchUser
            })
            
            adminList.value = response.list.map(user => ({
                id: user.id,
                username: user.username,
                phone: user.phone,
                avatar: '',
                status: user.status || 1,
                joinedTime: user.joinedTime
            }))
            
            total.value = response.total || adminList.value.length
        } else {
            const response = await request({
                url: `/user/getUserByPage/${currentPage.value}/size/${pageSize.value}`,
                method: 'post',
                data: searchUser
            })

            userList.value = response.list.map(user => ({
                id: user.id,
                username: user.username,
                phone: user.phone,
                avatar: '',
                status: user.status || 1,
                joinedTime: user.joinedTime,
                address: user.address || '未设置',
                sex: user.sex,
                age: user.age || '--'
            }))

            total.value = response.total || userList.value.length
        }
    } catch (error) {
        ElMessage.error('获取用户列表失败')
    } finally {
        adminLoading.value = false
        tableLoading.value = false
    }
}

// 搜索功能
const handleSearch = () => {
    currentPage.value = 1 // 搜索重置为第一页
    getUserList()
}

// 清空搜索
const clearSearch = () => {
    searchKeyword.value = ''
    currentPage.value = 1
    pageSize.value = 6
    getUserList()
}

// 分页处理
const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1 // 切换每页示数量时，重置为第一页
    getUserList()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    getUserList()
}

// 添加选项卡切换处理
const handleTabChange = (tab) => {
    searchKeyword.value = ''
    currentPage.value = 1
    pageSize.value = 6
    activeTab.value = tab.props.name
    getUserList()
}

// 页面初始化
onMounted(() => {
    getUserList()  // 直接获取当前标签页的数据即可
})

// 修改删除方法
const handleDelete = (row) => {
    ElMessageBox.confirm(
        `确定要删除用户"${row.username}"吗？此操作不可恢复！`,
        '危险操作',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'danger',
            draggable: true,
            closeOnClickModal: false,
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    deleteUser(row)
                        .then(() => {
                            done()
                            instance.confirmButtonLoading = false
                        })
                        .catch(() => {
                            instance.confirmButtonLoading = false
                        })
                } else {
                    done()
                }
            }
        }
    ).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 抽取删除用户的具体实现
const deleteUser = async (row) => {
    try {
        await request({
            url: '/user/deleteUserById',  // 修改为新的删除接口
            method: 'post',
            data: {
                id: row.id
            }
        })
        ElMessage.success('删除成功')
        getUserList() // 刷新列表
    } catch (error) {
        ElMessage.error('删除失败')
        throw error  // 抛出错误以便外层捕获
    }
}

// 添加新的响应式变量
const addAdminDialogVisible = ref(false)
const addAdminFormRef = ref(null)
const submitLoading = ref(false)
const addAdminForm = ref({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
})

// 表单验证规则
const addAdminRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== addAdminForm.value.password) {
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输正确的手机号',
            trigger: 'blur'
        }
    ]
}

// 添加处理函数
const handleAddAdmin = () => {
    addAdminForm.value = {
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
    }
    addAdminDialogVisible.value = true
}

// 修改提交函数
const submitAddAdmin = async () => {
    if (!addAdminFormRef.value) return
    
    await addAdminFormRef.value.validate(async (valid) => {
        if (valid) {
            submitLoading.value = true
            try {
                // 格式化日期为 YYYY-MM-DD HH:mm:ss.SSS 格式
                const now = new Date()
                const joinedTime = now.getFullYear() + '-' +
                    String(now.getMonth() + 1).padStart(2, '0') + '-' +
                    String(now.getDate()).padStart(2, '0') + ' ' +
                    String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0') + ':' +
                    String(now.getSeconds()).padStart(2, '0') + '.000'

                await request({
                    url: '/user/register',
                    method: 'post',
                    data: {
                        account: addAdminForm.value.phone,
                        password: addAdminForm.value.password,
                        username: addAdminForm.value.username,
                        sex: 1,
                        age: 18,
                        address: '北京市朝阳区',
                        phone: addAdminForm.value.phone,
                        joinedTime: joinedTime,  // 使用格式化后的日期
                        role: 1
                    }
                })
                ElMessage.success('添加管理员成功')
                addAdminDialogVisible.value = false
                getUserList()
            } catch (error) {
                ElMessage.error('添加管理员失败')
            } finally {
                submitLoading.value = false
            }
        }
    })
}
</script>

<style scoped>
/* 整体容器样式 */
.user-container {
    padding: 24px;
    min-height: 100%;
    background-color: #f5f7fa;
}

/* 管理员卡片区域 */
.admin-section {
    background: transparent;
    padding: 0;
    box-shadow: none;
}

.admin-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    padding: 24px;
}

/* 管理员卡片样式优化 */
.admin-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    position: relative;
}

.admin-card {
    border-top: 3px solid #e5e7eb;
    transition: all 0.3s ease;
}

.admin-card:hover {
    transform: translateY(-2px);
    border-top-color: #409eff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* 头像区域样式 */
.admin-avatar {
    position: relative;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
}

:deep(.el-avatar) {
    border: 4px solid #f8fafc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    font-size: 24px;
    background-color: #409eff;
    color: white;
}

/* 修改状态指示器位置 */
.admin-status {
    position: absolute;
    right: calc(50% - 36px);  /* 调整到头像右边缘 */
    bottom: -2px;  /* 微调底部位置 */
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #f56c6c;
    border: 2px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.admin-status.active {
    background-color: #67c23a;
}

/* 信息区域样式 */
.admin-info {
    text-align: center;
    margin-bottom: 20px;
}

.admin-name {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
}

.admin-role {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

/* 联系信息样式 */
.admin-contact {
    background: #f8fafc;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    color: #64748b;
    font-size: 14px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.contact-item:hover {
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.contact-item .el-icon {
    font-size: 16px;
    color: #409eff;
}

/* 操作按钮样式 */
.admin-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: auto;
}

:deep(.el-button--danger.is-text) {
    color: #f56c6c;
    padding: 8px 24px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
}

:deep(.el-button--danger.is-text:hover) {
    color: #fff;
    background-color: #f56c6c;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 108, 108, 0.2);
}

/* 搜索区域样式优化 */
.search-wrapper {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin: 0 24px 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #ebeef5;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* 左侧搜索区域 */
.search-input {
    width: 300px;
    margin-right: 12px;
}

/* 按钮组样式 */
.search-buttons {
    display: flex;
    align-items: center;
    gap: 16px;  /* 增加按钮之间的间距 */
}

/* 按钮基础样式 */
:deep(.el-button) {
    padding: 0 20px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-weight: 500;
    border-radius: 6px;
}

/* 搜索按钮 */
:deep(.search-buttons .el-button--primary) {
    background-color: #409eff;
    border-color: #409eff;
}

/* 重置按钮 */
:deep(.search-buttons .el-button:not(.el-button--primary)) {
    background-color: #fff;
    border: 1px solid #dcdfe6;
}

/* 新设管理员按钮 */
:deep(.search-buttons .el-button--primary:last-child) {
    background-color: #67c23a;
    border-color: #67c23a;
    margin-left: 16px;  /* 与其他按钮保持一定距离 */
    padding: 0 24px;    /* 稍微加宽一点 */
}

/* 分页样式 */
.pagination-container {
    background: #fff;
    padding: 16px 24px;
    border-radius: 12px;
    margin: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #ebeef5;
}

:deep(.el-pagination) {
    justify-content: flex-end;
}

.total-count {
    color: #409eff;
    font-weight: 600;
    margin: 0 4px;
}

/* 选项卡样式 */
.user-tabs {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.el-tabs__nav-wrap::after) {
    height: 2px;
    background-color: #f1f5f9;
}

:deep(.el-tabs__item) {
    font-size: 16px;
    font-weight: 500;
    padding: 0 24px;
    height: 48px;
    line-height: 48px;
    color: #64748b;
    transition: all 0.3s;
}

:deep(.el-tabs__item.is-active) {
    color: #409eff;
    font-weight: 600;
}

:deep(.el-tabs__active-bar) {
    background-color: #409eff;
    height: 3px;
    border-radius: 3px;
}
</style>
