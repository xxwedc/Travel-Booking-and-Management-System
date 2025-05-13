"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      verified: false,
      userId: "",
      verifyForm: {
        username: "",
        phone: ""
      },
      resetForm: {
        newPassword: "",
        confirmPassword: ""
      }
    };
  },
  methods: {
    async verifyIdentity() {
      if (!this.verifyForm.username || !this.verifyForm.phone) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      try {
        const res = await common_vendor.index.request({
          url: "/user/checkPassword",
          method: "POST",
          data: this.verifyForm
        });
        if (res.data.status === 200) {
          this.verified = true;
          this.userId = res.data.data;
          common_vendor.index.showToast({
            title: res.data.message,
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: res.data.message || "验证失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      }
    },
    async resetPassword() {
      if (!this.resetForm.newPassword || !this.resetForm.confirmPassword) {
        common_vendor.index.showToast({
          title: "请填写完整密码信息",
          icon: "none"
        });
        return;
      }
      if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致",
          icon: "none"
        });
        return;
      }
      try {
        const res = await common_vendor.index.request({
          url: "/api/updateUserInfo",
          method: "POST",
          data: {
            id: this.userId,
            // 用户ID
            password: this.resetForm.newPassword
            // 新密码
          }
        });
        if (res.data.status === 200) {
          common_vendor.index.showToast({
            title: "密码修改成功",
            icon: "success"
          });
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userInfo");
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/login/login"
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.data.message || "修改失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      }
    },
    // 添加获取手机号方法
    async getPhoneNumber(e) {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.verified
  }, !$data.verified ? {
    b: common_vendor.o((...args) => $options.getPhoneNumber && $options.getPhoneNumber(...args)),
    c: $data.verifyForm.username,
    d: common_vendor.o(($event) => $data.verifyForm.username = $event.detail.value),
    e: $data.verifyForm.phone,
    f: common_vendor.o(($event) => $data.verifyForm.phone = $event.detail.value),
    g: common_vendor.o((...args) => $options.verifyIdentity && $options.verifyIdentity(...args))
  } : {
    h: $data.resetForm.newPassword,
    i: common_vendor.o(($event) => $data.resetForm.newPassword = $event.detail.value),
    j: $data.resetForm.confirmPassword,
    k: common_vendor.o(($event) => $data.resetForm.confirmPassword = $event.detail.value),
    l: common_vendor.o((...args) => $options.resetPassword && $options.resetPassword(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/forgotPassword/forgotPassword.vue"]]);
wx.createPage(MiniProgramPage);
