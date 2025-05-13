<template>
  <view class="forgot-password">
    <view class="title">找回密码</view>
    
    <!-- 第一步：身份验证表单 -->
    <view v-if="!verified" class="form-container">
      <!-- 添加微信快捷验证按钮 -->
      <button 
        class="wechat-btn"
        open-type="getPhoneNumber" 
        @getphonenumber="getPhoneNumber"
      >
        <text class="iconfont icon-weixin"></text>
        微信手机号快捷验证
      </button>
      
      <view class="divider">
        <text class="divider-text">或者</text>
      </view>

      <view class="input-group">
        <text class="label">用户名</text>
        <input type="text" v-model="verifyForm.username" placeholder="请输入用户名" />
      </view>
      <view class="input-group">
        <text class="label">手机号</text>
        <input type="text" v-model="verifyForm.phone" placeholder="请输入手机号" />
      </view>
      <button @click="verifyIdentity" class="submit-btn">验证身份</button>
    </view>
    
    <!-- 第二步：修改密码表单 -->
    <view v-else class="form-container">
      <view class="input-group">
        <text class="label">新密码</text>
        <input type="text" password="true" v-model="resetForm.newPassword" placeholder="请输入新密码" />
      </view>
      <view class="input-group">
        <text class="label">确认密码</text>
        <input type="text" password="true" v-model="resetForm.confirmPassword" placeholder="请确认新密码" />
      </view>
      <button @click="resetPassword" class="submit-btn">重置密码</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      verified: false,
      userId: '',
      verifyForm: {
        username: '',
        phone: ''
      },
      resetForm: {
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    async verifyIdentity() {
      // 验证表单完整性
      if (!this.verifyForm.username || !this.verifyForm.phone) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }
      
      try {
        const res = await uni.request({
          url: '/user/checkPassword',
          method: 'POST',
          data: this.verifyForm
        })
        
        if (res.data.status === 200) {
          this.verified = true
          this.userId = res.data.data
          uni.showToast({
            title: res.data.message,
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: res.data.message || '验证失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    },
    
    async resetPassword() {
      if (!this.resetForm.newPassword || !this.resetForm.confirmPassword) {
        uni.showToast({
          title: '请填写完整密码信息',
          icon: 'none'
        })
        return
      }
      
      if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
        uni.showToast({
          title: '两次密码输入不一致',
          icon: 'none'
        })
        return
      }
      
      try {
        const res = await uni.request({
          url: '/api/updateUserInfo',
          method: 'POST',
          data: {
            id: this.userId,           // 用户ID
            password: this.resetForm.newPassword  // 新密码
          }
        })
        
        if (res.data.status === 200) {
          uni.showToast({
            title: '密码修改成功',
            icon: 'success'
          })
          // 清理缓存
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          
          // 延迟跳转到登录页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/login/login'
            })
          }, 1500)
        } else {
          uni.showToast({
            title: res.data.message || '修改失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    },
    // 添加获取手机号方法
    async getPhoneNumber(e) {
    //   模拟器无法获取手机号，不作验证
    }
  }
}
</script>

<style>
.forgot-password {
  padding: 30px 20px;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.form-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  
}

input {
  width: 90%;
  height: 45px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 0 15px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #007AFF;
  background-color: #fff;
  outline: none;
}

.submit-btn {
  width: 100%;
  height: 45px;
  background: linear-gradient(to right, #007AFF, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 30px;
  transition: opacity 0.3s ease;
}

.submit-btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}

/* 占位符样式 */
input::placeholder {
  color: #999;
  font-size: 14px;
}

/* 输入框聚焦时的阴影效果 */
input:focus {
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

/* 微信快捷登录按钮 */
.wechat-btn {
  width: 100%;
  height: 45px;
  background: linear-gradient(to right, #07c160, #0ab356);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: opacity 0.3s ease;
}

.wechat-btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}

/* 微信图标 */
.iconfont.icon-weixin {
  margin-right: 8px;
  font-size: 20px;
}

/* 分割线 */
.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background-color: #e5e5e5;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider-text {
  background-color: #fff;
  padding: 0 15px;
  color: #999;
  font-size: 14px;
}
</style>
