"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
      userName: "",
      role: "1"
      // 1为管理员，2为普通用户
    };
  },
  mounted() {
    const token = common_vendor.index.getStorageSync("token");
    const role = common_vendor.index.getStorageSync("role");
    if (token) {
      this.isLoggedIn = true;
      this.role = role;
      if (this.role === 1) {
        this.menuItems.splice(2, 0, {
          text: "二维码核销",
          icon: "http://localhost:8888/icon/my/qrcodeIcon.png"
        });
      }
      common_vendor.index.request({
        url: "/api/user/getUserInfoById",
        method: "POST",
        data: { token },
        success: (response) => {
          if (response.data.status === 200) {
            this.userName = response.data.data.username;
          } else {
            this.isLoggedIn = false;
          }
        },
        fail: (error) => {
          console.error("获取用户信息失败", error);
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
        return this.menuItems.filter((item) => item.text !== "退出登录");
      }
    }
  },
  methods: {
    loginClick() {
      common_vendor.index.reLaunch({
        url: "../../pages/login/login"
      });
    },
    handleMenuItemClick(pageText) {
      if (!this.isLoggedIn && pageText !== "退出登录") {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
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
        common_vendor.index.navigateTo({
          url
        });
      }
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.clearStorageSync();
            this.isLoggedIn = false;
            this.userName = "";
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success",
              duration: 1500
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "../../pages/login/login"
              });
            }, 1500);
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isLoggedIn
  }, !$data.isLoggedIn ? {
    b: $data.noLogin,
    c: common_vendor.o((...args) => $options.loginClick && $options.loginClick(...args))
  } : {
    d: $data.loggedInAvatar,
    e: common_vendor.t($data.userName),
    f: common_vendor.o(($event) => $options.handleMenuItemClick("个人信息"))
  }, {
    g: common_vendor.f($options.filteredMenuItems, (item, index, i0) => {
      return common_vendor.e({
        a: item.icon
      }, item.icon ? {
        b: item.icon
      } : {}, {
        c: common_vendor.t(item.text),
        d: !item.noArrow
      }, !item.noArrow ? {} : {}, {
        e: index,
        f: common_vendor.o(($event) => $options.handleMenuItemClick(item.text), index)
      });
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2f1ef635"], ["__file", "D:/hsupp/小程序/red_tour/pages/my/my.vue"]]);
wx.createPage(MiniProgramPage);
