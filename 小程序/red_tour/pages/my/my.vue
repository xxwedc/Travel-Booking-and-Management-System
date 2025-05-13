<template>
  <view class="container">
    <view class="header" v-if="!isLoggedIn" @click="loginClick">
      <image :src="noLogin" mode="widthFix" class="avatar"></image>
      <view class="welcome">
        <text>未登录</text>
        <text>马上登录，使用更多功能</text>
      </view>
    </view>
    <view class="header" v-else @click="handleMenuItemClick('个人信息')">
      <image :src="loggedInAvatar" mode="widthFix" class="avatar"></image>
      <view class="welcome">
        <text>{{userName}}</text>
        <text>欢迎您~~~</text>
      </view>
    </view>
    <view class="menu">
      <view v-for="(item, index) in filteredMenuItems" :key="index" class="menu-item" @click="handleMenuItemClick(item.text)">
        <image v-if="item.icon" :src="item.icon" class="icon" mode="widthFix"></image>
        <text>{{item.text}}</text>
        <view v-if="!item.noArrow" class="arrow"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      noLogin: "http://localhost:8888/other/nologin0.png",
      loggedInAvatar: "http://localhost:8888/other/nologin1.png",
      menuItems: [
        {
          text: "个人信息",
          icon: "http://localhost:8888/icon/my/xiugai.png"
        },
        {
          text: "我的预约",
          icon: "http://localhost:8888/icon/my/yuyue.png"
        },
        {
          text: "关于我们",
          icon: "http://localhost:8888/icon/my/about.png",
          noArrow: true
        },
        {
          text: "退出登录",
          icon: "http://localhost:8888/icon/my/logout.png",
          noArrow: true
        }
      ],
      isLoggedIn: false,
      userName: '',
      role: '1', // 1为管理员，2为普通用户
    };
  },
  mounted() {
    const token = uni.getStorageSync('token');
    const role = uni.getStorageSync('role'); // 获取缓存中的 role 字段
    if (token) {
      this.isLoggedIn = true;
      this.role = role; // 设置 role
      if (this.role === 1) {
        // 如果是管理员，动态添加 "二维码核销" 选项
        this.menuItems.splice(2, 0, {
          text: "二维码核销",
          icon: "http://localhost:8888/icon/my/qrcodeIcon.png"
        });
      }
      uni.request({
        url: '/api/user/getUserInfoById',
        method: 'POST',
        data: { token },
        success: (response) => {
          if (response.data.status === 200) {
            this.userName = response.data.data.username;
          } else {
            this.isLoggedIn = false;
          }
        },
        fail: (error) => {
          console.error('获取用户信息失败', error);
          this.isLoggedIn = false;
        }
      });
    }
  },
  computed: {
    filteredMenuItems() {
      if (this.isLoggedIn) {
        return this.menuItems;
      } else {
        // 未登录时过滤掉"退出登录"按钮
        return this.menuItems.filter(item => item.text !== "退出登录");
      }
    }
  },
  methods: {
   
    loginClick() {
      uni.reLaunch({
        url: '../../pages/login/login'
      });
    },
    handleMenuItemClick(pageText) {
      if (!this.isLoggedIn && pageText !== "退出登录") {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
      
      let url;
      switch (pageText) {
        case "个人信息":
          url = "../../pages/userInfo/userInfo";
          break;
        case "我的预约":
          url = "../../pages/myOrder/myOrder";
          break;
        case "二维码核销":
          url = "../../pages/qrCode/qrCode";
          break;
        case "关于我们":
          url = "../../pages/aboutUs/aboutUs";
          break;
        case "退出登录":
          this.handleLogout();
          return;
      }
      if (url) {
        uni.navigateTo({
          url
        });
      }
    },

    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清理缓存
            uni.clearStorageSync();
            // 重置登录状态
            this.isLoggedIn = false;
            this.userName = '';
            // 显示提示
            uni.showToast({
              title: '已退出登录',
              icon: 'success',
              duration: 1500
            });
            // 可选：跳转到登录页面
            setTimeout(() => {
              uni.reLaunch({
                url: '../../pages/login/login'
              });
            }, 1500);
          }
        }
      });
    }
  }
};
</script>

<style scoped>
  @import "../../styles/my/my.css";

  /* 统一所有图标颜色 */
  .menu-item .icon {
    width: 24px;
    height: 24px;
    /* 使用 filter 属性来设置所有图标颜色为红色 (#FF0036) */
    filter: invert(27%) sepia(91%) saturate(7480%) hue-rotate(351deg) brightness(97%) contrast(120%);
  }
</style>