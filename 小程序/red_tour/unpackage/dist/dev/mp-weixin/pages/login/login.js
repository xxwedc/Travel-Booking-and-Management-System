"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_canvas = require("../../utils/canvas.js");
const _sfc_main = {
  data() {
    return {
      phoneNumber: "",
      password: "",
      captchaInput: "",
      errorMessage: "",
      successMessage: "",
      tempCaptcha: ""
    };
  },
  methods: {
    generateNewCaptcha() {
      this.tempCaptcha = utils_canvas.generateCaptcha();
      this.captchaInput = "";
    },
    async submitForm() {
      this.errorMessage = "";
      this.successMessage = "";
      if (!this.phoneNumber || !this.phoneNumber.match(/^\d{11}$/)) {
        this.errorMessage = "请输入正确的 11 位手机号码";
        return;
      }
      if (!this.password) {
        this.errorMessage = "请输入密码";
        return;
      }
      if (!this.captchaInput) {
        this.errorMessage = "请输入验证码";
        return;
      }
      const isCaptchaValid = this.captchaInput.toLowerCase() === this.tempCaptcha.toLowerCase();
      if (!isCaptchaValid) {
        this.errorMessage = "验证码错误，请重新输入";
        this.generateNewCaptcha();
        return;
      } else {
        try {
          const response = await common_vendor.index.request({
            url: "/user/login",
            method: "POST",
            data: {
              account: this.phoneNumber,
              password: this.password
            }
          });
          if (response.data.status === 200) {
            common_vendor.index.setStorageSync("token", response.data.data);
            this.successMessage = "正在登录...";
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/my/my"
                // 替换为你的 tabBar 页面路径
              });
            }, 1e3);
          } else if (response.data.status === 201) {
            common_vendor.index.setStorageSync("token", response.data.data);
            common_vendor.index.setStorageSync("role", 1);
            this.successMessage = "管理员账号登录...";
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/my/my"
                // 替换为你的 tabBar 页面路径
              });
            }, 1e3);
          } else {
            this.errorMessage = "登录失败";
          }
        } catch (error) {
          console.log("catch错误" + error.message);
          this.errorMessage = "login failed";
        }
      }
    },
    goToRegister() {
      common_vendor.index.reLaunch({
        url: "../../pages/register/register"
      });
      console.log("跳转到注册页面");
    },
    goToForgotPassword() {
      common_vendor.index.navigateTo({
        url: "../../pages/forgotPassword/forgotPassword"
      });
    }
  },
  onLoad() {
    this.generateNewCaptcha();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.phoneNumber,
    b: common_vendor.o(($event) => $data.phoneNumber = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: $data.captchaInput,
    f: common_vendor.o(($event) => $data.captchaInput = $event.detail.value),
    g: common_vendor.o((...args) => $options.generateNewCaptcha && $options.generateNewCaptcha(...args)),
    h: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    i: $data.errorMessage
  }, $data.errorMessage ? {
    j: common_vendor.t($data.errorMessage)
  } : {}, {
    k: $data.successMessage
  }, $data.successMessage ? {
    l: common_vendor.t($data.successMessage)
  } : {}, {
    m: common_vendor.o((...args) => $options.goToForgotPassword && $options.goToForgotPassword(...args)),
    n: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/hsupp/小程序/red_tour/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
