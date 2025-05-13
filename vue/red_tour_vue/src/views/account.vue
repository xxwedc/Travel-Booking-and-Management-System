<template>
  <div class="account-container">
    <div class="account-header">
      <h1>账号信息</h1>
      <div class="header-divider"></div>
    </div>
    
    <div class="account-content">
      <div class="info-details">
        <transition-group name="fade">
          <div class="info-section" v-for="(section, index) in sections" :key="index">
            <h3 class="section-title">
              <el-icon><component :is="section.icon" /></el-icon>
              {{ section.title }}
            </h3>
            <div class="info-grid">
              <div class="info-item" v-for="(item, idx) in section.items" :key="idx">
                <span class="label">{{ item.label }}</span>
                <span :class="['value', item.type]">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="account-actions">
        <button class="btn primary" @click="handleEdit">
          <el-icon><Edit /></el-icon> 修改信息
        </button>
      </div>
    </div>

    <!-- 添加修改信息对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="修改信息"
      width="500px"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="editForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="editForm.age" :min="1" :max="120" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { User, Phone, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export default {
  name: 'AccountView',
  
  components: {
    User,
    Phone,
    Edit
  },
  
  data() {
    return {
      userInfo: null,
      sections: [
        {
          title: '基本信息',
          icon: 'User',
          items: []
        },
        {
          title: '联系方式',
          icon: 'Phone',
          items: []
        },
        {
          title: '账号信息',
          icon: 'Lock',
          items: []
        }
      ],
      editDialogVisible: false,
      editForm: {
        username: '',
        sex: 1,
        age: 1,
        phone: '',
        address: ''
      },
      editRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getUserInfo()
  },

  methods: {
    async getUserInfo() {
      try {
        const result = await request({
          url: '/api/user/getUserInfoById',
          method: 'POST'
        })
        
        if (result.status === 200) {
          this.userInfo = result.data
          this.updateSections()
        } else {
          ElMessage.error(result.msg || '获取用户信息失败')
        }
      } catch (error) {
        console.error('获取用户信息错误:', error)
        ElMessage.error('获取用户信息失败')
      }
    },

    updateSections() {
      if (!this.userInfo) return

      // 更新基本信息
      this.sections[0].items = [
        { label: '账号', value: this.userInfo.account },
        { label: '用户名', value: this.userInfo.username },
        { label: '性别', value: this.userInfo.sex === 1 ? '男' : '女' },
        { label: '年龄', value: this.userInfo.age || '未设置' }
      ]

      // 更新联系方式
      this.sections[1].items = [
        { label: '手机号', value: this.userInfo.phone || '未设置' },
        { label: '地址', value: this.userInfo.address || '未设置' }
      ]

      // 更新账号信息
      this.sections[2].items = [
        { 
          label: '角色', 
          value: this.userInfo.role === 1 ? '超级管理员' : '普通用户',
          type: 'role' 
        },
        { 
          label: '注册时间', 
          value: this.userInfo.joinedTime // 直接使用后端返回的格式��时间
        }
      ]
    },

    handleEdit() {
      this.editForm = {
        username: this.userInfo.username,
        sex: this.userInfo.sex,
        age: this.userInfo.age,
        phone: this.userInfo.phone,
        address: this.userInfo.address
      }
      this.editDialogVisible = true
    },

    async submitEdit() {
      try {
        await this.$refs.editFormRef.validate()
        
        const result = await request({
          url: '/api/updateUserInfo',  // 修改为正确的接口地址
          method: 'POST',
          data: {
            id: this.userInfo.id,
            username: this.editForm.username,
            sex: this.editForm.sex,
            age: this.editForm.age,
            phone: this.editForm.phone,
            address: this.editForm.address
          }
        })

        if (result.status === 200) {
          ElMessage.success('修改成功')
          this.editDialogVisible = false
          this.getUserInfo()  // 重新获取用户信息
        } else {
          ElMessage.error(result.message || '修改失败')
        }
      } catch (error) {
        console.error('修改信息错误:', error)
        ElMessage.error('修改失败')
      }
    }
  }
}
</script>


<style scoped>
.account-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 改进头部样式 */
.account-header {
  margin-bottom: 40px;
  position: relative;
}

.account-header h1 {
  font-size: 32px;
  color: #1a1a1a;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
}

.header-divider {
  height: 4px;
  width: 80px;
  background: linear-gradient(90deg, #409EFF, #36cfc9);
  border-radius: 4px;
}

/* 内容区域样式优化 */
.account-content {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.info-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 30px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.info-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 18px;
  color: #1a1a1a;
  margin-bottom: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title .el-icon {
  font-size: 20px;
  color: #409EFF;
}

/* 信息项样式优化 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.label {
  color: #64748b;
  width: 80px;
  font-size: 14px;
}

.value {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 15px;
}

.role {
  color: #409EFF;
  background: rgba(64, 158, 255, 0.1);
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 600;
}

/* 按钮样式优化 */
.account-actions {
  margin-top: 50px;
  padding-top: 40px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.btn {
  padding: 14px 32px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}

.btn.primary {
  background: #409EFF;
  color: #fff;
  border-color: #409EFF;
}

.btn.primary:hover {
  background: #4dabff;
  border-color: #4dabff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn .el-icon {
  font-size: 16px;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式化 */
@media (max-width: 768px) {
  .account-container {
    padding: 20px;
  }
  
  .account-content {
    padding: 30px 20px;
  }
  
  .info-section {
    padding: 20px;
  }
  
  .account-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn {
    justify-content: center;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-input-number .el-input__wrapper) {
  width: 160px;
}
</style>

