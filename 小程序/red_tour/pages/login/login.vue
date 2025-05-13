<template>
  <view class="register-container">
    <view class="title">
      <text>欢迎登录</text>
    </view>
    <view class="input-item">
      <text class="label">* 手机号码</text>
      <input type="text" v-model="phoneNumber" placeholder="填写您的手机号码" />
    </view>
    <view class="input-item">
      <text class="label">* 密码</text>
      <input type="text" password="true" v-model="password" placeholder="填写您的密码" />
    </view>
    <view class="input-item captcha-container">
      <view class="captcha-input">
        <text class="label">* 验证码</text>
        <input type="text" v-model="captchaInput" placeholder="请输入验证码" />
      </view>
      <view class="captcha-area">
        <canvas canvas-id="myCanvas" @click="generateNewCaptcha"></canvas>
        <text class="yzm-link">点击刷新</text>
      </view>
    </view>
    <button type="primary" class="submit-btn" @click="submitForm">登 录</button>
    <text v-if="errorMessage" class="error-message">{{errorMessage}}</text>
    <text v-if="successMessage" class="success-message">{{successMessage}}</text>
  </view>
  <view class="bottom-links">
    <text class="forgot-password" @click="goToForgotPassword">忘记密码？</text>
    <text class="register-link" @click="goToRegister">未有账号，前往注册</text>
  </view>
</template>

<script>
import generateCaptcha from '../../../red_tour/utils/canvas.js';

export default {
  data() {
    return {
      phoneNumber: '',
      password: '',
      captchaInput: '',
      errorMessage: '',
      successMessage: '',
      tempCaptcha: ''
    };
  },
  methods: {
    generateNewCaptcha() {
      this.tempCaptcha = generateCaptcha();
      this.captchaInput = '';
    },
    async submitForm() {
      this.errorMessage = '';
      this.successMessage = '';
      if (!this.phoneNumber ||!this.phoneNumber.match(/^\d{11}$/)) {
        this.errorMessage = '请输入正确的 11 位手机号码';
        return;
      }
      if (!this.password) {
        this.errorMessage = '请输入密码';
        return;
      }
      if (!this.captchaInput) {
        this.errorMessage = '请输入验证码';
        return;
      }
      const isCaptchaValid = this.captchaInput.toLowerCase() === this.tempCaptcha.toLowerCase();
      if (!isCaptchaValid) {
        this.errorMessage = '验证码错误，请重新输入';
        this.generateNewCaptcha();
        return;
      } else {
        try {
          const response = await uni.request({
            url: '/user/login',
            method: 'POST',
            data: {
              account: this.phoneNumber,
              password: this.password,
            },
          });
          if (response.data.status === 200) {
              // 把前端返回的 token 写入缓存
              uni.setStorageSync('token', response.data.data);
              this.successMessage = '正在登录...';
              setTimeout(() => {
                  uni.switchTab({
                      url: '/pages/my/my' // 替换为你的 tabBar 页面路径
                  });
              }, 1000);
          }else if(response.data.status === 201){
            // 把前端返回的 token 写入缓存
            uni.setStorageSync('token', response.data.data);
            uni.setStorageSync('role', 1);
              this.successMessage = '管理员账号登录...';
              setTimeout(() => {
                  uni.switchTab({
                      url: '/pages/my/my' // 替换为你的 tabBar 页面路径
                  });
              }, 1000);

          } else {
              this.errorMessage = '登录失败';
          }
        } catch (error) {
			console.log("catch错误"+error.message)
           this.errorMessage = 'login failed';
        }
      }
    },
    goToRegister() {
      uni.reLaunch({
        url: '../../pages/register/register',
      });
      console.log('跳转到注册页面');
    },
    goToForgotPassword() {
      uni.navigateTo({
        url: '../../pages/forgotPassword/forgotPassword'
      });
    }
  },
  onLoad() {
    this.generateNewCaptcha();
  }
};
</script>

<style>
@import "../../styles/my/login.css";


</style>